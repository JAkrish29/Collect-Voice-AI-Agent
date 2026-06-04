# Simulation Environment

The platform runs in simulation mode before external API integration. The simulator mocks:

- OpenAI
- Vapi
- ElevenLabs
- Twilio

## Scenarios

- `successful_call`
- `failed_call`
- `disconnected_call`
- `wrong_customer`
- `already_paid`
- `callback_requested`
- `abusive_user`
- `multilingual_switching`
- `payment_commitment`

## Run Simulation Suite

```bash
curl -X POST http://localhost:3000/api/simulation/run \
  -H "content-type: application/json" \
  -H "x-user-id: 00000000-0000-0000-0000-000000000001" \
  -H "x-organization-id: 10000000-0000-0000-0000-000000000001" \
  -H "x-user-role: owner" \
  -d '{"includeReports":true}'
```

## Reports

The simulator generates:

- Coverage report
- Failure report
- Latency report
- Stress testing report
- Scalability testing report

These reports are deterministic and do not require provider credentials.
