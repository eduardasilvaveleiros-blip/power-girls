import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getUser } from '../../lib/supabase/server';
import { getHistory } from '../../lib/history';
import SiteHeader from '../components/site-header';
import ArrowIcon from '../components/arrow-icon';

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
      <SiteHeader email={user.email} history />
      <main className="pagina historico-pagina">
        <section className="cartao">
          <span className="etiqueta">CADA PASSO CONTA</span>
          <h1>Meu histórico</h1>
          <p className="descricao">Suas análises, da mais recente para a mais antiga. Horários de Brasília.</p>
          {failed ? <p className="erro" role="alert">Não foi possível carregar seu histórico. Verifique a configuração do banco e tente novamente.</p>
            : items.length === 0 ? <div className="historico-vazio"><span className="vazio-simbolo" aria-hidden="true">✦</span><h2>Sua evolução começa com uma tentativa.</h2><p>Você ainda não tem análises salvas. Faça seu primeiro treino e volte para acompanhar sua evolução.</p><Link className="link-botao" href="/">Começar meu treino <ArrowIcon /></Link></div>
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
