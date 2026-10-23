import { createServerFn } from "@tanstack/react-start";
import { briefingSchema } from "@/lib/briefing";

function validateBriefingNotification(value: unknown) {
  const parsed = briefingSchema.safeParse(value);
  if (!parsed.success) throw new Error("Briefing inválido.");
  return parsed.data;
}

export const sendBriefingNotification = createServerFn({ method: "POST" })
  .validator(validateBriefingNotification)
  .handler(async ({ data }) => {
    const endpoint = process.env["BRIEFING_EMAIL_WEBHOOK_URL"];
    const secret = process.env["BRIEFING_EMAIL_WEBHOOK_SECRET"];
    if (!endpoint || !secret) return { sent: false, reason: "not-configured" as const };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12_000);
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret, briefing: data }),
        signal: controller.signal,
      });
      if (!response.ok) return { sent: false, reason: "delivery-failed" as const };
      const result = (await response.json().catch(() => null)) as { sent?: boolean } | null;
      return result?.sent ? { sent: true as const } : { sent: false as const, reason: "delivery-failed" as const };
    } catch {
      return { sent: false, reason: "delivery-failed" as const };
    } finally {
      clearTimeout(timeout);
    }
  });
