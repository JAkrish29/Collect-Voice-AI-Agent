import { getEnv } from "@/server/env";
import { withRetry } from "@/server/lib/retry";
import { logger } from "@/server/lib/logger";

export async function synthesizeSpeech(input: { text: string; voiceId: string }) {
  const env = getEnv();
  if (!env.ELEVENLABS_API_KEY) {
    return { audioUrl: `mock://elevenlabs/${input.voiceId}`, bytes: 0 };
  }

  return withRetry(async () => {
    const response = await fetch(`${env.ELEVENLABS_BASE_URL}/text-to-speech/${input.voiceId}`, {
      method: "POST",
      headers: {
        "xi-api-key": env.ELEVENLABS_API_KEY!,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text: input.text, model_id: "eleven_multilingual_v2" })
    });
    if (!response.ok) throw new Error(`ElevenLabs TTS failed: ${response.status}`);
    const buffer = await response.arrayBuffer();
    return { audioUrl: "storage://voice-assets/generated-audio", bytes: buffer.byteLength };
  }, { onRetry: (error, attempt) => logger.warn("elevenlabs.retry", { attempt, error: String(error) }) });
}
