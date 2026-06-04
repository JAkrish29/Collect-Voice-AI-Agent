# Collect Voice AI Agent
Enterprise AI collections platform for banks, NBFCs, lending institutions, and debt servicing teams.

## Stack

- Next.js 15
- TypeScript
- Supabase Postgres + Realtime
- OpenAI GPT-4o via environment-configured adapter
- Vapi voice calls
- ElevenLabs TTS
- Twilio telephony
- Zod validation
- RBAC, audit logs, rate limiting, retries

## Local Setup

Use Node `18.18+`; Node 20 or 22 is recommended.

```bash
npm install
cp .env.example .env.local
npm run dev
```

The backend runs in safe mock mode until provider and Supabase env vars are configured.

## Supabase

Schema:

```bash
supabase db reset
```

Primary SQL files:

- `supabase/schema.sql`
- `supabase/migrations/202606040001_initial_schema.sql`
- `supabase/seed.sql`

## API

OpenAPI spec: `openapi.yaml`

Development auth uses request headers:

- `x-user-id`
- `x-organization-id`
- `x-user-role`

## Docker

```bash
docker compose up --build
```

## Tests

```bash
npm run lint
npm run build
npm test
npm run test:e2e
npm run test:security
npm run test:integration
npm run test:redteam
npm run test:chaos
npm run test:coverage
npm run test:load
```

## Simulation Gate

Before any external API integration, run the deterministic simulation suite:

```bash
npm run test
npm run test:e2e
npm run test:load
npm run test:coverage
```

Reports live in `reports/` and coverage HTML is generated in `coverage/`.

## Provider Keys

No keys are committed. Configure these in deployment secrets:

- `OPENAI_API_KEY`
- `VAPI_API_KEY`
- `ELEVENLABS_API_KEY`
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `SUPABASE_SERVICE_ROLE_KEY`

## Production Notes

- Replace development header auth with Supabase JWT session verification before exposing externally.
- Keep RLS enabled for every tenant table.
- Use provider webhook signature verification in production.
- Configure dashboards for provider latency, webhook lag, call failure rate, red-team failures, and commitment conversion.
