"use client";

import React, { useEffect, useState } from "react";
import { Client, Matchmaker, ScoreResult } from "../types";
import { ClientHeader } from "../components/ClientHeader";
import { ThresholdController } from "../components/ThresholdController";
import { CandidateCard } from "../components/CandidateCard";
import { HardFilterExcludedList } from "../components/HardFilterExcludedList";
import { FeedbackTaggingTool } from "../components/FeedbackTaggingTool";
import { AssessmentView } from "../components/AssessmentView";
import {
  ArrowRight,
  FileText,
  Filter,
  Heart,
  RefreshCw,
  Sparkles,
  UserCheck,
} from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"queue" | "tagging" | "assessment">("queue");
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [matchmakers, setMatchmakers] = useState<Matchmaker[]>([]);
  const [currentK, setCurrentK] = useState<number>(68);
  const [candidatesQueue, setCandidatesQueue] = useState<ScoreResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function initData() {
      try {
        setIsLoading(true);
        const [clientsRes, mmRes] = await Promise.all([
          fetch("/api/clients"),
          fetch("/api/matchmakers"),
        ]);

        if (!clientsRes.ok || !mmRes.ok) {
          throw new Error("Failed to load initial data from backend API");
        }

        const clientsData: Client[] = await clientsRes.json();
        const mmData: Matchmaker[] = await mmRes.json();

        setClients(clientsData);
        setMatchmakers(mmData);

        if (clientsData.length > 0) {
          const firstClient = clientsData[0];
          setSelectedClientId(firstClient.id);
          const mm = mmData.find((m) => m.id === firstClient.matchmakerId);
          setCurrentK(mm?.threshold || 68);
        }
      } catch (err: any) {
        console.error(err);
        setError("Unable to connect to backend API on http://localhost:4000. Please ensure the backend is running.");
      } finally {
        setIsLoading(false);
      }
    }

    initData();
  }, []);

  const fetchScoredCandidates = async (clientId: string, kValue?: number) => {
    if (!clientId) return;
    try {
      setIsRefreshing(true);
      const kParam = typeof kValue === "number" ? `?k=${kValue}` : "";
      const res = await fetch(`/api/clients/${clientId}/candidates${kParam}`);
      if (!res.ok) throw new Error("Failed to fetch scored candidates");

      const data = await res.json();
      setCandidatesQueue(data.candidates);

      if (typeof kValue !== "number" && typeof data.thresholdK === "number") {
        setCurrentK(data.thresholdK);
      }
    } catch (err: any) {
      console.error(err);
      setError("Failed to fetch candidate scores.");
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (selectedClientId) {
      const client = clients.find((c) => c.id === selectedClientId);
      if (client) {
        const mm = matchmakers.find((m) => m.id === client.matchmakerId);
        if (mm) {
          setCurrentK(mm.threshold);
        }
      }
      fetchScoredCandidates(selectedClientId);
    }
  }, [selectedClientId]);

  const handleClientSelect = (clientId: string) => {
    setSelectedClientId(clientId);
  };

  const handleKChange = (newK: number) => {
    setCurrentK(newK);
  };

  const handleSaveK = async (newK: number) => {
    const currentClient = clients.find((c) => c.id === selectedClientId);
    if (!currentClient) return;

    const mmId = currentClient.matchmakerId;
    const res = await fetch(`/api/matchmakers/${mmId}/threshold`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ threshold: newK }),
    });

    if (res.ok) {
      setMatchmakers((prev) =>
        prev.map((m) => (m.id === mmId ? { ...m, threshold: newK } : m))
      );
      fetchScoredCandidates(selectedClientId, newK);
    }
  };

  const handleFeedbackSaved = () => {
    fetch("/api/clients")
      .then((r) => r.json())
      .then((updatedClients) => {
        setClients(updatedClients);
        fetchScoredCandidates(selectedClientId, currentK);
      });
  };

  const selectedClient = clients.find((c) => c.id === selectedClientId);
  const activeMatchmaker = matchmakers.find(
    (m) => m.id === selectedClient?.matchmakerId
  );

  const viableCandidates = candidatesQueue.filter((c) => c.hardFilterPassed);
  const excludedCandidates = candidatesQueue.filter((c) => !c.hardFilterPassed);

  return (
    <div className="min-h-screen bg-paper text-ink pb-20 selection:bg-sand selection:text-ink">
      <header className="bg-surface/90 backdrop-blur-md border-b border-beige sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-full bg-forest flex items-center justify-center text-sand border border-gold/30 shadow-xs">
                <Heart className="w-4 h-4 fill-sand text-sand" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="font-serif text-xl tracking-tight text-ink font-normal">
                    The Date Crew
                  </span>
                  <span className="text-[10px] tracking-wider uppercase font-medium text-gold-text bg-status-neutral-bg border border-status-neutral-border px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-forest animate-pulse"></span>
                    Copilot
                  </span>
                </div>
                <span className="text-xs text-ink-muted block font-sans">
                  Pre-Send Screening &bull; Quality Guardrails
                </span>
              </div>
            </div>

            <nav className="flex items-center gap-1.5 bg-paper p-1 rounded-full border border-beige shadow-xs">
              <button
                onClick={() => setActiveTab("queue")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition cursor-pointer ${
                  activeTab === "queue"
                    ? "bg-forest text-cream shadow-xs"
                    : "text-ink-muted hover:text-ink"
                }`}
              >
                <Filter className="w-3.5 h-3.5" />
                <span>Candidate Queue</span>
              </button>

              <button
                onClick={() => setActiveTab("tagging")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition cursor-pointer ${
                  activeTab === "tagging"
                    ? "bg-forest text-cream shadow-xs"
                    : "text-ink-muted hover:text-ink"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Feedback Tagging</span>
              </button>

              <button
                onClick={() => setActiveTab("assessment")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition cursor-pointer ${
                  activeTab === "assessment"
                    ? "bg-forest text-cream shadow-xs"
                    : "text-ink-muted hover:text-ink"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Assessment Submission</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {error && (
          <div className="bg-status-reject-bg border border-status-reject-border text-status-reject-text text-xs p-4 rounded-2xl mb-6 flex items-center justify-between shadow-xs">
            <span>{error}</span>
            <button
              onClick={() => window.location.reload()}
              className="text-xs font-semibold underline cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-28">
            <RefreshCw className="w-6 h-6 text-forest animate-spin mb-3" />
            <p className="text-xs font-medium text-ink-muted">
              Loading Matchmaker Screening Environment...
            </p>
          </div>
        ) : (
          <>
            {activeTab === "queue" && selectedClient && (
              <div>
                <ClientHeader
                  client={{ ...selectedClient, matchmaker: activeMatchmaker }}
                  clients={clients}
                  onSelectClient={handleClientSelect}
                />

                <ThresholdController
                  currentK={currentK}
                  matchmaker={activeMatchmaker}
                  onKChange={handleKChange}
                  onSaveK={handleSaveK}
                  scoredCandidates={candidatesQueue}
                />

                <div className="flex items-center justify-between mb-5">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-gold-text font-medium block mb-1">
                      Pre-Send Candidate Queue
                    </span>
                    <h2 className="font-serif text-2xl sm:text-3xl text-ink font-normal tracking-tight flex items-center gap-2.5">
                      <UserCheck className="w-5 h-5 text-forest" />
                      <span>Viable Candidate <em>Queue</em></span>
                      <span className="text-xs font-sans text-ink-muted font-normal">
                        ({viableCandidates.length} evaluated)
                      </span>
                    </h2>
                    <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                      Ranked by finalScore (weighted preferences minus repeat pattern penalty). Matchmaker decides final send.
                    </p>
                  </div>

                  <button
                    onClick={() => fetchScoredCandidates(selectedClientId, currentK)}
                    disabled={isRefreshing}
                    className="flex items-center gap-1.5 text-xs font-medium text-ink bg-surface border border-beige hover:border-gold px-4 py-2 rounded-full shadow-xs hover:bg-paper transition cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-forest" : ""}`} />
                    <span>Refresh Scores</span>
                  </button>
                </div>

                <div className="space-y-4 mb-8">
                  {viableCandidates.map((cResult) => (
                    <CandidateCard
                      key={cResult.candidateId}
                      scoreResult={cResult}
                      thresholdK={currentK}
                    />
                  ))}
                </div>

                <HardFilterExcludedList excludedCandidates={excludedCandidates} />
              </div>
            )}

            {activeTab === "tagging" && (
              <div>
                <FeedbackTaggingTool
                  clients={clients}
                  onFeedbackSavedToClient={handleFeedbackSaved}
                />
              </div>
            )}

            {activeTab === "assessment" && <AssessmentView />}
          </>
        )}
      </main>
    </div>
  );
}
