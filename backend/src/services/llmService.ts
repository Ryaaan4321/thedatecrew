import {
  REJECTION_TAXONOMY,
  RejectionTaxonomyTag,
  buildTagFeedbackPrompt,
} from "../prompts/tagFeedbackPrompt.js";
import { TagFeedbackResponse } from "../types/index.js";

function classifyFeedbackFallback(rawFeedback: string): TagFeedbackResponse {
  const text = rawFeedback.toLowerCase();
  const matchedTags: RejectionTaxonomyTag[] = [];
  const rationalePoints: string[] = [];

  if (
    /too (fast|soon|intense|quick|rushed|slow)|pace|marriage on date|moving in|future vacations|clingy|pressure|commitment/i.test(
      text
    )
  ) {
    matchedTags.push("pace_mismatch");
    rationalePoints.push(
      "Feedback mentions relationship pacing or excessive intensity/speed early on."
    );
  }

  if (
    /ambition|career|unemployed|lazy|video games|drive|work ethic|motivation|goals|jobless|stagnant/i.test(
      text
    )
  ) {
    matchedTags.push("career_ambition_gap");
    rationalePoints.push(
      "Feedback indicates a disparity in professional drive, career goals, or motivation."
    );
  }

  if (
    /values|politics|morals|ethics|worldview|perspective on life|incompatible outlook|beliefs/i.test(
      text
    )
  ) {
    matchedTags.push("values_mismatch");
    rationalePoints.push("Mentions conflicting life philosophies, politics, or values.");
  }

  if (
    /kids|children|in-laws|family|parenting|custody|biological clock|parents/i.test(text)
  ) {
    matchedTags.push("family_expectations");
    rationalePoints.push("Refers to childbearing, family dynamics, or parental expectations.");
  }

  if (
    /talked (over|too much|only about)|interrupt|ghost|texting|communication|rude|tone|sarcastic|arrogant|defensive|listening|monologue/i.test(
      text
    )
  ) {
    matchedTags.push("communication_style");
    rationalePoints.push("Reflects interpersonal friction in conversational style or listening.");
  }

  if (
    /chemistry|spark|attraction|appearance|looks|not my type physically|no vibe|friend vibe/i.test(
      text
    )
  ) {
    matchedTags.push("physical_attraction");
    rationalePoints.push(
      "Mentions absent romantic spark, chemistry, or physical attraction."
    );
  }

  if (
    /dealbreaker|lied about|smoking|vaped|cigarette|secretly|allergy|cat|dog|promised not to/i.test(
      text
    )
  ) {
    matchedTags.push("dealbreaker_violation");
    rationalePoints.push(
      "Explicitly cites violation of a non-negotiable stated dealbreaker."
    );
  }

  if (
    /money|cheap|expensive|split the bill|wealth|financial|spending|debt|broke|stingy/i.test(
      text
    )
  ) {
    matchedTags.push("financial_mismatch");
    rationalePoints.push("Cites financial divergence, spending habits, or money attitudes.");
  }

  if (matchedTags.length === 0) {
    matchedTags.push("other");
    rationalePoints.push(
      "Feedback contains nuanced or subjective impressions outside core primary taxonomies."
    );
  }

  return {
    tags: matchedTags.slice(0, 3),
    confidence: matchedTags.length > 0 && matchedTags[0] !== "other" ? 0.88 : 0.65,
    rationale: rationalePoints.join(" "),
    source: "classifier-rule-fallback",
  };
}

export async function classifyRejectionFeedback(
  rawFeedback: string
): Promise<TagFeedbackResponse> {
  const prompt = buildTagFeedbackPrompt(rawFeedback);

  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (anthropicKey) {
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": anthropicKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 300,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (response.ok) {
        const data = (await response.json()) as any;
        const textContent = data.content?.[0]?.text;
        if (textContent) {
          const cleanJson = textContent.replace(/```json\n?|```/g, "").trim();
          const parsed = JSON.parse(cleanJson);
          return {
            tags: parsed.tags.filter((t: string) =>
              (REJECTION_TAXONOMY as readonly string[]).includes(t)
            ),
            confidence: Number(parsed.confidence) || 0.9,
            rationale: parsed.rationale || "Categorized via Claude 3.5 Sonnet.",
            source: "llm",
          };
        }
      }
    } catch (err) {
      console.warn("Anthropic API call failed, falling back to local classifier:", err);
    }
  }

  const openAiKey = process.env.OPENAI_API_KEY;
  if (openAiKey) {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openAiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          response_format: { type: "json_object" },
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (response.ok) {
        const data = (await response.json()) as any;
        const textContent = data.choices?.[0]?.message?.content;
        if (textContent) {
          const parsed = JSON.parse(textContent);
          return {
            tags: parsed.tags.filter((t: string) =>
              (REJECTION_TAXONOMY as readonly string[]).includes(t)
            ),
            confidence: Number(parsed.confidence) || 0.9,
            rationale: parsed.rationale || "Categorized via OpenAI.",
            source: "llm",
          };
        }
      }
    } catch (err) {
      console.warn("OpenAI API call failed, falling back to local classifier:", err);
    }
  }

  return classifyFeedbackFallback(rawFeedback);
}
