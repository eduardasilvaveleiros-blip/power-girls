-- Execute no SQL Editor do seu projeto Supabase, se ainda não fez a Etapa A.
-- Não utiliza chave service_role na aplicação.
create table if not exists public.respostas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null default auth.uid(),
  entrada text,
  resposta text,
  criado_em timestamptz default now()
);

alter table public.respostas enable row level security;

-- Permite executar novamente sem duplicar as políticas da apostila.
do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public'
      and tablename = 'respostas' and policyname = 'cada uma ve as suas'
  ) then
    create policy "cada uma ve as suas" on public.respostas
      for select to authenticated using (auth.uid() = user_id);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname = 'public'
      and tablename = 'respostas' and policyname = 'cada uma salva as suas'
  ) then
    create policy "cada uma salva as suas" on public.respostas
      for insert to authenticated with check (auth.uid() = user_id);
  end if;
end $$;
