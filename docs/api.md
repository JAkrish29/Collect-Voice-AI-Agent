# API Documentation

All application APIs return an envelope:

```json
{
  "data": {},
  "requestId": "uuid"
}
```

Errors return:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request payload"
  },
  "requestId": "uuid"
}
```

## Development Auth

Until Supabase session auth is enabled, protected endpoints expect:

- `x-user-id`
- `x-organization-id`
- `x-user-role`

Example:

```bash
curl http://localhost:3000/api/customers \
  -H "x-user-id: 00000000-0000-0000-0000-000000000001" \
  -H "x-organization-id: 10000000-0000-0000-0000-000000000001" \
  -H "x-user-role: owner"
```

## Core Endpoints

- `GET /api/customers`
- `POST /api/customers/verify`
- `GET /api/campaigns`
- `POST /api/campaigns`
- `POST /api/campaigns/{id}/start`
- `POST /api/calls/start`
- `POST /api/calls/{id}/transcript`
- `POST /api/calls/{id}/summary`
- `POST /api/emi-reminders`
- `POST /api/objections/handle`
- `POST /api/payment-commitments`
- `POST /api/callbacks`
- `POST /api/crm/update`
- `POST /api/agent-configurations`
- `POST /api/redteam-tests`
- `GET /api/analytics`
- `POST /api/simulation/run`

See `openapi.yaml` for request schemas.
