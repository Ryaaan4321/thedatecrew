"use client";

import React from "react";
import {
  AlertCircle,
  FileText,
  Lightbulb,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

export const AssessmentView: React.FC = () => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      <div className="bg-forest text-cream rounded-3xl p-8 sm:p-10 shadow-xs border border-beige/20">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-sand/20 text-sand text-[10px] uppercase tracking-widest font-medium mb-4 border border-sand/30">
          <FileText className="w-3.5 h-3.5" />
          The Date Crew &bull; Product &amp; Tech Assessment
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-cream leading-tight">
          Executive Diagnosis, Solution Architecture &amp; <em>Submission</em>
        </h1>
        <p className="text-sand/90 mt-3 text-xs sm:text-sm max-w-2xl leading-relaxed font-light">
          Comprehensive responses for Parts 1, 2, 4, and AI Usage, grounded in TDC's 30-day funnel data:
          1,000 shared, 310 accepted, 35% stated dealbreaker leakage, and 2.1x matchmaker variance.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="rounded-2xl p-4 text-center bg-surface border border-beige shadow-xs">
          <div className="text-[10px] uppercase tracking-wider text-ink-muted font-medium">Shared</div>
          <div className="font-serif text-2xl font-bold text-ink mt-1">1,000</div>
          <div className="text-[10px] text-ink-muted mt-0.5">100%</div>
        </div>
        <div className="rounded-2xl p-4 text-center bg-surface border border-status-send-border shadow-xs">
          <div className="text-[10px] uppercase tracking-wider text-status-send-text font-medium">Accepted</div>
          <div className="font-serif text-2xl font-bold text-status-send-text mt-1">310</div>
          <div className="text-[10px] text-status-send-text bg-status-send-bg px-2.5 py-0.5 rounded-full inline-block mt-1 font-medium">31.0% Rate</div>
        </div>
        <div className="rounded-2xl p-4 text-center bg-surface border border-beige shadow-xs">
          <div className="text-[10px] uppercase tracking-wider text-ink-muted font-medium">Contacts</div>
          <div className="font-serif text-2xl font-bold text-ink mt-1">210</div>
          <div className="text-[10px] text-ink-muted mt-0.5">67.7% of acc.</div>
        </div>
        <div className="rounded-2xl p-4 text-center bg-surface border border-beige shadow-xs">
          <div className="text-[10px] uppercase tracking-wider text-ink-muted font-medium">Convos</div>
          <div className="font-serif text-2xl font-bold text-ink mt-1">150</div>
          <div className="text-[10px] text-ink-muted mt-0.5">71.4% drop</div>
        </div>
        <div className="rounded-2xl p-4 text-center bg-surface border border-beige shadow-xs">
          <div className="text-[10px] uppercase tracking-wider text-ink-muted font-medium">Meetings</div>
          <div className="font-serif text-2xl font-bold text-ink mt-1">75</div>
          <div className="text-[10px] text-ink-muted mt-0.5">50.0% fixed</div>
        </div>
        <div className="rounded-2xl p-4 text-center bg-surface border border-beige shadow-xs">
          <div className="text-[10px] uppercase tracking-wider text-ink-muted font-medium">Completed</div>
          <div className="font-serif text-2xl font-bold text-ink mt-1">42</div>
          <div className="text-[10px] text-ink-muted mt-0.5">4.2% End</div>
        </div>
      </div>

      <div className="rounded-2xl p-7 sm:p-8 shadow-xs bg-surface border border-beige">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-beige">
          <ShieldAlert className="w-5 h-5 text-forest" />
          <div>
            <span className="text-[11px] uppercase tracking-wider text-gold-text font-medium block">01 / Problem Diagnosis</span>
            <h2 className="font-serif text-2xl text-ink font-normal tracking-tight">
              Diagnose the Problem (~300 words)
            </h2>
          </div>
        </div>

        <div className="space-y-6 text-xs text-ink leading-relaxed">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gold-text mb-3">
              1. Three Most Important Questions to Investigate
            </h3>
            <div className="space-y-3.5 pl-4 border-l-2 border-forest">
              <div>
                <strong className="text-ink block font-semibold mb-1">
                  Question 1: Why are matchmakers sending profiles that fail already-stated dealbreakers (35% of all rejections)?
                </strong>
                <p className="text-ink-muted">
                  <em>Why it matters:</em> 241 of the 690 rejections were preventable before sending. We must isolate whether this stems from manual search fatigue across large catalogs, UI invisibility of dealbreakers in email workflows, or inventory shortages in specific sub-segments. Fixing this stops self-inflicted client churn.
                </p>
              </div>

              <div>
                <strong className="text-ink block font-semibold mb-1">
                  Question 2: What specific behavioral differences drive Matchmaker A's 44% acceptance rate vs. Matchmaker B's 21%?
                </strong>
                <p className="text-ink-muted">
                  <em>Why it matters:</em> A 2.1x performance gap indicates process variance rather than client pool heterogeneity. Does Matchmaker A apply stricter implicit thresholds, conduct deeper pre-screening calls, or maintain better mental models of historical client rejections? Codifying Matchmaker A's intuition levels up the entire team.
                </p>
              </div>

              <div>
                <strong className="text-ink block font-semibold mb-1">
                  Question 3: Where do clients demonstrate "stated vs. revealed" preference divergence?
                </strong>
                <p className="text-ink-muted">
                  <em>Why it matters:</em> Some clients reject a profile type early on, but later accept a similar candidate. Determining which preferences are truly rigid (e.g., non-smoker, childfree) versus negotiable (e.g., exact age bracket, college tier) prevents over-filtering and unlocks viable inventory.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gold-text mb-2">
              2. What is the Biggest Problem in the Funnel?
            </h3>
            <p className="text-ink-muted bg-paper p-4 rounded-2xl border border-beige leading-relaxed">
              <strong className="text-ink">The primary leak is the 69% top-of-funnel rejection rate (690 rejections / 1,000 shared profiles) driven by unassisted manual matching without hard-constraint enforcement.</strong> Out of 1,000 shared profiles, 690 are rejected immediately. 35% of those rejections violate constraints the client already provided. Assuming matchmakers spend ~2 hours/client/week searching, hundreds of operational hours are wasted sending candidates dead on arrival.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gold-text mb-3">
              3. Three Metrics to Track
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              <div className="bg-paper p-4 rounded-2xl border border-beige shadow-xs">
                <span className="text-[11px] uppercase tracking-wider text-gold-text font-medium block mb-1">
                  1. Dealbreaker Leakage (%)
                </span>
                <span className="text-ink-muted leading-relaxed block">
                  % of shared profiles violating hard client dealbreakers. Target: 0%. Immediately validates hard guardrails.
                </span>
              </div>
              <div className="bg-paper p-4 rounded-2xl border border-beige shadow-xs">
                <span className="text-[11px] uppercase tracking-wider text-gold-text font-medium block mb-1">
                  2. Profile Acceptance (%)
                </span>
                <span className="text-ink-muted leading-relaxed block">
                  Accepted profiles / total shared profiles. Target: Increase from 31% to &gt;50%, narrowing matchmaker variance.
                </span>
              </div>
              <div className="bg-paper p-4 rounded-2xl border border-beige shadow-xs">
                <span className="text-[11px] uppercase tracking-wider text-gold-text font-medium block mb-1">
                  3. Search Time (Hrs/Wk)
                </span>
                <span className="text-ink-muted leading-relaxed block">
                  Measures operational efficiency. Target: Reduce from 2.0 hrs to &lt;45 mins via automated ranking.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl p-7 sm:p-8 shadow-xs bg-surface border border-beige">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-beige">
          <Lightbulb className="w-5 h-5 text-forest" />
          <div>
            <span className="text-[11px] uppercase tracking-wider text-gold-text font-medium block">02 / Solution Design</span>
            <h2 className="font-serif text-2xl text-ink font-normal tracking-tight">
              Design a Solution (~500 words)
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-ink leading-relaxed">
          <div className="space-y-4">
            <div>
              <h4 className="text-[11px] uppercase tracking-wider text-gold-text font-medium mb-1.5">
                Problem
              </h4>
              <p className="text-ink-muted">
                Matchmakers currently search and evaluate candidates manually over email without systematic guardrails. This causes 35% of profile rejections to occur on previously stated dealbreakers, leaves valuable post-date feedback stranded in unstructured text, and creates a 2.1x performance gap between matchmakers.
              </p>
            </div>

            <div>
              <h4 className="text-[11px] uppercase tracking-wider text-gold-text font-medium mb-1.5">
                User
              </h4>
              <p className="text-ink-muted">
                <strong className="text-ink">Internal Matchmakers (e.g. Matchmaker A &amp; B) and Head of Matchmaking.</strong> The matchmaker remains the empathetic, high-touch decision-maker who sends the final email, but is now equipped with an AI-assisted pre-flight screening copilot.
              </p>
            </div>

            <div>
              <h4 className="text-[11px] uppercase tracking-wider text-gold-text font-medium mb-1.5">
                Solution Architecture
              </h4>
              <p className="text-ink-muted">
                A lightweight pre-send screening copilot that runs 4 deterministic and intelligence steps before any profile is queued:
              </p>
              <ul className="list-disc pl-4 mt-1.5 space-y-1 text-ink-muted">
                <li><strong className="text-ink">Deterministic Hard Filter:</strong> Disqualifies any candidate violating hard constraints (smoking, kids, distance).</li>
                <li><strong className="text-ink">Weighted Preference Score (0–100):</strong> Ranks candidates on core traits using tunable weights.</li>
                <li><strong className="text-ink">Historical Pattern Risk Engine:</strong> Flags candidates matching repeated rejection tags (e.g., 2+ pace mismatches).</li>
                <li><strong className="text-ink">Matchmaker Threshold (k):</strong> Calibrated per matchmaker to recommend Send, Hold, or Reject with plain-language explanations.</li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-[11px] uppercase tracking-wider text-gold-text font-medium mb-1.5">
                Data Requirements
              </h4>
              <ul className="list-disc pl-4 space-y-1 text-ink-muted">
                <li><strong className="text-ink">Client Data:</strong> Stated preferences, dealbreaker tags, and past rejection history.</li>
                <li><strong className="text-ink">Candidate Data:</strong> Verified lifestyle, age, location, career traits, relationship pacing.</li>
                <li><strong className="text-ink">Feedback Records:</strong> Raw text mapped to our 9-item structured taxonomy.</li>
                <li><strong className="text-ink">Matchmaker Benchmarks:</strong> Historical acceptance rate and baseline threshold k.</li>
              </ul>
            </div>

            <div>
              <h4 className="text-[11px] uppercase tracking-wider text-gold-text font-medium mb-1.5">
                Technology Stack
              </h4>
              <ul className="list-disc pl-4 space-y-1 text-ink-muted">
                <li><strong className="text-ink">Backend:</strong> Node.js + Express REST API with TypeScript.</li>
                <li><strong className="text-ink">Scoring Engine:</strong> 100% deterministic code with configurable weights (zero LLM hallucinations for ranking).</li>
                <li><strong className="text-ink">LLM Taxonomy Service:</strong> Anthropic Claude 3.5 Sonnet / OpenAI with strict JSON output schema and fallback classifier for tagging unstructured feedback.</li>
                <li><strong className="text-ink">Frontend:</strong> Next.js 16 (App Router) + Tailwind CSS.</li>
              </ul>
            </div>

            <div>
              <h4 className="text-[11px] uppercase tracking-wider text-status-send-text font-medium mb-1.5">
                Primary Success Metric
              </h4>
              <p className="bg-status-send-bg/70 border border-status-send-border p-3.5 rounded-2xl text-status-send-text leading-relaxed">
                <strong>Profile Acceptance Rate increases from 31% to &gt;48% within 30 days</strong>, while eliminating 100% of stated-dealbreaker rejections and saving 1.25 hours/client/week in matchmaker search time.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl p-7 sm:p-8 shadow-xs bg-surface border border-beige">
        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-beige">
          <AlertCircle className="w-5 h-5 text-status-hold-text" />
          <div>
            <span className="text-[11px] uppercase tracking-wider text-gold-text font-medium block">03 / Stress Testing</span>
            <h2 className="font-serif text-2xl text-ink font-normal tracking-tight">
              Part 4 &bull; One <em>Curveball</em> (&lt; 200 words)
            </h2>
          </div>
        </div>

        <div className="bg-status-hold-bg/60 border border-status-hold-border rounded-2xl p-6 text-xs text-status-hold-text leading-relaxed space-y-3.5">
          <p className="font-semibold text-status-hold-text text-xs">
            Scenario: The solution launches. Two weeks later, profile acceptance rate does not move at all.
          </p>

          <div>
            <strong className="text-status-hold-text block font-semibold mb-0.5">1. What to check first:</strong>
            <p className="text-status-hold-text/90">
              Check matchmaker compliance and override rates. Are matchmakers actually adhering to the tool's recommendations, or are they ignoring "Hold/Reject" flags and sending the same profiles as before? Check if Matchmaker B simply bypassed high thresholds.
            </p>
          </div>

          <div>
            <strong className="text-status-hold-text block font-semibold mb-0.5">2. What data to look at:</strong>
            <p className="text-status-hold-text/90">
              Compare <em>dealbreaker leakage rate</em> (did the 35% stated rejection drop to 0%?) against <em>new rejection reasons</em>. If dealbreaker rejections fell to 0% but overall acceptance didn't move, examine the new rejection tags — did rejections simply shift to uncaptured visual/chemistry factors or unstated criteria?
            </p>
          </div>

          <div>
            <strong className="text-status-hold-text block font-semibold mb-0.5">3. Iterate, change, or kill?</strong>
            <p className="text-status-hold-text/90">
              <strong>Iterate, do not kill.</strong> If dealbreaker leaks stopped, the hard filter worked. Re-calibrate weights: lower demographic weights (education/occupation) and introduce photo/aesthetic preference scoring or conversational tone alignment. If matchmakers ignored the tool, shift from a separate dashboard to an in-line email pre-flight check.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl p-7 sm:p-8 shadow-xs bg-surface border border-beige">
        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-beige">
          <Sparkles className="w-5 h-5 text-forest" />
          <div>
            <span className="text-[11px] uppercase tracking-wider text-gold-text font-medium block">04 / Transparency</span>
            <h2 className="font-serif text-2xl text-ink font-normal tracking-tight">AI Usage Statement (3–5 lines)</h2>
          </div>
        </div>

        <div className="text-xs text-ink-muted space-y-2.5 leading-relaxed bg-paper p-5 rounded-2xl border border-beige">
          <p>
            &bull; <strong className="text-ink">AI Tools Used:</strong> Claude 3.5 Sonnet / OpenAI GPT-4o for natural language taxonomy classification and Antigravity pair programming for full-stack prototype scaffolding.
          </p>
          <p>
            &bull; <strong className="text-ink">What Used For:</strong> Structuring unstructured post-date feedback into taxonomy tags (pace_mismatch, career_ambition_gap), drafting deterministic scoring algorithms, and generating edge-case candidate mock datasets.
          </p>
          <p>
            &bull; <strong className="text-ink">One Suggestion Disagreed With / Changed:</strong> The AI initially suggested using an LLM to generate the final match score and recommendation. I rejected this: LLM scoring is non-deterministic, slow, and prone to hallucinations; instead, I enforced deterministic rule-based scoring with configurable weights and strictly restricted the LLM to unstructured feedback classification.
          </p>
        </div>
      </div>
    </div>
  );
};
