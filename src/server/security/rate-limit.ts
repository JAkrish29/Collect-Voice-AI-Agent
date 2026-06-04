import { getEnv } from "@/server/env";
import { rateLimited } from "@/server/lib/errors";

const buckets = new Map<string, { count: number; resetAt: number }>();

export function enforceRateLimit(key: string) {
  const env = getEnv();
  const now = Date.now();
  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + env.RATE_LIMIT_WINDOW_MS });
    return;
  }

  current.count += 1;
  if (current.count > env.RATE_LIMIT_MAX) {
    throw rateLimited();
  }
}
