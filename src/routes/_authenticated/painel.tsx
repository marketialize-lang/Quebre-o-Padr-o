import { createFileRoute, isRedirect, redirect, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const STATUSES = ["Novo", "Em contato", "Alinhado", "Concluído"] as const;

export const Route = createFileRoute("/_authenticated/painel")({
  head: () => ({
    meta: [
      { title: "Painel de briefings — Rafael Fonseca" },
      { name: "description", content: "Área interna para acompanhar briefings recebidos." },
      { property: "og:title", content: "Painel de briefings — Rafael Fonseca" },
      { property: "og:description", content: "Área interna para acompanhar briefings recebidos." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  beforeLoad: async ({ context }) => {
    try {
      const { data, error } = await supabase.rpc("has_role", { _user_id: context.user.id, _role: "admin" });
      if (error || !data) {
        await supabase.auth.signOut();
        throw redirect({ to: "/auth", search: { negado: 1 } });
      }
    } catch (error) {
      if (isRedirect(error)) throw error;
      await supabase.auth.signOut();
      throw redirect({ to: "/auth", search: { negado: 1 } });
    }
  },
  component: Painel,
});

const SIMULACAO_PLANOS = [
  { nome: "Página objetiva", valor: 497 },
  { nome: "Página estratégica", valor: 1000 },
  { nome: "Página completa", valor: 1500 },
] as const;

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

function Painel() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const listaRef = useRef<HTMLDivElement>(null);
  const [quantidades, setQuantidades] = useState<Record<string, number>>({});

  const { data: briefings = [], isLoading, error } = useQuery({
    queryKey: ["briefings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("briefings").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const mudar = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("briefings").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["briefings"] }),
  });

  async function sair() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  function ajustarQuantidade(nome: string, delta: number) {
    setQuantidades((atual) => ({ ...atual, [nome]: Math.max(0, (atual[nome] ?? 0) + delta) }));
  }

  const totalSimulado = SIMULACAO_PLANOS.reduce((soma, p) => soma + p.valor * (quantidades[p.nome] ?? 0), 0);
  const novos = briefings.filter((b) => b.status === "Novo").length;
  const emAndamento = briefings.filter((b) => b.status === "Em contato" || b.status === "Alinhado").length;
  const concluidos = briefings.filter((b) => b.status === "Concluído").length;

  const campos: [string, keyof (typeof briefings)[number]][] = [
    ["E-mail", "email"], ["WhatsApp", "whatsapp"], ["Negócio", "negocio"], ["Plano", "plano"], ["Prazo", "prazo"],
    ["Objetivo", "objetivo"], ["Conteúdo disponível", "conteudo"], ["Referências", "referencias"], ["Detalhes", "detalhes"],
  ];

  return (
    <main className="painel">
      <div className="painel-shell">
        <header className="painel-topo">
          <div className="painel-marca">
            <span className="painel-wordmark">rafael<span>.</span>fonseca</span>
            <p className="painel-kicker"><span aria-hidden="true" />PAINEL INTERNO</p>
          </div>
          <div className="painel-usuario">
            <span>{user.email}</span>
            <button type="button" className="painel-botao" onClick={sair}>Sair</button>
          </div>
        </header>

        <section className="painel-intro">
          <h1>Briefings <em>recebidos</em></h1>
          <p>Acompanhe quem pediu proposta pelo site e mova cada pedido pelo funil.</p>
        </section>

        <section className="painel-indicadores" aria-label="Indicadores">
          <Indicador label="Total" valor={briefings.length} />
          <Indicador label="Novos" valor={novos} destaque={novos > 0} />
          <Indicador label="Em andamento" valor={emAndamento} />
          <Indicador label="Concluídos" valor={concluidos} />
        </section>

        <div className="painel-grade">
          <div className="painel-lista" ref={listaRef}>
            <h2 className="painel-secao-titulo">Pedidos</h2>
            {isLoading && <p className="painel-aviso">Carregando...</p>}
            {error && <p className="painel-aviso painel-aviso--erro">Não foi possível carregar os briefings.</p>}
            {!isLoading && !error && briefings.length === 0 && (
              <p className="painel-vazio">Nenhum briefing recebido ainda.</p>
            )}

            <ul className="painel-cards">
              {briefings.map((b) => (
                <li key={b.id} className="painel-card">
                  <details>
                    <summary>
                      <span className="painel-card-id">
                        <strong>{b.nome}</strong>
                        <time>{new Date(b.created_at).toLocaleString("pt-BR")}</time>
                      </span>
                      <span className={`painel-status painel-status--${b.status.toLowerCase().replace(/\s/g, "-").normalize("NFD").replace(/[̀-ͯ]/g, "")}`}>{b.status}</span>
                    </summary>
                    <dl className="painel-detalhes">
                      {campos.map(([label, k]) => b[k] ? (
                        <div key={k} className={["objetivo", "conteudo", "referencias", "detalhes"].includes(k) ? "amplo" : ""}>
                          <dt>{label}</dt>
                          <dd>{String(b[k])}</dd>
                        </div>
                      ) : null)}
                    </dl>
                  </details>
                  <label className="painel-mudar-status">
                    <span>Status</span>
                    <select
                      value={b.status}
                      disabled={mudar.isPending}
                      onChange={(e) => mudar.mutate({ id: b.id, status: e.target.value })}
                    >
                      {STATUSES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </label>
                </li>
              ))}
            </ul>
          </div>

          <aside className="painel-simulacao" aria-label="Simulação de projetos">
            <h2 className="painel-secao-titulo">Simulação de projetos</h2>
            <p className="painel-simulacao-nota">Estimativa com os valores dos planos. Não representa valores recebidos.</p>
            <ul>
              {SIMULACAO_PLANOS.map((p) => (
                <li key={p.nome}>
                  <div className="painel-plano-info">
                    <strong>{p.nome}</strong>
                    <span>{brl.format(p.valor)}</span>
                  </div>
                  <div className="painel-quantidade">
                    <button type="button" aria-label={`Diminuir ${p.nome}`} onClick={() => ajustarQuantidade(p.nome, -1)}>−</button>
                    <output aria-label={`Quantidade de ${p.nome}`}>{quantidades[p.nome] ?? 0}</output>
                    <button type="button" aria-label={`Aumentar ${p.nome}`} onClick={() => ajustarQuantidade(p.nome, 1)}>+</button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="painel-simulacao-total">
              <span>Total simulado</span>
              <strong>{brl.format(totalSimulado)}</strong>
            </div>
          </aside>
        </div>
      </div>

      <nav className="painel-menu-mobile" aria-label="Menu do painel">
        <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Início</button>
        <button type="button" onClick={() => listaRef.current?.scrollIntoView({ behavior: "smooth" })}>Briefings</button>
        <button type="button" onClick={sair}>Sair</button>
      </nav>
    </main>
  );
}

function Indicador({ label, valor, destaque = false }: { label: string; valor: number; destaque?: boolean }) {
  return (
    <div className={`painel-indicador${destaque ? " painel-indicador--destaque" : ""}`}>
      <p>{label}</p>
      <strong>{valor}</strong>
    </div>
  );
}
