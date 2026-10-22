import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getUser } from '../../lib/supabase/server';
import { getHistory } from '../../lib/history';
import SignOutButton from '../components/sign-out-button';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Meu histórico | Power Girls' };

export default async function HistoryPage() {
  const user = await getUser();
  if (!user) redirect('/login');
  let items = [];
  let failed = false;
  try {
    items = await getHistory(user.id);
  } catch {
    failed = true;
  }
  const date = new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short', timeStyle: 'short', timeZone: 'America/Sao_Paulo',
  });
  return (
    <>
      <header className="topo">
        <span className="email-usuario">{user.email}</span>
        <nav className="acoes-topo" aria-label="Navegação da conta">
          <Link href="/">Nova análise</Link>
          <SignOutButton />
        </nav>
      </header>
      <main className="pagina">
        <section className="cartao">
          <h1>Meu histórico</h1>
          <p className="descricao">Suas análises, da mais recente para a mais antiga. Horários de Brasília.</p>
          {failed ? <p className="erro" role="alert">Não foi possível carregar seu histórico. Verifique a configuração do banco e tente novamente.</p>
            : items.length === 0 ? <p>Você ainda não tem análises salvas.</p>
            : items.map(item => (
              <article className="resultado" key={item.id}>
                <h2><time dateTime={item.criado_em}>{date.format(new Date(item.criado_em))}</time></h2>
                <h3>O que você escreveu</h3>
                <p>{item.entrada}</p>
                <h3>Avaliação</h3>
                <p>{item.resposta}</p>
              </article>
            ))}
        </section>
      </main>
    </>
  );
}
