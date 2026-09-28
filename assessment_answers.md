# The Date Crew (TDC) — Product & Tech Assessment
**Candidate Submission Document**

---

## Part 1 — Diagnose the Problem (~300 words)

### 1. Three Most Important Questions to Investigate
1. **Why are matchmakers sending profiles that fail already-stated dealbreakers (35% of all rejections)?**  
   *Why it matters:* 241 of the 690 rejections were entirely preventable before reaching the client. We must identify whether this is caused by manual search fatigue across large catalogs, UI invisibility of dealbreakers in email workflows, or inventory shortages in specific sub-segments. Fixing this stops self-inflicted client churn.
2. **What specific behavioral and screening differences drive Matchmaker A's 44% acceptance rate vs. Matchmaker B's 21%?**  
   *Why it matters:* A 2.1x performance gap signals severe process variance rather than client pool heterogeneity. Does Matchmaker A apply stricter implicit thresholds, conduct deeper pre-screening calls, or maintain better mental models of historical client rejections? Codifying Matchmaker A’s intuition into system defaults levels up the entire team.
3. **Where and why do clients exhibit "stated vs. revealed" preference divergence?**  
   *Why it matters:* Some clients reject a profile type early on, but later accept a similar candidate. Determining which preferences are truly rigid (e.g., non-smoker, childfree) versus negotiable (e.g., exact age bracket, college tier) prevents over-filtering and unlocks viable inventory.

### 2. The Biggest Problem in the Funnel
**The catastrophic 69% top-of-funnel rejection rate (690 rejections / 1,000 shared profiles) caused by unassisted manual matching without hard-constraint enforcement.**  
*Assumptions:*
- Matchmakers spend ~2 hours/client/week searching, meaning hundreds of operational hours are wasted curating candidates that are dead-on-arrival.
- Each preventable rejection erodes client confidence in TDC’s premium human curation.
Top-funnel leakage is the primary bottleneck; fixing top-funnel quality immediately feeds downstream conversions (meetings completed).

### 3. Three Metrics to Track
1. **Dealbreaker Leakage Rate (%):** `(Shared profiles violating stated dealbreakers / Total profiles shared) * 100`. *Target: 0%.* Directly validates that hard guardrails eliminate preventable rejections.
2. **Profile Acceptance Rate (%):** `(Profiles accepted / Profiles shared) * 100`. *Target: Increase from 31% to >50%.* Primary measure of initial match resonance and matchmaker calibration.
3. **Search Time per Client (Hours/Week):** *Target: Reduce from 2.0 hrs to <45 mins.* Measures operational leverage unlocked by deterministic pre-scoring.

---

## Part 2 — Design a Solution (~500 words)

### Problem
Matchmakers currently curate candidate profiles manually over email without systematic guardrails or historical feedback loops. Consequently, 35% of rejections violate explicit client dealbreakers, valuable post-date rejection notes remain trapped in unstructured free text, and matchmakers exhibit a 2.1x variance in conversion.

### User
**Internal Matchmakers (Matchmakers A & B) and the Head of Matchmaking.**  
The matchmaker retains the final decision to send or hold a profile; the system acts as an explainable pre-flight copilot that automates constraint checking and highlights hidden risks.

### Solution
**"TDC Pre-Send Copilot" — an internal pre-send evaluation and candidate ranking system.**  
Before sending a profile to a client, the tool runs an automated 4-stage pipeline:
1. **Deterministic Hard Filter:** Automatically disqualifies any candidate violating non-negotiable dealbreakers (smoking, child preferences, pet allergies, long-distance). Excluded profiles are segregated and never suggested as viable.
2. **Weighted Preference Match Scoring (0–100):** Evaluates candidate attributes against client preferences using configurable weights across age, location, religion, education, occupation, and lifestyle.
3. **Historical Pattern Risk Detection:** Analyzes the client’s historical rejection tags. If a candidate shares traits that caused 2+ past rejections (e.g., fast relationship pacing, low career ambition, aggressive communication), the tool flags the profile with a plain-language warning and applies a calibrated score penalty.
4. **Calibrated Threshold ($k$) & Plain-Language Explanations:** Compares the final score against a matchmaker-specific threshold $k$ (calibrated from historical accept rates: looser $k=68$ for Matchmaker A; stricter $k=78$ for Matchmaker B). Outputs an immediate recommendation (`Send`, `Hold`, or `Reject`) with an explainable summary (e.g., *"85/100 — High baseline match, but caution: candidate has fast relationship pacing matching 2 past rejections"*).

