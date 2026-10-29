import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getUser } from '../../lib/supabase/server';
import SiteHeader from '../components/site-header';
import ArrowIcon from '../components/arrow-icon';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Dicas para a primeira entrevista | Power Girls' };

const dicas = [
  { titulo: 'O que vestir', texto: 'Escolha uma roupa limpa, confortável e adequada ao lugar. Não precisa comprar nada novo: prefira peças que deixem você à vontade.' },
  { titulo: 'Chegue um pouco antes', texto: 'Planeje o trajeto para chegar de 10 a 15 minutos antes. Se for uma entrevista online, teste a internet, a câmera e o áudio com antecedência.' },
  { titulo: 'O que levar', texto: 'Confira o que a empresa pediu. Leve seu currículo atualizado, uma caneta e as informações de contato e endereço da entrevista. Tenha um documento se for solicitado.' },
  { titulo: 'Como se apresentar', texto: 'Diga seu nome, o que estuda e por que se interessou pela vaga. Use exemplos reais da escola, de projetos ou de tarefas do dia a dia. Não invente experiências.' },
  { titulo: 'O que perguntar no final', texto: 'Você pode perguntar: “Como é a rotina de quem ocupa essa vaga?”, “Há treinamento para quem está começando?” ou “Quais são as próximas etapas?”' },
  { titulo: 'O que fazer depois', texto: 'Agradeça pela conversa, anote o que aprendeu e confira o prazo de retorno combinado. Se o prazo passar, envie uma mensagem breve e educada perguntando sobre o processo.' },
];

export default async function TipsPage() {
  const user = await getUser();
  if (!user) redirect('/login');
  return (
    <>
      <SiteHeader email={user.email} tips />
      <main className="workspace dicas-pagina">
        <section className="workspace-intro" aria-labelledby="titulo-dicas">
          <div><span className="etiqueta">PEQUENOS CUIDADOS, MAIS CONFIANÇA</span>
            <h1 id="titulo-dicas">Sua primeira entrevista<span className="ponto-titulo">.</span></h1>
            <p className="descricao">Seis dicas para chegar mais preparada à entrevista de jovem aprendiz.</p>
          </div>
        </section>
        <div className="dicas-grid">
          {dicas.map(({ titulo, texto }, index) => (
            <section className="cartao dica-cartao" key={titulo}>
              <span className="numero-dica" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              <h2>{titulo}</h2><p>{texto}</p>
            </section>
          ))}
        </div>
        <div className="dicas-convite"><div><h2>Agora é sua vez de praticar.</h2><p>Treine suas respostas com calma. Você não precisa ter tudo pronto para começar.</p></div>
          <Link className="link-botao" href="/">Treinar minha entrevista <ArrowIcon /></Link>
        </div>
        <footer className="rodape-site">POWER GIRLS <span aria-hidden="true">·</span> Um passo de cada vez.</footer>
      </main>
    </>
  );
}
