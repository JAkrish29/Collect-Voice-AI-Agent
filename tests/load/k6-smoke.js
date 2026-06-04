const baseUrl = process.env.LOAD_TEST_URL || "http://127.0.0.1:3000";
const requests = Number(process.env.LOAD_TEST_REQUESTS || 25);

async function main() {
  const started = Date.now();
  const results = await Promise.all(
    Array.from({ length: requests }, async () => {
      const response = await fetch(`${baseUrl}/api/simulation/run`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-user-id": "00000000-0000-0000-0000-000000000001",
          "x-organization-id": "10000000-0000-0000-0000-000000000001",
          "x-user-role": "owner"
        },
        body: JSON.stringify({ includeReports: true })
      });
      return response.status;
    })
  );
  const failures = results.filter((status) => status !== 200).length;
  console.log(JSON.stringify({ requests, failures, durationMs: Date.now() - started }));
  if (failures > 0) process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
