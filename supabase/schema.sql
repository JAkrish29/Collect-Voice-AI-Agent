create extension if not exists "pgcrypto";

create type user_role as enum (
  'owner',
  'admin',
  'campaign_manager',
  'supervisor',
  'agent_operator',
  'qa_reviewer',
  'analyst',
  'auditor'
);

create type campaign_status as enum (
  'draft',
  'scheduled',
  'live',
  'paused',
  'completed',
  'archived'
);

create type call_status as enum (
  'queued',
  'initiating',
  'ringing',
  'connected',
  'completed',
  'failed',
  'escalated',
  'cancelled'
);

create type call_provider as enum (
  'vapi',
  'twilio',
  'manual',
  'simulation'
);

create type transcript_speaker as enum (
  'agent',
  'customer',
  'system',
  'supervisor'
);

create type commitment_status as enum (
  'pending',
  'kept',
  'broken',
  'cancelled',
  'expired'
);

create type callback_status as enum (
  'requested',
  'scheduled',
  'completed',
  'missed',
  'cancelled'
);

create table users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,
  organization_id uuid not null,
  full_name text not null,
  email text not null unique,
  phone_e164 text,
  role user_role not null default 'agent_operator',
  status text not null default 'active',
  timezone text not null default 'Asia/Kolkata',
  last_seen_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table customers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  external_customer_id text,
  full_name text not null,
  phone_e164 text not null,
  alternate_phone_e164 text,
  email text,
  preferred_language text not null default 'en',
  region text,
  city text,
  state text,
  risk_score numeric(5,2) not null default 0 check (risk_score >= 0 and risk_score <= 100),
  payment_likelihood numeric(5,2) not null default 0 check (payment_likelihood >= 0 and payment_likelihood <= 100),
  contact_window jsonb not null default '{}'::jsonb,
  consent_flags jsonb not null default '{}'::jsonb,
  tags text[] not null default '{}',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, phone_e164)
);

create table loans (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  customer_id uuid not null references customers(id) on delete cascade,
  external_loan_id text,
  product_type text not null,
  principal_amount numeric(14,2) not null check (principal_amount >= 0),
  outstanding_amount numeric(14,2) not null check (outstanding_amount >= 0),
  overdue_amount numeric(14,2) not null default 0 check (overdue_amount >= 0),
  emi_amount numeric(14,2),
  due_date date not null,
  dpd integer not null default 0 check (dpd >= 0),
  bucket text not null,
  status text not null default 'overdue',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, external_loan_id)
);

create table agent_configurations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  name text not null,
  version integer not null default 1,
  status text not null default 'draft',
  persona text not null,
  system_prompt text not null,
  languages text[] not null default '{en}',
  voice_provider text not null default 'vapi',
  voice_id text,
  llm_provider text not null default 'openai',
  llm_model text,
  flow_definition jsonb not null default '{}'::jsonb,
  objection_library jsonb not null default '[]'::jsonb,
  compliance_rules jsonb not null default '{}'::jsonb,
  published_at timestamptz,
  created_by uuid references users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, name, version)
);

create table campaigns (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  agent_configuration_id uuid references agent_configurations(id),
  name text not null,
  description text,
  status campaign_status not null default 'draft',
  collection_target numeric(14,2) not null default 0,
  due_customer_count integer not null default 0,
  success_rate numeric(5,2) not null default 0,
  filters jsonb not null default '{}'::jsonb,
  schedule jsonb not null default '{}'::jsonb,
  starts_at timestamptz,
  ends_at timestamptz,
  created_by uuid references users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, name)
);

create table calls (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  campaign_id uuid references campaigns(id) on delete set null,
  customer_id uuid not null references customers(id) on delete restrict,
  loan_id uuid references loans(id) on delete set null,
  agent_configuration_id uuid references agent_configurations(id) on delete set null,
  provider call_provider not null default 'simulation',
  provider_call_id text,
  status call_status not null default 'queued',
  direction text not null default 'outbound',
  phone_from text,
  phone_to text not null,
  language_detected text,
  emotion text,
  sentiment_score numeric(5,2),
  started_at timestamptz,
  connected_at timestamptz,
  ended_at timestamptz,
  duration_seconds integer,
  outcome text,
  recording_url text,
  summary text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, provider, provider_call_id)
);

create table call_transcripts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  call_id uuid not null references calls(id) on delete cascade,
  sequence_number integer not null,
  speaker transcript_speaker not null,
  language text,
  content text not null,
  confidence numeric(5,4),
  started_at_ms integer,
  ended_at_ms integer,
  is_final boolean not null default true,
  redaction_status text not null default 'pending',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (call_id, sequence_number)
);

create table call_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  call_id uuid references calls(id) on delete cascade,
  campaign_id uuid references campaigns(id) on delete set null,
  provider call_provider,
  provider_event_id text,
  event_type text not null,
  event_version integer not null default 1,
  occurred_at timestamptz not null default now(),
  payload jsonb not null default '{}'::jsonb,
  normalized_payload jsonb not null default '{}'::jsonb,
  processed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (organization_id, provider, provider_event_id)
);

