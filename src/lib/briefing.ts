import { z } from "zod";

export const PLANOS = ["Página objetiva", "Página estratégica", "Página completa", "Ainda não sei"] as const;
export type BriefingPlan = typeof PLANOS[number];

const optionalText = (max: number) => z.string().trim().max(max).transform((value) => (value === "" ? null : value));

export const briefingSchema = z.object({
  nome: z.string().trim().min(2, "Informe seu nome").max(120),
  email: z.string().trim().email("E-mail inválido").max(255),
  whatsapp: optionalText(30),
  negocio: z.string().trim().min(2, "Conte qual é o seu negócio").max(200),
  objetivo: z.string().trim().min(5, "Descreva o objetivo do projeto").max(2000),
  plano: z.enum(PLANOS, { message: "Escolha um plano" }),
  prazo: z.string().trim().min(1, "Informe o prazo desejado").max(100),
  conteudo: optionalText(2000),
  referencias: optionalText(2000),
  detalhes: optionalText(4000),
  consentimento: z.literal(true, { message: "É preciso autorizar o contato" }),
});

export type BriefingSubmission = z.infer<typeof briefingSchema>;
