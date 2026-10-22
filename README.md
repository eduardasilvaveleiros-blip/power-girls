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

## Recuperação de senha

Na página de login, clique em “Esqueci minha senha”, informe o e-mail e abra o link recebido no mesmo navegador em que fez o pedido. A tela “Crie uma nova senha” permite definir e confirmar a senha. Links inválidos ou expirados permitem solicitar outro envio. A resposta ao pedido não revela se um e-mail possui conta.

No Supabase, em **Authentication → URL Configuration**, mantenha **Site URL** com o endereço oficial do site e adicione `https://SEU-SITE.vercel.app/auth/callback` a **Redirect URLs**, substituindo pelo domínio real. Para desenvolvimento, adicione `http://localhost:3000/auth/callback`. O envio depende da configuração de e-mail do Supabase; seu serviço padrão pode restringir destinatários e possui limites de envio. Para público externo, configure SMTP em Authentication. Não é necessário desativar a confirmação de e-mail para recuperar senhas.

O fluxo usa PKCE e cookies de sessão; o template de recuperação do Supabase deve manter o link padrão `{{ .ConfirmationURL }}`. Se o e-mail não chegar, confira spam, limites de envio e logs do Supabase. O envio real só pode ser validado com um projeto Supabase e uma caixa de e-mail acessível.

## Treino de entrevista

O arquivo `desafio.js` configura título, campos, modelo e prompt da página principal. Com `modoTeste: true`, o botão retorna uma avaliação de exemplo sem chamar a IA nem consumir cota. A rota `POST /api/ia` exige uma sessão autenticada.

Para usar a IA real, configure `OPENROUTER_API_KEY` no servidor (na Vercel, em Environment Variables) e altere `modoTeste` para `false`. Nunca use o prefixo `NEXT_PUBLIC_` para essa chave nem coloque seu valor no código. Reinicie o servidor local ou faça um novo deploy após configurar a variável. A resposta é exibida como texto, preservando quebras de linha; erros do provedor são apresentados em português.

## Histórico privado

Cada avaliação (inclusive o exemplo em modo de teste) é salva na tabela `respostas`, com os campos e seus rótulos em `entrada` e o texto gerado em `resposta`. A página `/historico` exige login e lista as análises da conta atual em ordem decrescente, com horário de Brasília. O link “Meu histórico” fica no topo.

Se ainda não fez a Etapa A da apostila, execute `supabase/respostas.sql` no SQL Editor do Supabase. Ele cria a tabela e as políticas de acesso por usuária, sem apagar registros. Em uma tabela existente, confira se as colunas e as políticas correspondem à apostila e se não existem políticas adicionais permitindo acesso a outras contas. Use somente a chave pública do Supabase e a sessão da usuária; nunca `service_role`.

Se a gravação falhar, a avaliação permanece visível e um aviso informa que ela não foi salva. Para validar o isolamento real, faça duas análises com a conta A; em janela anônima, faça uma com a conta B. Cada conta deve enxergar apenas as próprias análises. Esse teste requer o Supabase configurado; testes locais usam o banco, a autenticação e a OpenRouter simulados e não consomem cota.
