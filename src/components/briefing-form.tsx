import { useState, type FormEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { briefingSchema, PLANOS, type BriefingPlan } from "@/lib/briefing";
import { sendBriefingNotification } from "@/utils/briefing-notification.functions";

export { briefingSchema, PLANOS } from "@/lib/briefing";
export type { BriefingPlan } from "@/lib/briefing";

type Errors = Partial<Record<string, string>>;
type FormState = "idle" | "sending" | "done" | "saved-without-email" | "error";

export function BriefingForm({ initialPlan }: { initialPlan?: BriefingPlan }) {
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<FormState>("idle");

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
    if (error) {
      setState("error");
      return;
    }
    try {
      const notification = await sendBriefingNotification({ data: parsed.data });
      setState(notification.sent ? "done" : "saved-without-email");
    } catch {
      setState("saved-without-email");
    }
  }

  if (state === "done" || state === "saved-without-email") {
    return (
      <div className="briefing-done" role="status">
        <span className="pricing-briefing-index">BRIEFING RECEBIDO</span>
        <h4>Obrigado! Seu briefing foi enviado.</h4>
        <p>{state === "done" ? "Recebi seu briefing e fui avisado por e-mail. Vou ler tudo com atenção e entrar em contato pelo e-mail ou WhatsApp informado." : "Seu briefing ficou salvo. O aviso por e-mail não foi confirmado agora; vou verificar o recebimento pelo painel."}</p>
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
        <select name="plano" defaultValue={initialPlan ?? ""}>
          <option value="" disabled>Selecione</option>
          {PLANOS.map((p) => <option key={p}>{p}</option>)}
        </select>{err("plano")}
      </label>
      <label>Prazo desejado*<input name="prazo" placeholder="Ex.: 30 dias" />{err("prazo")}</label>
      <label className="wide">Conteúdo / recursos disponíveis<textarea name="conteudo" rows={2} placeholder="Textos, fotos, logo, domínio..." /></label>
      <label className="wide">Referências / links<textarea name="referencias" rows={2} /></label>
      <label className="wide">Detalhes<textarea name="detalhes" rows={3} /></label>
      <label className="wide briefing-consent"><input type="checkbox" name="consentimento" /> Autorizo o contato sobre este projeto.*{err("consentimento")}</label>
      {state === "error" && <p className="briefing-error wide">Não foi possível registrar o briefing. Confira sua conexão e tente novamente.</p>}
      <button type="submit" className="wide" disabled={state === "sending"}>
        {state === "sending" ? "ENVIANDO..." : "ENVIAR BRIEFING"} <ArrowUpRight size={15} aria-hidden="true" />
      </button>
    </form>
  );
}
