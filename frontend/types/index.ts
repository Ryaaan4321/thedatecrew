export interface Matchmaker {
  id: string;
  name: string;
  historicalAcceptanceRate: number;
  threshold: number;
  notes?: string;
}

export type FeedbackStage = "profile" | "conversation" | "meeting";

export interface RejectionRecord {
  candidateId: string;
  candidateName?: string;
  rawFeedback: string;
  tags: string[];
  stage: FeedbackStage;
  date?: string;
}

export interface ClientPreferences {
  ageRange: [number, number];
  location: string[];
  religion?: string[];
  education?: string[];
  occupation?: string[];
  lifestyle: {
    smoking?: string;
    drinking?: string;
    diet?: string;
    wantsChildren?: string;
    pets?: string;
  };
}

export interface Client {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
  matchmakerId: string;
  preferences: ClientPreferences;
  dealbreakers: string[];
  pastRejections: RejectionRecord[];
  matchmaker?: Matchmaker;
}

export interface CandidateLifestyle {
  smoking: "never" | "socially" | "regularly";
  drinking: "never" | "socially" | "frequently";
  diet: string;
  wantsChildren: "wants_children" | "open" | "wants_no_children";
  pets: string;
  relationshipPace?: "fast" | "moderate" | "steady" | "slow";
  careerAmbition?: "high" | "moderate" | "relaxed";
  communicationStyle?: "direct" | "expressive" | "reserved" | "intense";
}

export interface CandidateAttributes {
  age: number;
  location: string;
  religion: string;
  education: string;
  occupation: string;
  lifestyle: CandidateLifestyle;
  personalityNotes?: string;
}

export interface Candidate {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
  attributes: CandidateAttributes;
}

export interface DimensionBreakdown {
  label: string;
  weight: number;
  score: number;
  detail: string;
}

export interface ScoreResult {
  candidateId: string;
  candidateName: string;
  clientId: string;
  clientName: string;
  hardFilterPassed: boolean;
  failedDealbreakers: string[];
  preferenceScore: number;
  patternRisk: {
    flagged: boolean;
    matchedTags: string[];
    note: string;
  };
  penaltyApplied: number;
  finalScore: number;
  thresholdK: number;
  recommendation: "send" | "hold" | "reject";
  explanation: string;
  breakdown: DimensionBreakdown[];
  candidate: Candidate;
}

export interface ScoredQueueResponse {
  client: Client;
  matchmaker?: Matchmaker;
  thresholdK: number;
  totalCount: number;
  viableCount: number;
  excludedCount: number;
  candidates: ScoreResult[];
}

export interface TagFeedbackResponse {
  tags: string[];
  confidence: number;
  rationale: string;
  source: "llm" | "classifier-rule-fallback";
}