### Data Requirements
- **Client Profiles:** Stated preferences, explicit dealbreaker tags, and structured past rejection records.
- **Candidate Pool:** Verified lifestyle attributes, relationship pacing, career ambition, and personality notes.
- **Taxonomy Mappings:** 9 standardized failure classifications (`pace_mismatch`, `career_ambition_gap`, `values_mismatch`, etc.).
- **Matchmaker Benchmarks:** Historical acceptance rates and calibrated thresholds.

### Technology Stack
- **Backend:** Node.js + Express REST API in TypeScript.
- **Scoring Engine:** Deterministic TypeScript engine with configurable weight matrices (no non-deterministic LLM scoring).
- **LLM Feedback Classification:** Claude 3.5 Sonnet / OpenAI GPT-4o with structured JSON schema (and deterministic keyword fallback) to classify raw rejection text into taxonomy tags.
- **Frontend:** Next.js 16 (App Router) + Tailwind CSS internal dashboard with live $k$-slider and candidate queue.

### Success Metric
**Profile Acceptance Rate increases from 31% to >48% within 30 days**, while reducing dealbreaker leakage from 35% to 0% and saving each matchmaker ~1.25 hours/client/week.

---

## Part 3 — Prototype Architecture & Implementation

The functional prototype is fully implemented in this repository.

### Key Components Built
1. **`POST /api/tag-feedback`:** Ingests raw free-text feedback and outputs structured taxonomy tags, confidence scores, and rationales via an editable prompt (`backend/src/prompts/tagFeedbackPrompt.ts`).
2. **`POST /api/score` & `GET /api/clients/:id/candidates`:** Executes hard filtering, weighted preference scoring, historical pattern risk analysis, and $k$-threshold evaluation.
3. **`GET/PUT /api/matchmakers/:id/threshold`:** Reads and updates matchmaker threshold $k$ with live recalculation.
4. **Next.js Frontend:**
   - **Candidate Queue View:** Interactive client selector, live $k$-slider, color-coded recommendation badges (`Send`, `Hold`, `Reject`), pattern risk alerts, and expandable dimension breakdowns.
   - **Hard-Filter Excluded Drawer:** Segregated, grayed-out list of candidates disqualified by stated dealbreakers with specific violation tags.
   - **Rejection Intake Tool:** Standalone interactive testing sandbox with preset client feedback scenarios to test LLM tag extraction in isolation.

---

## Part 4 — One Curveball (< 200 words)

**Scenario:** The solution launches. Two weeks later, the profile acceptance rate does not move at all.

### 1. What to check first:
**Matchmaker adherence and override rates.** Are matchmakers actually adhering to the tool's `Send`/`Hold` recommendations, or are they overriding the system and emailing the same candidates as before? Specifically verify whether Matchmaker B bypassed their stricter threshold $k=78$.

### 2. What data to look at:
Compare the **Dealbreaker Leakage Rate** against **New Rejection Categories**:
- Did stated-dealbreaker rejections drop to 0%?
- If dealbreaker rejections ceased but total acceptance stayed at 31%, examine the new rejection tags from `/api/tag-feedback`. Are rejections shifting to subjective attributes not captured in profile data (e.g., photo aesthetics, vocal cadence, conversational spark)?

### 3. Would you iterate, change the solution, or kill it?
**Iterate, do not kill.**  
If dealbreaker leaks dropped to 0%, the hard filter succeeded. The lack of top-line movement indicates the preference weights are misaligned with actual client decision drivers (e.g., over-weighting education/occupation over aesthetic or lifestyle nuances). I would downweight demographic attributes, introduce photo-style preference tags, and if adoption was low, embed the check directly into the matchmaker's email composer rather than an external dashboard.

---

## AI Usage Statement (3–5 lines)

- **AI Tools Used:** Claude 3.5 Sonnet / OpenAI GPT-4o for natural language feedback taxonomy classification and Antigravity pair programming for full-stack prototype implementation.
- **What Used For:** Classifying unstructured client rejection feedback into standardized taxonomy tags (`pace_mismatch`, `career_ambition_gap`), drafting deterministic scoring algorithms, and generating candidate seed datasets with edge cases.
- **One Suggestion Disagreed With / Changed:** The AI initially recommended using an LLM to generate the final numerical match score and recommendation. I rejected this: LLMs are non-deterministic, slow, and lack auditability. Instead, I enforced deterministic rule-based scoring with configurable weights, strictly reserving the LLM for unstructured natural language feedback classification.
