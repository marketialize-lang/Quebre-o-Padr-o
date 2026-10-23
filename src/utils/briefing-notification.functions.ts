import { createServerFn } from "@tanstack/react-start";
import { briefingSchema } from "@/lib/briefing";

// The form ID is a public endpoint identifier, not an authentication secret.
// Embedding it avoids reliance on a paid or unavailable deployment secret store.
const FORM_SUBMIT_ENDPOINT = "https://formsubmit.app/f/8gjnvr56yu";

function validateBriefingNotification(value: unknown) {
  const parsed = briefingSchema.safeParse(value);
  if (!parsed.success) throw new Error("Briefing inválido.");
  return parsed.data;
}

export const sendBriefingNotification = createServerFn({ method: "POST" })
  .validator(validateBriefingNotification)
  .handler(async ({ data }) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12_000);
    try {
      const fields = {
        name: data.nome,
        email: data.email,
        whatsapp: data.whatsapp ?? "Não informado",
        negocio: data.negocio,
        objetivo: data.objetivo,
        plano: data.plano,
        prazo: data.prazo,
        conteudo: data.conteudo ?? "Não informado",
        referencias: data.referencias ?? "Não informado",
        detalhes: data.detalhes ?? "Não informado",
        consentimento: data.consentimento ? "Autorizado" : "Não autorizado",
        _subject: `Novo briefing — ${data.nome}`,
        _replyto: data.email,
        _gotcha: "",
      };
      const response = await fetch(FORM_SUBMIT_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Origin: "https://hello-maria-idea-garden.lovable.app",
        },
        body: JSON.stringify(fields),
        signal: controller.signal,
      });
      if (!response.ok) return { sent: false, reason: "delivery-failed" as const };
      const result = (await response.json().catch(() => null)) as { ok?: boolean } | null;
      return result?.ok ? { sent: true as const } : { sent: false as const, reason: "delivery-failed" as const };
    } catch {
      return { sent: false, reason: "delivery-failed" as const };
    } finally {
      clearTimeout(timeout);
    }
  });
