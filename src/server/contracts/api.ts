export type UUID = string;
export type ISODate = string;
export type ISODateTime = string;

export type ApiEnvelope<T> = {
  data: T;
  requestId: string;
};

export type ApiError = {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  requestId: string;
};

export type CampaignFilters = {
  bucket?: string;
  languages?: string[];
  riskScoreMin?: number;
  riskScoreMax?: number;
  dpdMin?: number;
  dpdMax?: number;
  regions?: string[];
  tags?: string[];
};

export type CreateCampaignRequest = {
  name: string;
  description?: string;
  agentConfigurationId: UUID;
  collectionTarget: number;
  startsAt?: ISODateTime;
  endsAt?: ISODateTime;
  filters: CampaignFilters;
};

export type CampaignResponse = {
  id: UUID;
  name: string;
  status: "draft" | "scheduled" | "live" | "paused" | "completed" | "archived";
  dueCustomerCount: number;
  collectionTarget: number;
  successRate: number;
  createdAt: ISODateTime;
};

export type StartCallRequest = {
  campaignId?: UUID;
  customerId: UUID;
  loanId?: UUID;
  agentConfigurationId?: UUID;
  provider: "vapi" | "twilio" | "simulation";
};

export type StartCallResponse = {
  callId: UUID;
  provider: "vapi" | "twilio" | "simulation";
  status: "queued" | "initiating";
  realtimeChannel: string;
};

export type TranscriptChunk = {
  callId: UUID;
  sequenceNumber: number;
  speaker: "agent" | "customer" | "system" | "supervisor";
  content: string;
  language?: string;
  confidence?: number;
  isFinal: boolean;
};

export type CreateCallbackRequest = {
  callId?: UUID;
  customerId: UUID;
  loanId?: UUID;
  requestedFor: ISODateTime;
  preferredLanguage?: string;
  preferredChannel: "voice" | "sms" | "whatsapp" | "email";
  notes?: string;
};

export type CreatePaymentCommitmentRequest = {
  callId?: UUID;
  customerId: UUID;
  loanId: UUID;
  amount: number;
  promisedFor: ISODate;
  channel: "voice" | "sms" | "whatsapp" | "email";
  confidence?: number;
};

export type AgentConfigurationDraft = {
  name: string;
  persona: string;
  systemPrompt: string;
  languages: string[];
  voiceProvider: "vapi" | "elevenlabs" | "twilio";
  voiceId?: string;
  llmProvider: "openai";
  llmModel?: string;
  flowDefinition: Record<string, unknown>;
  objectionLibrary: Array<Record<string, unknown>>;
  complianceRules: Record<string, unknown>;
};

export type RunRedTeamTestRequest = {
  agentConfigurationId: UUID;
  scenarioType:
    | "abusive_customer"
    | "wrong_customer"
    | "already_paid"
    | "language_switching"
    | "interruptions"
    | "topic_drift"
    | "confused_user"
    | "angry_user";
};

export type RedTeamTestResult = {
  id: UUID;
  scenarioType: RunRedTeamTestRequest["scenarioType"];
  riskScore: number;
  result: "pass" | "review" | "fail";
  aiReasoning: string;
  evaluation: Record<string, unknown>;
};

export type AnalyticsQuery = {
  metric:
    | "collection_rate"
    | "ptp_rate"
    | "callback_rate"
    | "escalation_rate"
    | "connect_rate"
    | "average_call_duration";
  campaignId?: UUID;
  from: ISODateTime;
  to: ISODateTime;
  dimensions?: string[];
};

