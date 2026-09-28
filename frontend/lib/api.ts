import {
  Candidate,
  Client,
  FeedbackStage,
  Matchmaker,
  ScoredQueueResponse,
  TagFeedbackResponse,
} from "../types";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "https://thedatecrew-s8j9.onrender.com"
).replace(/\/$/, "");

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    throw new Error(
      `API request to ${path} failed with status ${response.status}: ${errorBody}`
    );
  }

  return response.json();
}

export const api = {
  getClients: async (): Promise<Client[]> => {
    return request<Client[]>("/api/clients");
  },

  getClient: async (id: string): Promise<Client> => {
    return request<Client>(`/api/clients/${id}`);
  },

  getMatchmakers: async (): Promise<Matchmaker[]> => {
    return request<Matchmaker[]>("/api/matchmakers");
  },

  getScoredCandidates: async (
    clientId: string,
    kValue?: number
  ): Promise<ScoredQueueResponse> => {
    const query = typeof kValue === "number" ? `?k=${kValue}` : "";
    return request<ScoredQueueResponse>(`/api/clients/${clientId}/candidates${query}`);
  },

  updateMatchmakerThreshold: async (
    matchmakerId: string,
    threshold: number
  ): Promise<{ success: boolean; matchmaker: Matchmaker }> => {
    return request<{ success: boolean; matchmaker: Matchmaker }>(
      `/api/matchmakers/${matchmakerId}/threshold`,
      {
        method: "PUT",
        body: JSON.stringify({ threshold }),
      }
    );
  },

  tagFeedback: async (rawFeedback: string): Promise<TagFeedbackResponse> => {
    return request<TagFeedbackResponse>("/api/tag-feedback", {
      method: "POST",
      body: JSON.stringify({ rawFeedback }),
    });
  },

  attachRejectionRecord: async (
    clientId: string,
    payload: {
      rawFeedback: string;
      stage: FeedbackStage;
      candidateId?: string;
      candidateName?: string;
    }
  ): Promise<{ success: boolean; client: Client }> => {
    return request<{ success: boolean; client: Client }>(
      `/api/clients/${clientId}/rejections`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );
  },

  getCandidates: async (): Promise<Candidate[]> => {
    return request<Candidate[]>("/api/candidates");
  },

  getHealth: async (): Promise<{ status: string }> => {
    return request<{ status: string }>("/api/health");
  },
};

export const getClients = api.getClients;
export const getClient = api.getClient;
export const getMatchmakers = api.getMatchmakers;
export const getScoredCandidates = api.getScoredCandidates;
export const updateMatchmakerThreshold = api.updateMatchmakerThreshold;
export const tagFeedback = api.tagFeedback;
export const attachRejectionRecord = api.attachRejectionRecord;
export const getCandidates = api.getCandidates;
export const getHealth = api.getHealth;

export default api;
