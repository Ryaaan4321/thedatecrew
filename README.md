# The Date Crew (TDC) — Matchmaker Pre-Send Screening Copilot

An internal pre-send evaluation and candidate ranking system built for **The Date Crew (TDC)** to solve the 69% profile rejection rate and eliminate the 35% of rejections caused by stated client dealbreakers.

---

## Key Features

1. **Deterministic Hard Dealbreaker Filter (Step 1):**  
   Automatically disqualifies candidates who violate hard client dealbreakers (smoking, child preferences, pet allergies, long-distance). Disqualified candidates are isolated in an "Excluded by Stated Dealbreakers" section and never suggested as viable.
2. **Weighted Preference Match Scoring (Step 2):**  
   Deterministic, transparent 0–100 score evaluating candidate attributes against client preferences using configurable weights (defined in `backend/src/config/weights.ts`).
3. **Historical Pattern Risk Detection (Step 3):**  
   Identifies repeat failure patterns from past client rejections. If a candidate matches a pattern that caused 2+ rejections (e.g. `pace_mismatch`, `career_ambition_gap`), the candidate is flagged with a warning and a calibrated score penalty.
4. **Matchmaker-Calibrated Threshold $k$ & Plain-Language Explanations (Step 4):**  
   Interactive $k$-slider calibrated per matchmaker (e.g. Matchmaker A starting $k=68$, Matchmaker B starting $k=78$). Live updates recommendations (`Send`, `Hold`, `Reject`) with an explainable plain-language summary readable at a glance.
5. **Rejection Feedback Intelligence Intake (Step 1 Sandbox):**  
   Classifies unstructured free-text feedback into a 9-category taxonomy (`backend/src/prompts/tagFeedbackPrompt.ts`) with confidence scores and rationales. Supports Claude 3.5 Sonnet / OpenAI if API keys are set, with a deterministic local classification fallback out of the box.

---

## Quick Start

### Prerequisites
- Node.js v18+ (tested on Node v22.14)
- npm

### 1. Start Backend API (Port 4000)
```bash
cd backend
npm install
npm run dev
```
Backend runs on `http://localhost:4000`.

### 2. Start Frontend App (Port 3000)
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:3000`.

*(Alternatively from the root directory, run `npm run dev:backend` and `npm run dev:frontend`)*

---

## Interactive Walkthrough Guide

Open **`http://localhost:3000`** in your browser:

1. **Verify Candidate Queue & Recommendations:**
   - Under **Elena Rostova** (assigned to Matchmaker A, $k=68$):
     - **Alexander Reed:** Scores 100/100 (`Send`) — High alignment with zero historical pattern risks.
     - **Zachary Knight:** Scores 85/100 (`Send`) — Triggers **Pattern Risk Detected: `#pace_mismatch`** with an explanatory warning (*"Client has 2 past rejections for rapid pacing; candidate profile indicates a high-intensity/fast relationship pace"*).
2. **Review Dealbreaker Exclusions:**
   - Click **"Review Excluded Profiles"** to see the 3 candidates automatically disqualified:
     - **Brandon Cole:** Disqualified on *Smoking Dealbreaker*.
     - **Lucas Rivera & Douglas Bennett:** Disqualified on *Family / Children Dealbreaker*.
3. **Test the Live $k$ Threshold Slider:**
   - Slide $k$ up to 86: Watch Zachary Knight immediately transition from `Send` to `Hold`.
   - Click **"Save as Default k"** to persist the threshold for the matchmaker via API.
4. **Switch Clients:**
   - Select **Marcus Vance** (Matchmaker B, $k=78$):
     - **Julian Moreau:** Scores 92/100 (`Send`).
     - **Leo Montgomery:** Triggers **Pattern Risk Detected: `#career_ambition_gap`** due to relaxed career phase matching Marcus's past rejections.
5. **Test Rejection Feedback Intake (Step 1 Demo):**
   - Click the **"Feedback Tagging (Step 1)"** tab.
   - Click any preset button (e.g., *"Pacing Issue"*, *"Career / Drive Gap"*, or *"Dealbreaker / Smoking"*).
   - Click **"Classify & Extract Tags"** to see the taxonomy tags, confidence percentage, rationale, and an option to attach the record directly to a client's profile.
6. **Review Full Assessment Submission:**
   - Click the **"Assessment Submission"** tab (or read `assessment_answers.md`) for the written responses to Parts 1, 2, 4, and AI Usage.

---

## Assessment Documentation

All written requirements from the assessment brief are documented in:
- **`assessment_answers.md`** (Markdown formatted for submission)
- Available interactively inside the running UI under the **"Assessment Submission"** tab.
