import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

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
    const { data } = await supabase.rpc("has_role", { _user_id: context.user.id, _role: "admin" });
    if (!data) {
      await supabase.auth.signOut();
      throw redirect({ to: "/auth", search: { negado: 1 } });
    }
  },
  component: Painel,
});

function Painel() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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

  const campos: [string, keyof (typeof briefings)[number]][] = [
    ["E-mail", "email"], ["WhatsApp", "whatsapp"], ["Negócio", "negocio"], ["Plano", "plano"], ["Prazo", "prazo"],
    ["Objetivo", "objetivo"], ["Conteúdo disponível", "conteudo"], ["Referências", "referencias"], ["Detalhes", "detalhes"],
  ];

  return (
    <main className="min-h-screen bg-background px-6 py-12 text-foreground">
      <div className="mx-auto max-w-5xl">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <p className="text-xs tracking-widest text-muted-foreground">PAINEL INTERNO</p>
            <h1 className="mt-2 text-3xl font-semibold">Briefings</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{user.email}</span>
            <Button variant="outline" onClick={sair}>Sair</Button>
          </div>
        </header>

        <section className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-5">
          <Contador label="Total" valor={briefings.length} />
          {STATUSES.map((s) => <Contador key={s} label={s} valor={briefings.filter((b) => b.status === s).length} />)}
        </section>

        {isLoading && <p className="mt-10 text-muted-foreground">Carregando...</p>}
        {error && <p className="mt-10 text-destructive">Não foi possível carregar os briefings.</p>}
        {!isLoading && !error && briefings.length === 0 && (
          <section className="mt-10 rounded-md border border-dashed border-border p-10 text-center text-muted-foreground">Nenhum briefing recebido ainda.</section>
        )}

        <ul className="mt-8 space-y-4">
          {briefings.map((b) => (
            <li key={b.id} className="rounded-md border border-border p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold">{b.nome}</h2>
                  <p className="text-xs text-muted-foreground">{new Date(b.created_at).toLocaleString("pt-BR")}</p>
                </div>
                <select
                  aria-label="Status"
                  className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={b.status}
                  disabled={mudar.isPending}
                  onChange={(e) => mudar.mutate({ id: b.id, status: e.target.value })}
                >
                  {STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                {campos.map(([label, k]) => b[k] ? (
                  <div key={k} className={["objetivo", "conteudo", "referencias", "detalhes"].includes(k) ? "sm:col-span-2" : ""}>
                    <dt className="text-xs tracking-widest text-muted-foreground">{label.toUpperCase()}</dt>
                    <dd className="whitespace-pre-wrap break-words text-sm">{String(b[k])}</dd>
                  </div>
                ) : null)}
              </dl>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

function Contador({ label, valor }: { label: string; valor: number }) {
  return (
    <div className="rounded-md border border-border p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{valor}</p>
    </div>
  );
}
