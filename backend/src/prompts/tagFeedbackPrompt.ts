export const REJECTION_TAXONOMY = [
  "pace_mismatch",
  "values_mismatch",
  "career_ambition_gap",
  "family_expectations",
  "communication_style",
  "physical_attraction",
  "dealbreaker_violation",
  "financial_mismatch",
  "other",
] as const;

export type RejectionTaxonomyTag = (typeof REJECTION_TAXONOMY)[number];

export const TAXONOMY_DEFINITIONS: Record<RejectionTaxonomyTag, string> = {
  pace_mismatch: "Moving too fast or too slow (e.g. talking about moving in/marriage too early, overly intense, rushing commitment, or dragging feet).",
  values_mismatch: "Divergent core life philosophies, ethics, politics, spirituality, or worldview.",
  career_ambition_gap: "Disparity in work ethic, drive, career trajectory, professional focus, or motivation.",
  family_expectations: "Disagreements regarding children, in-laws, family involvement, or domestic arrangements.",
  communication_style: "Issues with conversational rhythm, responsiveness, tone, defensiveness, sarcasm, or emotional openness.",
  physical_attraction: "Lack of romantic spark, physical chemistry, or aesthetic alignment.",
  dealbreaker_violation: "Direct violation of stated hard constraints (e.g., secret smoking, deception on pet allergies, hidden dealbreakers).",
  financial_mismatch: "Incompatible spending habits, views on wealth, financial independence, or lifestyle costs.",
  other: "Idiosyncratic reasons not fitting into any standard classification category above.",
};

export function buildTagFeedbackPrompt(rawFeedback: string): string {
  return `You are an expert matchmaking analyst for The Date Crew (TDC).
Your task is to analyze raw client rejection feedback from a date, meeting, or profile review, and categorize it into our standardized taxonomy.

### Taxonomy Categories and Definitions:
${Object.entries(TAXONOMY_DEFINITIONS)
  .map(([tag, desc]) => `- "${tag}": ${desc}`)
  .join("\n")}

### Raw Client Feedback:
"""
${rawFeedback}
"""

### Instructions:
1. Identify 1 to 3 tags from the allowed taxonomy that most accurately explain the root reason for rejection.
2. Provide a confidence score between 0.00 and 1.00 indicating certainty.
3. Write a concise rationale (1-2 sentences) explaining why these tags apply.
4. Output ONLY a valid JSON object matching the following schema without markdown formatting or code blocks:
{
  "tags": ["<tag1>", "<tag2>"],
  "confidence": 0.95,
  "rationale": "Clear and direct statement explaining the classification."
}`;
}
