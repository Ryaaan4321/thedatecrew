import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import {
  SEED_CANDIDATES,
  SEED_CLIENTS,
  SEED_MATCHMAKERS,
} from "./data/seedData.js";
import { classifyRejectionFeedback } from "./services/llmService.js";
import { scoreCandidateForClient } from "./services/scoringEngine.js";
import {
  DEFAULT_PREFERENCE_WEIGHTS,
  PreferenceWeights,
} from "./config/weights.js";
import { Candidate, Client, Matchmaker, RejectionRecord } from "./types/index.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

let matchmakers: Matchmaker[] = JSON.parse(JSON.stringify(SEED_MATCHMAKERS));
let clients: Client[] = JSON.parse(JSON.stringify(SEED_CLIENTS));
let candidates: Candidate[] = JSON.parse(JSON.stringify(SEED_CANDIDATES));
let activeWeights: PreferenceWeights = { ...DEFAULT_PREFERENCE_WEIGHTS };

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    clientsCount: clients.length,
    candidatesCount: candidates.length,
    matchmakersCount: matchmakers.length,
    anthropicConfigured: Boolean(process.env.ANTHROPIC_API_KEY),
    openaiConfigured: Boolean(process.env.OPENAI_API_KEY),
  });
});

app.post("/api/tag-feedback", async (req: Request, res: Response) => {
  try {
    const { rawFeedback } = req.body;
    if (!rawFeedback || typeof rawFeedback !== "string" || !rawFeedback.trim()) {
      res.status(400).json({ error: "rawFeedback string is required." });
      return;
    }

    const classification = await classifyRejectionFeedback(rawFeedback.trim());
    res.json(classification);
  } catch (error) {
    console.error("Error in /api/tag-feedback:", error);
    res.status(500).json({ error: "Failed to classify feedback" });
  }
});

app.post("/api/score", (req: Request, res: Response) => {
  try {
    const { clientId, candidateId, kOverride } = req.body;
    if (!clientId || !candidateId) {
      res.status(400).json({ error: "Both clientId and candidateId are required." });
      return;
    }

    const client = clients.find((c) => c.id === clientId);
    if (!client) {
      res.status(404).json({ error: `Client ${clientId} not found.` });
      return;
    }

    const candidate = candidates.find((cand) => cand.id === candidateId);
    if (!candidate) {
      res.status(404).json({ error: `Candidate ${candidateId} not found.` });
      return;
    }

    const matchmaker = matchmakers.find((mm) => mm.id === client.matchmakerId);
    const thresholdK =
      typeof kOverride === "number"
        ? kOverride
        : matchmaker
        ? matchmaker.threshold
        : 70;

    const result = scoreCandidateForClient(
      client,
      candidate,
      thresholdK,
      activeWeights
    );
    res.json(result);
  } catch (error) {
    console.error("Error in /api/score:", error);
    res.status(500).json({ error: "Scoring failed" });
  }
});

app.get("/api/clients/:id/candidates", (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const client = clients.find((c) => c.id === id);
    if (!client) {
      res.status(404).json({ error: `Client ${id} not found.` });
      return;
    }

    const matchmaker = matchmakers.find((mm) => mm.id === client.matchmakerId);
    const kOverrideQuery = req.query.k ? Number(req.query.k) : undefined;
    const thresholdK =
      typeof kOverrideQuery === "number" && !isNaN(kOverrideQuery)
        ? kOverrideQuery
        : matchmaker
        ? matchmaker.threshold
        : 70;

    const scoredList = candidates.map((cand) =>
      scoreCandidateForClient(client, cand, thresholdK, activeWeights)
    );

    scoredList.sort((a, b) => {
      if (a.hardFilterPassed && !b.hardFilterPassed) return -1;
      if (!a.hardFilterPassed && b.hardFilterPassed) return 1;
      return b.finalScore - a.finalScore;
    });

    res.json({
      client,
      matchmaker,
      thresholdK,
      totalCount: scoredList.length,
      viableCount: scoredList.filter((s) => s.hardFilterPassed).length,
      excludedCount: scoredList.filter((s) => !s.hardFilterPassed).length,
      candidates: scoredList,
    });
  } catch (error) {
    console.error("Error in /api/clients/:id/candidates:", error);
    res.status(500).json({ error: "Failed to score candidate queue" });
  }
});

app.get("/api/clients", (_req: Request, res: Response) => {
  res.json(clients);
});

app.get("/api/clients/:id", (req: Request, res: Response) => {
  const client = clients.find((c) => c.id === req.params.id);
  if (!client) {
    res.status(404).json({ error: "Client not found" });
    return;
  }
  const matchmaker = matchmakers.find((mm) => mm.id === client.matchmakerId);
  res.json({ ...client, matchmaker });
});

app.get("/api/candidates", (_req: Request, res: Response) => {
  res.json(candidates);
});

app.get("/api/matchmakers", (_req: Request, res: Response) => {
  res.json(matchmakers);
});

app.get("/api/matchmakers/:id/threshold", (req: Request, res: Response) => {
  const matchmaker = matchmakers.find((mm) => mm.id === req.params.id);
  if (!matchmaker) {
    res.status(404).json({ error: "Matchmaker not found" });
    return;
  }
  res.json({
    id: matchmaker.id,
    name: matchmaker.name,
    threshold: matchmaker.threshold,
    historicalAcceptanceRate: matchmaker.historicalAcceptanceRate,
  });
});

app.put("/api/matchmakers/:id/threshold", (req: Request, res: Response) => {
  const { threshold } = req.body;
  if (typeof threshold !== "number" || threshold < 0 || threshold > 100) {
    res.status(400).json({ error: "Valid threshold between 0 and 100 is required." });
    return;
  }

  const matchmaker = matchmakers.find((mm) => mm.id === req.params.id);
  if (!matchmaker) {
    res.status(404).json({ error: "Matchmaker not found" });
    return;
  }

  matchmaker.threshold = Math.round(threshold);
  res.json({
    message: `Updated threshold k to ${matchmaker.threshold} for ${matchmaker.name}`,
    matchmaker,
  });
});

app.post("/api/clients/:id/rejections", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { candidateId, rawFeedback, stage } = req.body;

  const client = clients.find((c) => c.id === id);
  if (!client) {
    res.status(404).json({ error: "Client not found" });
    return;
  }

  const classification = await classifyRejectionFeedback(rawFeedback);
  const newRecord: RejectionRecord = {
    candidateId: candidateId || "custom-cand",
    rawFeedback,
    tags: classification.tags,
    stage: stage || "meeting",
    date: new Date().toISOString().split("T")[0],
  };

  client.pastRejections.unshift(newRecord);
  res.json({
    message: "Rejection record successfully added to client profile.",
    record: newRecord,
    classification,
    totalPastRejections: client.pastRejections.length,
  });
});

app.get("/api/config/weights", (_req: Request, res: Response) => {
  res.json(activeWeights);
});

app.listen(PORT, () => {
  console.log(`[TDC Backend] Matchmaker Scoring API running on http://localhost:${PORT}`);
});
