import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>) => ({ negado: s["negado"] ? 1 : undefined }),
  head: () => ({
    meta: [
      { title: "Entrar — Rafael Fonseca" },
      { name: "description", content: "Acesso restrito ao painel interno." },
      { property: "og:title", content: "Entrar — Rafael Fonseca" },
      { property: "og:description", content: "Acesso restrito ao painel interno." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { negado } = Route.useSearch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(negado ? "Esta conta não tem acesso ao painel." : null);
  const [loading, setLoading] = useState(false);

  async function entrar(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return setMsg("E-mail ou senha incorretos.");
    navigate({ to: "/painel" });
  }

  async function esqueci() {
    if (!email) return setMsg("Digite seu e-mail primeiro.");
    await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
    setMsg("Se a conta existir, enviamos um link para redefinir a senha.");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
      <form onSubmit={entrar} className="w-full max-w-sm space-y-5 rounded-md border border-border p-8">
        <div>
          <p className="text-xs tracking-widest text-muted-foreground">ACESSO RESTRITO</p>
          <h1 className="mt-2 text-2xl font-semibold">Entrar no painel</h1>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {msg && <p className="text-sm text-muted-foreground">{msg}</p>}
        <Button type="submit" className="w-full" disabled={loading}>{loading ? "Entrando..." : "Entrar"}</Button>
        <button type="button" onClick={esqueci} className="w-full text-sm text-muted-foreground underline">Esqueci minha senha</button>
      </form>
    </main>
  );
}
