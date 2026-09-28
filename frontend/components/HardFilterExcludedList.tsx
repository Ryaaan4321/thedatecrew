"use client";

import React, { useState } from "react";
import { ScoreResult } from "../types";
import { ChevronDown, ChevronUp, MapPin, ShieldAlert, XCircle } from "lucide-react";

interface HardFilterExcludedListProps {
  excludedCandidates: ScoreResult[];
}

export const HardFilterExcludedList: React.FC<HardFilterExcludedListProps> = ({
  excludedCandidates,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  if (excludedCandidates.length === 0) return null;

  return (
    <div className="rounded-2xl border border-beige bg-surface overflow-hidden mb-8 transition shadow-xs">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 flex items-center justify-between text-left hover:bg-paper/50 transition cursor-pointer"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-full bg-status-reject-bg border border-status-reject-border text-status-reject-text flex items-center justify-center shrink-0">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3 className="font-serif text-lg text-ink tracking-tight font-normal">
                Excluded by Stated Dealbreakers
              </h3>
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-status-reject-bg text-status-reject-text border border-status-reject-border text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-status-reject-text"></span>
                {excludedCandidates.length} Disqualified
              </span>
            </div>
            <p className="text-xs text-ink-muted mt-1 leading-relaxed">
              Deterministic hard filter prevents matchmakers from sending profiles that violate client's non-negotiable rules.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-xs font-medium text-ink bg-surface px-3.5 py-1.5 rounded-full border border-beige shadow-xs hover:border-gold transition">
          <span>{isOpen ? "Hide Excluded" : "Review Excluded"}</span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-6 pt-0 border-t border-beige divide-y divide-beige bg-paper/30">
          {excludedCandidates.map((cResult) => {
            const { candidate, failedDealbreakers } = cResult;
            return (
              <div key={candidate.id} className="py-4 first:pt-4 last:pb-0">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-serif text-base text-ink-muted line-through font-normal">
                        {candidate.name}
                      </span>
                      <span className="text-xs text-ink-muted">
                        {candidate.attributes.age} yrs &bull; {candidate.attributes.occupation}
                      </span>
                      <span className="text-xs text-ink-muted flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-ink-muted" />
                        {candidate.attributes.location}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1.5 pt-1">
                      {failedDealbreakers.map((violation, vIdx) => (
                        <div
                          key={vIdx}
                          className="inline-flex items-start gap-2 text-xs text-status-reject-text bg-status-reject-bg border border-status-reject-border px-3.5 py-1.5 rounded-full font-medium shadow-xs"
                        >
                          <XCircle className="w-3.5 h-3.5 text-status-reject-text shrink-0 mt-0.5" />
                          <span>{violation}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <span className="text-[10px] px-3 py-1 rounded-full bg-status-reject-text text-cream uppercase font-medium tracking-wider">
                      AUTO-REJECTED
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
