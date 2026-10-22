create table public.briefings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status text not null default 'Novo' check (status in ('Novo','Em contato','Alinhado','Concluído')),
  nome text not null check (char_length(trim(nome)) between 2 and 120),
  email text not null check (char_length(email) <= 255 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  whatsapp text check (whatsapp is null or char_length(whatsapp) <= 30),
  negocio text not null check (char_length(trim(negocio)) between 2 and 200),
  objetivo text not null check (char_length(trim(objetivo)) between 5 and 2000),
  plano text not null check (plano in ('Página objetiva','Página estratégica','Página completa','Ainda não sei')),
  prazo text not null check (char_length(prazo) <= 100),
  conteudo text check (conteudo is null or char_length(conteudo) <= 2000),
  referencias text check (referencias is null or char_length(referencias) <= 2000),
  detalhes text check (detalhes is null or char_length(detalhes) <= 4000),
  consentimento boolean not null check (consentimento = true)
);
grant insert on public.briefings to anon, authenticated;
grant select, update on public.briefings to authenticated;
grant all on public.briefings to service_role;
alter table public.briefings enable row level security;
create policy "Visitantes enviam briefing novo" on public.briefings for insert to anon, authenticated
  with check (status = 'Novo' and consentimento = true);
create policy "Admin le briefings" on public.briefings for select to authenticated
  using (public.has_role(auth.uid(), 'admin'));
create policy "Admin atualiza briefings" on public.briefings for update to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));