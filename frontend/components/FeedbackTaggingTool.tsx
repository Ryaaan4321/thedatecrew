"use client";

import React, { useState } from "react";
import { Client, TagFeedbackResponse } from "../types";
import { tagFeedback, attachRejectionRecord } from "../lib/api";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Cpu,
  FileCode2,
  Layers,
  Sparkles,
  Tag,
} from "lucide-react";

interface FeedbackTaggingToolProps {
  clients: Client[];
  onFeedbackSavedToClient?: () => void;
}

const SAMPLE_PRESETS = [
  {
    label: "Pacing Issue (Date 2)",
    text: "He was already talking about moving in together on our second date and asking about meeting my parents. Way too intense, suffocating pace.",
  },
  {
    label: "Career / Drive Gap",
    text: "He was polite, but has zero ambition or career motivation. Content working 10 hours a week and playing video games in his basement.",
  },
  {
    label: "Dealbreaker / Smoking",
    text: "He took out a vape in the middle of dinner after I explicitly told the matchmaker that smoking or vaping is an absolute dealbreaker for me.",
  },
  {
    label: "Communication Friction",
    text: "He spoke over me the entire evening, invalidated my opinions on medicine, and showed zero curiosity about my life.",
  },
  {
    label: "Family & Children Roles",
    text: "He made it clear he expects his future partner to immediately quit their job and handle all domestic chores once children are born.",
  },
];

export const FeedbackTaggingTool: React.FC<FeedbackTaggingToolProps> = ({
  clients,
  onFeedbackSavedToClient,
}) => {
  const [feedbackText, setFeedbackText] = useState(SAMPLE_PRESETS[0].text);
  const [selectedClientId, setSelectedClientId] = useState(clients[0]?.id || "");
  const [stage, setStage] = useState<"profile" | "conversation" | "meeting">("meeting");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TagFeedbackResponse | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleClassify = async (textToClassify = feedbackText) => {
    if (!textToClassify.trim()) return;
    setIsLoading(true);
    setErrorMsg("");
    setSavedSuccess(false);

    try {
      const data = await tagFeedback(textToClassify);
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Failed to classify feedback. Ensure backend is available.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAttachToClient = async () => {
    if (!result || !selectedClientId) return;
    try {
      await attachRejectionRecord(selectedClientId, {
        rawFeedback: feedbackText,
        stage,
      });
      setSavedSuccess(true);
      if (onFeedbackSavedToClient) {
        onFeedbackSavedToClient();
      }
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Could not attach record to client.");
    }
  };

  return (
    <div className="rounded-2xl p-7 md:p-8 border border-beige bg-surface mb-8 shadow-xs max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-beige">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-status-send-bg text-status-send-text text-xs border border-status-send-border font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-forest animate-pulse"></span>
              Step 1 Pipeline Sandbox
            </span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl text-ink font-normal tracking-tight flex items-center gap-2.5 mt-1">
            <Cpu className="w-5 h-5 text-forest" />
            Rejection Feedback <em>Intelligence Intake</em>
          </h3>
          <p className="text-xs text-ink-muted mt-1.5 leading-relaxed">
            Classifies raw, unstructured client rejection text into structured taxonomy tags via LLM.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-ink-muted bg-paper border border-beige px-3.5 py-1.5 rounded-full shrink-0 shadow-xs">
          <FileCode2 className="w-3.5 h-3.5 text-forest" />
          <span className="text-[11px] font-sans text-ink">prompts/tagFeedbackPrompt.ts</span>
        </div>
      </div>

      <div className="mt-6">
        <label className="text-[11px] uppercase tracking-wider text-gold-text font-medium block mb-2.5">
          Test with Sample Feedback Presets
        </label>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                setFeedbackText(preset.text);
                handleClassify(preset.text);
              }}
              className="text-xs font-medium bg-surface hover:bg-paper hover:border-gold border border-beige rounded-full px-3.5 py-1.5 transition cursor-pointer text-ink shadow-xs"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <label htmlFor="raw-feedback" className="text-xs font-medium text-ink block mb-2">
          Raw Client Rejection Text:
        </label>
        <textarea
          id="raw-feedback"
          rows={3}
          value={feedbackText}
          onChange={(e) => setFeedbackText(e.target.value)}
          placeholder="Paste verbatim email or WhatsApp note from client..."
          className="w-full text-xs md:text-sm p-4 border border-beige rounded-2xl focus:outline-none focus:border-gold text-ink leading-relaxed bg-paper focus:bg-surface transition"
        />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={() => handleClassify()}
          disabled={isLoading || !feedbackText.trim()}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-forest hover:bg-forest-hover active:scale-[0.99] text-cream text-xs font-medium rounded-full transition shadow-xs disabled:opacity-50 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isLoading ? "Classifying..." : "Classify & Extract Tags"}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        {errorMsg && <span className="text-xs text-status-reject-text font-medium">{errorMsg}</span>}
      </div>

      {result && (
        <div className="mt-6 p-6 rounded-2xl border border-beige bg-paper/60 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-beige">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-forest" />
              <span className="text-xs uppercase tracking-wider text-gold-text font-medium">
                Extracted Taxonomy Tags
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="text-ink-muted">
                Confidence: <strong className="text-ink font-medium">{Math.round(result.confidence * 100)}%</strong>
              </span>
              <span className="bg-status-send-bg border border-status-send-border text-status-send-text px-3 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-medium">
                {result.source === "llm" ? "Claude / OpenAI" : "TDC Heuristic Classifier"}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {result.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-3.5 py-1 bg-surface border border-status-send-border text-status-send-text rounded-full text-xs font-medium shadow-xs flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-forest" />
                {tag}
              </span>
            ))}
          </div>

          <div className="text-xs text-ink-muted bg-surface p-4 rounded-xl border border-beige leading-relaxed font-sans">
            <span className="font-medium text-ink">Rationale: </span>
            {result.rationale}
          </div>

          <div className="mt-5 pt-4 border-t border-beige flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 flex-wrap">
              <label htmlFor="attach-client-select" className="text-xs text-ink-muted">
                Attach to client history:
              </label>
              <div className="relative">
                <select
                  id="attach-client-select"
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                  className="text-xs bg-surface border border-beige rounded-full pl-3.5 pr-8 py-1.5 text-ink appearance-none cursor-pointer hover:border-gold transition font-medium"
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-ink-muted absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={stage}
                  onChange={(e) => setStage(e.target.value as any)}
                  className="text-xs bg-surface border border-beige rounded-full pl-3.5 pr-8 py-1.5 text-ink appearance-none cursor-pointer hover:border-gold transition font-medium"
                >
                  <option value="profile">Stage: Profile</option>
                  <option value="conversation">Stage: Conversation</option>
                  <option value="meeting">Stage: In-Person Meeting</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-ink-muted absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleAttachToClient}
                className="inline-flex items-center gap-2 px-4 py-2 bg-forest hover:bg-forest-hover text-cream text-xs font-medium rounded-full transition cursor-pointer shadow-xs"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Append to Client Records</span>
              </button>
              {savedSuccess && (
                <span className="text-xs text-forest font-medium flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  Appended
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
