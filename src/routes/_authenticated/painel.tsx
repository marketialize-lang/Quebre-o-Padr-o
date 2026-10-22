import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

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

  async function sair() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <main className="min-h-screen bg-background px-6 py-12 text-foreground">
      <div className="mx-auto max-w-4xl">
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
        <section className="mt-10 rounded-md border border-dashed border-border p-10 text-center text-muted-foreground">
          Nenhum briefing recebido ainda.
        </section>
      </div>
    </main>
  );
}