create table callback_requests (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  call_id uuid references calls(id) on delete set null,
  customer_id uuid not null references customers(id) on delete restrict,
  loan_id uuid references loans(id) on delete set null,
  requested_for timestamptz not null,
  status callback_status not null default 'requested',
  preferred_language text,
  preferred_channel text not null default 'voice',
  assigned_to uuid references users(id),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table payment_commitments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  call_id uuid references calls(id) on delete set null,
  customer_id uuid not null references customers(id) on delete restrict,
  loan_id uuid not null references loans(id) on delete restrict,
  amount numeric(14,2) not null check (amount > 0),
  promised_for date not null,
  status commitment_status not null default 'pending',
  channel text not null default 'voice',
  confidence numeric(5,4),
  payment_reference text,
  captured_by text not null default 'ai_agent',
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table redteam_tests (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  agent_configuration_id uuid references agent_configurations(id) on delete set null,
  scenario_name text not null,
  scenario_type text not null,
  status text not null default 'queued',
  risk_score numeric(5,2) not null default 0 check (risk_score >= 0 and risk_score <= 100),
  result text not null default 'pending',
  prompt_snapshot jsonb not null default '{}'::jsonb,
  transcript jsonb not null default '[]'::jsonb,
  evaluation jsonb not null default '{}'::jsonb,
  ai_reasoning text,
  started_at timestamptz,
  completed_at timestamptz,
  created_by uuid references users(id),
  created_at timestamptz not null default now()
);

create table analytics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  campaign_id uuid references campaigns(id) on delete cascade,
  metric_name text not null,
  metric_scope text not null default 'campaign',
  period_start timestamptz not null,
  period_end timestamptz not null,
  dimensions jsonb not null default '{}'::jsonb,
  value numeric(18,4) not null,
  computed_at timestamptz not null default now(),
  unique (organization_id, campaign_id, metric_name, metric_scope, period_start, period_end, dimensions)
);

create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  actor_user_id uuid references users(id) on delete set null,
  action text not null,
  resource_type text not null,
  resource_id uuid,
  request_id text,
  ip_address inet,
  user_agent text,
  before_state jsonb,
  after_state jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index customers_org_risk_idx on customers (organization_id, risk_score desc);
create index customers_org_phone_idx on customers (organization_id, phone_e164);
create index loans_customer_due_idx on loans (customer_id, due_date);
create index campaigns_org_status_idx on campaigns (organization_id, status);
create index calls_org_status_idx on calls (organization_id, status, created_at desc);
create index calls_provider_id_idx on calls (provider, provider_call_id);
create index call_transcripts_call_sequence_idx on call_transcripts (call_id, sequence_number);
create index call_events_call_time_idx on call_events (call_id, occurred_at desc);
create index call_events_type_time_idx on call_events (organization_id, event_type, occurred_at desc);
create index callbacks_status_time_idx on callback_requests (organization_id, status, requested_for);
create index commitments_status_date_idx on payment_commitments (organization_id, status, promised_for);
create index redteam_agent_time_idx on redteam_tests (agent_configuration_id, created_at desc);
create index analytics_metric_period_idx on analytics (organization_id, metric_name, period_start desc);
create index audit_logs_org_time_idx on audit_logs (organization_id, created_at desc);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger users_set_updated_at before update on users for each row execute function set_updated_at();
create trigger customers_set_updated_at before update on customers for each row execute function set_updated_at();
create trigger loans_set_updated_at before update on loans for each row execute function set_updated_at();
create trigger campaigns_set_updated_at before update on campaigns for each row execute function set_updated_at();
create trigger calls_set_updated_at before update on calls for each row execute function set_updated_at();
create trigger callbacks_set_updated_at before update on callback_requests for each row execute function set_updated_at();
create trigger commitments_set_updated_at before update on payment_commitments for each row execute function set_updated_at();
create trigger agent_configurations_set_updated_at before update on agent_configurations for each row execute function set_updated_at();

alter table users enable row level security;
alter table customers enable row level security;
alter table loans enable row level security;
alter table campaigns enable row level security;
alter table calls enable row level security;
alter table call_transcripts enable row level security;
alter table call_events enable row level security;
alter table callback_requests enable row level security;
alter table payment_commitments enable row level security;
alter table agent_configurations enable row level security;
alter table redteam_tests enable row level security;
alter table analytics enable row level security;
alter table audit_logs enable row level security;

create or replace function current_organization_id()
returns uuid as $$
  select organization_id from users where auth_user_id = auth.uid() limit 1;
$$ language sql stable security definer;

create policy users_org_select on users for select using (organization_id = current_organization_id());
create policy customers_org_all on customers for all using (organization_id = current_organization_id()) with check (organization_id = current_organization_id());
create policy loans_org_all on loans for all using (organization_id = current_organization_id()) with check (organization_id = current_organization_id());
create policy campaigns_org_all on campaigns for all using (organization_id = current_organization_id()) with check (organization_id = current_organization_id());
create policy calls_org_all on calls for all using (organization_id = current_organization_id()) with check (organization_id = current_organization_id());
create policy call_transcripts_org_all on call_transcripts for all using (organization_id = current_organization_id()) with check (organization_id = current_organization_id());
create policy call_events_org_all on call_events for all using (organization_id = current_organization_id()) with check (organization_id = current_organization_id());
create policy callback_requests_org_all on callback_requests for all using (organization_id = current_organization_id()) with check (organization_id = current_organization_id());
create policy payment_commitments_org_all on payment_commitments for all using (organization_id = current_organization_id()) with check (organization_id = current_organization_id());
create policy agent_configurations_org_all on agent_configurations for all using (organization_id = current_organization_id()) with check (organization_id = current_organization_id());
create policy redteam_tests_org_all on redteam_tests for all using (organization_id = current_organization_id()) with check (organization_id = current_organization_id());
create policy analytics_org_select on analytics for select using (organization_id = current_organization_id());
create policy audit_logs_org_select on audit_logs for select using (organization_id = current_organization_id());

