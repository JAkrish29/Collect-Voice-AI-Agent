import { z } from "zod";

export const uuidSchema = z.string().uuid();
export const isoDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
export const isoDateTimeSchema = z.string().datetime();

export const campaignFiltersSchema = z.object({
  bucket: z.string().optional(),
  languages: z.array(z.string().min(2)).optional(),
  riskScoreMin: z.number().min(0).max(100).optional(),
  riskScoreMax: z.number().min(0).max(100).optional(),
  dpdMin: z.number().int().min(0).optional(),
  dpdMax: z.number().int().min(0).optional(),
  regions: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional()
});

export const createCampaignSchema = z.object({
  name: z.string().min(3).max(120),
  description: z.string().max(500).optional(),
  agentConfigurationId: uuidSchema,
  collectionTarget: z.number().positive(),
  startsAt: isoDateTimeSchema.optional(),
  endsAt: isoDateTimeSchema.optional(),
  filters: campaignFiltersSchema
});

export const startCallSchema = z.object({
  campaignId: uuidSchema.optional(),
  customerId: uuidSchema,
  loanId: uuidSchema.optional(),
  agentConfigurationId: uuidSchema.optional(),
  provider: z.enum(["vapi", "twilio", "simulation"])
});

export const transcriptChunkSchema = z.object({
  callId: uuidSchema,
  sequenceNumber: z.number().int().min(1),
  speaker: z.enum(["agent", "customer", "system", "supervisor"]),
  content: z.string().min(1),
  language: z.string().min(2).optional(),
  confidence: z.number().min(0).max(1).optional(),
  isFinal: z.boolean()
});

export const createCallbackSchema = z.object({
  callId: uuidSchema.optional(),
  customerId: uuidSchema,
  loanId: uuidSchema.optional(),
  requestedFor: isoDateTimeSchema,
  preferredLanguage: z.string().min(2).optional(),
  preferredChannel: z.enum(["voice", "sms", "whatsapp", "email"]),
  notes: z.string().max(1000).optional()
});

export const createPaymentCommitmentSchema = z.object({
  callId: uuidSchema.optional(),
  customerId: uuidSchema,
  loanId: uuidSchema,
  amount: z.number().positive(),
  promisedFor: isoDateSchema,
  channel: z.enum(["voice", "sms", "whatsapp", "email"]),
  confidence: z.number().min(0).max(1).optional()
});

export const agentConfigurationDraftSchema = z.object({
  name: z.string().min(3).max(120),
  persona: z.string().min(20),
  systemPrompt: z.string().min(40),
  languages: z.array(z.string().min(2)).min(1),
  voiceProvider: z.enum(["vapi", "elevenlabs", "twilio"]),
  voiceId: z.string().optional(),
  llmProvider: z.literal("openai"),
  llmModel: z.string().optional(),
  flowDefinition: z.record(z.unknown()),
  objectionLibrary: z.array(z.record(z.unknown())),
  complianceRules: z.record(z.unknown())
});

export const runRedTeamTestSchema = z.object({
  agentConfigurationId: uuidSchema,
  scenarioType: z.enum([
    "abusive_customer",
    "wrong_customer",
    "already_paid",
    "language_switching",
    "interruptions",
    "topic_drift",
    "confused_user",
    "angry_user"
  ])
});

export const analyticsQuerySchema = z.object({
  metric: z.enum([
    "collection_rate",
    "ptp_rate",
    "callback_rate",
    "escalation_rate",
    "connect_rate",
    "average_call_duration"
  ]),
  campaignId: uuidSchema.optional(),
  from: isoDateTimeSchema,
  to: isoDateTimeSchema,
  dimensions: z.array(z.string()).optional()
});

export type CreateCampaignInput = z.infer<typeof createCampaignSchema>;
export type StartCallInput = z.infer<typeof startCallSchema>;
export type TranscriptChunkInput = z.infer<typeof transcriptChunkSchema>;
export type CreateCallbackInput = z.infer<typeof createCallbackSchema>;
export type CreatePaymentCommitmentInput = z.infer<typeof createPaymentCommitmentSchema>;
export type AgentConfigurationDraftInput = z.infer<typeof agentConfigurationDraftSchema>;
export type RunRedTeamTestInput = z.infer<typeof runRedTeamTestSchema>;
export type AnalyticsQueryInput = z.infer<typeof analyticsQuerySchema>;

