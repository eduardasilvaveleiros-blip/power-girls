# Power Girls

Site criado com Next.js (App Router e JavaScript) para a oficina Do Zero ao Ar.

## Executar localmente

```bash
npm install
npm run dev
```

Abra http://localhost:3000.

## Publicar na Vercel

Importe este repositório na Vercel. O framework Next.js será detectado automaticamente e o comando de build será `npm run build`.

## Personalizar

- Textos: `app/page.js`
- Cores e estilos: `app/globals.css`

## Autenticação com Supabase

Antes de iniciar, copie `.env.example` para `.env.local` e configure `NEXT_PUBLIC_SUPABASE_URL` (URL do projeto) e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (chave pública publishable). Nunca use uma chave `service_role`.

No Supabase, habilite o provedor de e-mail e senha em Authentication. Em URL Configuration, configure a Site URL com a URL do site (localmente, `http://localhost:3000`). Se a confirmação de e-mail estiver habilitada, confirme o cadastro pelo link recebido antes de entrar com a senha. Configure também a URL de produção ao publicar.

A página `/login` permite entrar e criar conta. A página `/` verifica a identidade no servidor e redireciona visitantes para `/login`. O topo mostra o e-mail da usuária e permite sair. Sem as variáveis, o conteúdo protegido permanece inacessível e o login informa que falta configuração. Reinicie o servidor após configurar as variáveis; em produção, elas precisam estar disponíveis durante o build e a execução.

Execute `npm test` para validar login, cadastro, saída, validações e tradução de erros com o serviço de autenticação simulado. Um teste completo de autenticação real exige um projeto Supabase configurado.
