import { describe, expect, it } from "vitest";
import { briefingSchema } from "./briefing-form";

const base = { nome: "Ana", email: "ana@ex.com", whatsapp: "", negocio: "Café", objetivo: "Nova página", plano: "Página objetiva", prazo: "30 dias", conteudo: "", referencias: "", detalhes: "", consentimento: true };

describe("briefing", () => {
  it("aceita briefing válido", () => expect(briefingSchema.safeParse(base).success).toBe(true));
  it("exige consentimento", () => expect(briefingSchema.safeParse({ ...base, consentimento: false }).success).toBe(false));
  it("exige e-mail válido", () => expect(briefingSchema.safeParse({ ...base, email: "x" }).success).toBe(false));
});
