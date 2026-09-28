"use client";

import React, { useState } from "react";
import { ScoreResult } from "../types";
import {
  AlertTriangle,
  Briefcase,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  MapPin,
  Tag,
} from "lucide-react";

interface CandidateCardProps {
  scoreResult: ScoreResult;
  thresholdK: number;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({
  scoreResult,
  thresholdK,
}) => {
  const [expanded, setExpanded] = useState(false);
  const { candidate, finalScore, preferenceScore, patternRisk, explanation, breakdown } =
    scoreResult;

  let currentRec: "send" | "hold" | "reject" = "reject";
  if (finalScore >= thresholdK) {
    currentRec = "send";
  } else if (finalScore >= thresholdK - 8) {
    currentRec = "hold";
  }

  const recBadgeConfig = {
    send: {
      bg: "bg-status-send-bg text-status-send-text border-status-send-border",
      dot: "bg-forest animate-pulse",
      label: "SEND RECOMMENDED",
    },
    hold: {
      bg: "bg-status-hold-bg text-status-hold-text border-status-hold-border",
      dot: "bg-status-hold-text",
      label: "HOLD (BORDERLINE)",
    },
    reject: {
      bg: "bg-status-reject-bg text-status-reject-text border-status-reject-border",
      dot: "bg-status-reject-text",
      label: "DO NOT SEND",
    },
  }[currentRec];

  const initials = candidate.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <div className="rounded-2xl p-6 md:p-7 border border-beige bg-surface space-y-4 hover:border-gold transition-all mb-4 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-full bg-forest text-sand flex items-center justify-center font-serif text-base font-medium shrink-0 border border-gold/30 shadow-xs">
            {initials}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3 className="font-serif text-xl text-ink font-normal tracking-tight">
                {candidate.name}
              </h3>
              <span className="text-xs px-2.5 py-0.5 rounded-full border border-beige bg-paper text-ink-muted font-medium">
                {candidate.attributes.age} yrs
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-ink-muted flex-wrap">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-ink-muted" />
                {candidate.attributes.location}
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-ink-muted" />
                {candidate.attributes.occupation}
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-ink-muted" />
                {candidate.attributes.education}
              </span>
            </div>

            <p className="text-xs md:text-sm text-ink-muted leading-relaxed pt-1 font-normal">
              {candidate.bio || candidate.attributes.personalityNotes}
            </p>
          </div>
        </div>

        <div className="flex items-center sm:flex-col sm:items-end justify-between gap-2.5 shrink-0">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold font-serif text-ink">
              {finalScore}
            </span>
            <span className="text-xs text-ink-muted">/ 100</span>
            {patternRisk.flagged && (
              <span className="text-xs text-status-reject-text line-through ml-1" title="Preference score before penalty">
                {preferenceScore}
              </span>
            )}
          </div>

          <div
            className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-medium border ${recBadgeConfig.bg}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${recBadgeConfig.dot}`}></span>
            <span>{recBadgeConfig.label}</span>
          </div>
        </div>
      </div>

      {patternRisk.flagged && (
        <div className="rounded-2xl border border-status-hold-border bg-status-hold-bg/70 p-4 text-xs space-y-2">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-status-hold-text">
              <AlertTriangle className="w-3.5 h-3.5 text-status-hold-text" />
              <span>Historical Pattern Risk Flag (-{scoreResult.penaltyApplied} pts penalty)</span>
            </div>
            <div className="flex items-center gap-1 flex-wrap">
              {patternRisk.matchedTags.map((tag, tIdx) => (
                <span
                  key={tIdx}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface border border-status-hold-border text-status-hold-text text-[11px] font-medium"
                >
                  <Tag className="w-2.5 h-2.5" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <p className="text-status-hold-text leading-relaxed font-normal">{patternRisk.note}</p>
        </div>
      )}

      <div className="rounded-2xl border border-beige bg-paper/60 p-4 text-xs space-y-1">
        <span className="text-[10px] uppercase tracking-wider text-gold-text font-medium block">
          DECISION LOG / MATCHMAKER RATIONALE
        </span>
        <p className="text-ink leading-relaxed text-xs md:text-sm font-normal">
          {explanation}
        </p>
      </div>

      <div className="pt-2 border-t border-beige flex items-center justify-between text-xs text-ink-muted">
        <div className="flex items-center gap-3 flex-wrap">
          <span>
            Family: <strong className="text-ink font-medium">{candidate.attributes.lifestyle.wantsChildren.replace(/_/g, " ")}</strong>
          </span>
          <span>&bull;</span>
          <span>
            Smoke: <strong className="text-ink font-medium">{candidate.attributes.lifestyle.smoking}</strong>
          </span>
          <span>&bull;</span>
          <span>
            Pace: <strong className="text-ink font-medium">{candidate.attributes.lifestyle.relationshipPace || "steady"}</strong>
          </span>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-forest hover:text-forest-hover font-medium flex items-center gap-1 transition cursor-pointer"
        >
          <span>{expanded ? "Hide Telemetry" : "View Telemetry"}</span>
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {expanded && (
        <div className="pt-3 border-t border-beige space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gold-text uppercase tracking-wider font-medium">
              Dimension Telemetry Breakdown
            </span>
            <span className="text-xs text-ink font-medium">
              Base Score: {preferenceScore}/100
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {breakdown.map((item, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-beige bg-paper/50 p-3 text-xs space-y-1.5 shadow-xs"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-ink font-medium">{item.label}</span>
                  <span className="text-ink-muted">
                    {Math.round(item.score * 100)}% (wt: {item.weight})
                  </span>
                </div>
                <div className="w-full bg-beige h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-forest rounded-full"
                    style={{ width: `${item.score * 100}%` }}
                  />
                </div>
                <p className="text-[11px] text-ink-muted truncate" title={item.detail}>
                  {item.detail}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-beige bg-paper/60 p-3.5 text-xs space-y-1">
            <span className="text-[10px] text-gold-text uppercase tracking-wider font-medium block">
              Behavioral &amp; Pacing Telemetry
            </span>
            <p className="text-ink-muted leading-relaxed">
              {candidate.attributes.personalityNotes || "Standard profile parameters verified on file."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
