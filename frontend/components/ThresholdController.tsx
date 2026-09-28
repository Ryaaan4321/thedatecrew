"use client";

import React, { useState } from "react";
import { Matchmaker, ScoreResult } from "../types";
import { Check, Save } from "lucide-react";

interface ThresholdControllerProps {
  currentK: number;
  matchmaker?: Matchmaker;
  onKChange: (newK: number) => void;
  onSaveK: (newK: number) => Promise<void>;
  scoredCandidates: ScoreResult[];
}

export const ThresholdController: React.FC<ThresholdControllerProps> = ({
  currentK,
  matchmaker,
  onKChange,
  onSaveK,
  scoredCandidates,
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const viable = scoredCandidates.filter((c) => c.hardFilterPassed);
  const sendCount = viable.filter((c) => c.finalScore >= currentK).length;
  const holdCount = viable.filter(
    (c) => c.finalScore < currentK && c.finalScore >= currentK - 8
  ).length;
  const rejectCount = viable.filter((c) => c.finalScore < currentK - 8).length;
  const excludedCount = scoredCandidates.filter((c) => !c.hardFilterPassed).length;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSaveK(currentK);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="rounded-2xl p-6 md:p-8 border border-beige bg-surface mb-8 shadow-xs space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-beige">
        <div className="max-w-3xl space-y-2">
          <div className="flex items-center gap-2.5">
            <span className="text-[11px] uppercase tracking-wider text-gold-text font-medium block">
              CALIBRATION / QUALITY GATE
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-forest text-cream text-xs font-medium">
              k = {currentK}
            </span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-normal text-ink tracking-tight">
            Matchmaker Threshold &amp; <em>Decision Boundary</em>
          </h2>

          <p className="text-sm text-ink-muted leading-relaxed">
            Calibrated for <strong className="text-ink font-medium">{matchmaker?.name || "Matchmaker"}</strong>. Historical Acceptance Rate:{" "}
            <strong className="text-ink font-medium">{matchmaker ? `${Math.round(matchmaker.historicalAcceptanceRate * 100)}%` : "N/A"}</strong>. Adjusting k recalibrates the Send, Hold, and Reject distributions in real time.
          </p>
        </div>

        <div className="shrink-0">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-medium text-cream bg-forest hover:bg-forest-hover transition shadow-xs disabled:opacity-50 cursor-pointer"
          >
            {savedSuccess ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
            <span>{isSaving ? "Saving..." : savedSuccess ? "Threshold Saved" : "Set Default k"}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between text-xs text-ink-muted">
            <span>Permissive (k = 55)</span>
            <span className="px-3.5 py-1 rounded-full border border-beige bg-paper text-ink font-medium">
              Current k: {currentK}
            </span>
            <span>Selective (k = 90)</span>
          </div>

          <input
            type="range"
            min={55}
            max={90}
            step={1}
            value={currentK}
            onChange={(e) => onKChange(Number(e.target.value))}
            className="w-full h-2 bg-beige rounded-lg appearance-none cursor-pointer accent-forest focus:outline-none"
          />

          <div className="flex justify-between text-[11px] text-ink-muted pt-1">
            <span className="text-status-send-text font-medium">Send: &ge; {currentK}</span>
            <span className="text-status-hold-text font-medium">Hold: {currentK - 8} &ndash; {currentK - 1}</span>
            <span className="text-status-reject-text font-medium">Reject: &lt; {currentK - 8}</span>
          </div>
        </div>

        <div className="lg:col-span-5 grid grid-cols-4 gap-2.5 text-center">
          <div className="rounded-2xl border border-status-send-border bg-status-send-bg/70 p-3.5">
            <div className="text-[10px] uppercase tracking-wider text-status-send-text font-medium mb-1">
              Send
            </div>
            <div className="text-2xl font-bold font-serif text-status-send-text">{sendCount}</div>
          </div>

          <div className="rounded-2xl border border-status-hold-border bg-status-hold-bg/70 p-3.5">
            <div className="text-[10px] uppercase tracking-wider text-status-hold-text font-medium mb-1">
              Hold
            </div>
            <div className="text-2xl font-bold font-serif text-status-hold-text">{holdCount}</div>
          </div>

          <div className="rounded-2xl border border-status-reject-border bg-status-reject-bg/70 p-3.5">
            <div className="text-[10px] uppercase tracking-wider text-status-reject-text font-medium mb-1">
              Reject
            </div>
            <div className="text-2xl font-bold font-serif text-status-reject-text">{rejectCount}</div>
          </div>

          <div className="rounded-2xl border border-beige bg-paper p-3.5">
            <div className="text-[10px] uppercase tracking-wider text-ink-muted font-medium mb-1">
              Excluded
            </div>
            <div className="text-2xl font-bold font-serif text-ink">{excludedCount}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
