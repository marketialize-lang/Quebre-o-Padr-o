import { useState, type FormEvent } from "react";
import { z } from "zod";
import { ArrowUpRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const PLANOS = ["Página objetiva", "Página estratégica", "Página completa", "Ainda não sei"] as const;

const opt = (max: number) => z.string().trim().max(max).transform((v) => (v === "" ? null : v));

export const briefingSchema = z.object({
  nome: z.string().trim().min(2, "Informe seu nome").max(120),
  email: z.string().trim().email("E-mail inválido").max(255),
  whatsapp: opt(30),
  negocio: z.string().trim().min(2, "Conte qual é o seu negócio").max(200),
  objetivo: z.string().trim().min(5, "Descreva o objetivo do projeto").max(2000),
  plano: z.enum(PLANOS, { message: "Escolha um plano" }),
  prazo: z.string().trim().min(1, "Informe o prazo desejado").max(100),
  conteudo: opt(2000),
  referencias: opt(2000),
  detalhes: opt(4000),
  consentimento: z.literal(true, { message: "É preciso autorizar o contato" }),
});

type Errors = Partial<Record<string, string>>;

export function BriefingForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const raw = Object.fromEntries(fd.entries());
    const parsed = briefingSchema.safeParse({ ...raw, consentimento: fd.get("consentimento") === "on" });
    if (!parsed.success) {
      const errs: Errors = {};
      for (const issue of parsed.error.issues) errs[String(issue.path[0])] ??= issue.message;
      setErrors(errs);
      return;
    }
    setErrors({});
    setState("sending");
    const { error } = await supabase.from("briefings").insert(parsed.data);
    setState(error ? "error" : "done");
  }

  if (state === "done") {
    return (
      <div className="briefing-done" role="status">
        <span className="pricing-briefing-index">BRIEFING RECEBIDO</span>
        <h4>Obrigado! Seu briefing foi enviado.</h4>
        <p>Vou ler tudo com atenção e entrar em contato pelo e-mail ou WhatsApp informado.</p>
      </div>
    );
  }

  const err = (k: string) => errors[k] && <small className="briefing-error">{errors[k]}</small>;

  return (
    <form className="briefing-form" onSubmit={onSubmit} noValidate>
      <label>Nome*<input name="nome" autoComplete="name" />{err("nome")}</label>
      <label>E-mail*<input name="email" type="email" autoComplete="email" />{err("email")}</label>
      <label>WhatsApp (opcional)<input name="whatsapp" type="tel" autoComplete="tel" />{err("whatsapp")}</label>
      <label>Negócio / nicho*<input name="negocio" />{err("negocio")}</label>
      <label className="wide">Objetivo do projeto*<textarea name="objetivo" rows={3} />{err("objetivo")}</label>
      <label>Escopo / plano de interesse*
        <select name="plano" defaultValue="">
          <option value="" disabled>Selecione</option>
          {PLANOS.map((p) => <option key={p}>{p}</option>)}
        </select>{err("plano")}
      </label>
      <label>Prazo desejado*<input name="prazo" placeholder="Ex.: 30 dias" />{err("prazo")}</label>
      <label className="wide">Conteúdo / recursos disponíveis<textarea name="conteudo" rows={2} placeholder="Textos, fotos, logo, domínio..." /></label>
      <label className="wide">Referências / links<textarea name="referencias" rows={2} /></label>
      <label className="wide">Detalhes<textarea name="detalhes" rows={3} /></label>
      <label className="wide briefing-consent"><input type="checkbox" name="consentimento" /> Autorizo o contato sobre este projeto.*{err("consentimento")}</label>
      {state === "error" && <p className="briefing-error wide">Não foi possível enviar. Tente novamente.</p>}
      <button type="submit" className="wide" disabled={state === "sending"}>
        {state === "sending" ? "ENVIANDO..." : "ENVIAR BRIEFING"} <ArrowUpRight size={15} aria-hidden="true" />
      </button>
    </form>
  );
}
