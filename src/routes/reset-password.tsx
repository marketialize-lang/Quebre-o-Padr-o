import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Nova senha — Rafael Fonseca" },
      { name: "description", content: "Defina uma nova senha de acesso." },
      { property: "og:title", content: "Nova senha — Rafael Fonseca" },
      { property: "og:description", content: "Defina uma nova senha de acesso." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPage,
});

function ResetPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  async function salvar(e: FormEvent) {
    e.preventDefault();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) return setMsg("Não foi possível salvar. Abra o link do e-mail novamente.");
    navigate({ to: "/painel" });
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
      <form onSubmit={salvar} className="w-full max-w-sm space-y-5 rounded-md border border-border p-8">
        <h1 className="text-2xl font-semibold">Definir nova senha</h1>
        <div className="space-y-2">
          <Label htmlFor="password">Nova senha</Label>
          <Input id="password" type="password" minLength={8} required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {msg && <p className="text-sm text-muted-foreground">{msg}</p>}
        <Button type="submit" className="w-full">Salvar</Button>
      </form>
    </main>
  );
}
