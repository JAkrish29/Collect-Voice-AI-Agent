import type { ISODateTime, UUID } from "./api";

export type DomainEventName =
  | "campaign.created"
  | "campaign.started"
  | "campaign.paused"
  | "call.queued"
  | "call.started"
  | "call.ringing"
  | "call.connected"
  | "call.transcript.partial"
  | "call.transcript.final"
  | "call.sentiment.changed"
  | "call.language.changed"
  | "call.suggestion.created"
  | "call.callback.requested"
  | "call.payment_commitment.created"
  | "call.escalated"
  | "call.completed"
  | "call.failed"
  | "redteam.test.started"
  | "redteam.test.completed"
  | "agent_configuration.published"
  | "analytics.rollup.completed";

export type DomainEvent<TPayload extends Record<string, unknown> = Record<string, unknown>> = {
  eventId: UUID;
  organizationId: UUID;
  eventType: DomainEventName;
  eventVersion: number;
  occurredAt: ISODateTime;
  actorUserId?: UUID;
  campaignId?: UUID;
  callId?: UUID;
  customerId?: UUID;
  provider?: "vapi" | "twilio" | "elevenlabs" | "openai" | "simulation";
  providerEventId?: string;
  payload: TPayload;
};

export type CallTranscriptEventPayload = {
  sequenceNumber: number;
  speaker: "agent" | "customer" | "system" | "supervisor";
  content: string;
  language?: string;
  confidence?: number;
  isFinal: boolean;
};

export type CallPaymentCommitmentPayload = {
  loanId: UUID;
  amount: number;
  promisedFor: string;
  channel: "voice" | "sms" | "whatsapp" | "email";
  confidence?: number;
};

export type RealtimeMessage<TPayload extends Record<string, unknown> = Record<string, unknown>> = {
  channel: string;
  event: DomainEventName;
  payload: TPayload;
  publishedAt: ISODateTime;
};

export function organizationChannel(organizationId: UUID, scope: string) {
  return `org:${organizationId}:${scope}`;
}

export function callChannel(organizationId: UUID, callId: UUID) {
  return `org:${organizationId}:call:${callId}`;
}

