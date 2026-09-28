"use client";

import React, { useState } from "react";
import { Client } from "../types";
import {
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface ClientHeaderProps {
  client: Client;
  clients: Client[];
  onSelectClient: (clientId: string) => void;
}

export const ClientHeader: React.FC<ClientHeaderProps> = ({
  client,
  clients,
  onSelectClient,
}) => {
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div className="rounded-2xl p-6 md:p-8 border border-beige bg-surface mb-8 shadow-xs">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-beige">
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-status-send-bg text-status-send-text text-xs border border-status-send-border font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-forest animate-pulse"></span>
              Active Client Profile
            </span>
            <span className="text-xs text-ink-muted">
              Assigned: <strong className="text-ink font-medium">{client.matchmaker?.name || "Matchmaker"}</strong>
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-ink tracking-tight">
            {client.name}
          </h1>

          <p className="text-sm md:text-base text-ink-muted leading-relaxed font-normal">
            {client.bio}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 p-3 rounded-2xl border border-beige bg-paper shrink-0">
          <label htmlFor="client-select" className="text-[11px] uppercase tracking-wider text-gold-text font-medium whitespace-nowrap">
            Switch Client:
          </label>
          <div className="relative">
            <select
              id="client-select"
              value={client.id}
              onChange={(e) => onSelectClient(e.target.value)}
              className="text-xs bg-surface border border-beige rounded-full pl-3.5 pr-8 py-2 text-ink font-medium cursor-pointer appearance-none shadow-xs hover:border-gold transition"
            >
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.matchmaker?.name?.split(" ")[0] || "MM"})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-ink-muted absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        <div>
          <span className="text-[11px] uppercase tracking-wider text-gold-text font-medium block mb-2.5">
            01 / Stated Dealbreakers
          </span>
          <div className="flex flex-wrap gap-1.5">
            {client.dealbreakers.map((db, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-status-reject-bg text-status-reject-text border border-status-reject-border text-xs font-medium"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-status-reject-text"></span>
                {db.replace(/_/g, " ")}
              </span>
            ))}
          </div>
          <p className="text-xs text-ink-muted mt-2.5 leading-relaxed">
            Non-negotiables automatically filtered to eliminate top-funnel leakage.
          </p>
        </div>

        <div>
          <span className="text-[11px] uppercase tracking-wider text-gold-text font-medium block mb-2.5">
            02 / Core Preferences
          </span>
          <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
            <div>
              <dt className="text-[11px] text-ink-muted">Age Target</dt>
              <dd className="font-medium text-ink mt-0.5">
                {client.preferences.ageRange[0]} &ndash; {client.preferences.ageRange[1]} yrs
              </dd>
            </div>
            <div>
              <dt className="text-[11px] text-ink-muted">Metro Area</dt>
              <dd className="font-medium text-ink truncate mt-0.5" title={client.preferences.location.join(", ")}>
                {client.preferences.location[0]}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] text-ink-muted">Family / Kids</dt>
              <dd className="font-medium text-ink capitalize mt-0.5">
                {client.preferences.lifestyle.wantsChildren?.replace(/_/g, " ") || "Open"}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] text-ink-muted">Smoke / Drink</dt>
              <dd className="font-medium text-ink capitalize mt-0.5">
                {client.preferences.lifestyle.smoking} / {client.preferences.lifestyle.drinking}
              </dd>
            </div>
          </dl>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] uppercase tracking-wider text-gold-text font-medium block">
              03 / Past Breakups ({client.pastRejections.length})
            </span>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="text-xs text-forest hover:text-forest-hover font-medium flex items-center gap-1 cursor-pointer transition"
            >
              <span>{showHistory ? "Collapse" : "Expand Logs"}</span>
              {showHistory ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="text-xs">
            {client.pastRejections.length > 0 ? (
              <div className="space-y-1.5">
                <span className="text-xs text-ink-muted block">Identified Historical Failure Modes:</span>
                <div className="flex flex-wrap gap-1.5">
                  {Array.from(new Set(client.pastRejections.flatMap((r) => r.tags))).map((tag, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-full bg-status-hold-bg text-status-hold-text border border-status-hold-border text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-ink-muted">No past rejection records logged.</p>
            )}
          </div>
        </div>
      </div>

      {showHistory && (
        <div className="mt-6 pt-6 border-t border-beige bg-paper/60 -mx-6 md:-mx-8 -mb-6 md:-mb-8 p-6 md:p-8 rounded-b-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-serif text-xl font-normal text-ink">
              Historical Client Feedback Telemetry
            </h4>
            <span className="text-xs text-ink-muted">
              Audited by TDC Classifier Engine
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {client.pastRejections.map((rec, i) => (
              <div
                key={i}
                className="bg-surface border border-beige rounded-2xl p-4 text-xs space-y-3 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-ink">
                    Match: {rec.candidateName || rec.candidateId}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full border border-beige bg-paper text-ink-muted uppercase font-medium">
                      {rec.stage}
                    </span>
                    {rec.date && (
                      <span className="text-ink-muted text-[11px]">
                        {rec.date}
                      </span>
                    )}
                  </div>
                </div>

                <blockquote className="text-sm text-ink italic bg-paper/70 p-3.5 rounded-xl border border-beige leading-relaxed font-serif">
                  &ldquo;{rec.rawFeedback}&rdquo;
                </blockquote>

                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] text-ink-muted">Tags:</span>
                  {rec.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2.5 py-0.5 rounded-full bg-status-hold-bg text-status-hold-text border border-status-hold-border text-[11px] font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
