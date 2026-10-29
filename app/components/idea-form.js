'use client';

import { useState } from 'react';
import { desafio } from '../../desafio';
import ArrowIcon from './arrow-icon';
import ResponseField from './response-field';

export default function IdeaForm() {
  const [valores, setValores] = useState({});
  const [resposta, setResposta] = useState('');
  const [erro, setErro] = useState('');
  const [avisoHistorico, setAvisoHistorico] = useState('');
  const [analisando, setAnalisando] = useState(false);

  async function analisar(evento) {
    evento.preventDefault();
    if (analisando) return;
    setAnalisando(true);
    setErro('');
    setAvisoHistorico('');
    setResposta('');
    try {
      const resultado = await fetch('/api/ia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(desafio.campos.map(({ id }) => [id, valores[id] || '']))),
        signal: AbortSignal.timeout(65000),
      });
      const texto = await resultado.text();
      if (!resultado.ok) {
        setErro(resultado.status === 429 ? 'Você atingiu o limite de uso de hoje.'
          : resultado.status === 401 ? texto || 'Chave da IA inválida.'
          : texto || 'Não foi possível analisar suas respostas. Tente novamente.');
        return;
      }
      setResposta(texto);
      if (resultado.headers.get('X-History-Saved') === 'false') {
        setAvisoHistorico('Sua análise foi concluída, mas não foi salva no histórico. Verifique a configuração do banco de dados.');
      }
    } catch {
      setErro('Não foi possível conectar à análise. Verifique sua conexão e tente novamente.');
    } finally {
      setAnalisando(false);
    }
  }

  const preenchidos = desafio.campos.filter(({ id }) => valores[id]?.trim()).length;
  const exemplos = {
    vaga: 'Cole a descrição da vaga que você quer conquistar...',
    resposta1: 'Conte um pouco sobre você, seus interesses e o que gosta de aprender...',
    resposta2: 'O que chamou sua atenção nessa oportunidade?',
    resposta3: 'Pode ser uma situação na escola, em casa ou em uma atividade em grupo...',
  };

  return (
    <main className="workspace">
      <section className="workspace-intro" aria-labelledby="titulo-treino">
        <div><span className="etiqueta">PREPARE O SEU PRÓXIMO PASSO</span>
          <h1 id="titulo-treino">{desafio.nome}<span className="ponto-titulo">.</span></h1>
          <p className="descricao">{desafio.subtitulo}</p>
        </div>
        <span className="selo-ritmo"><span aria-hidden="true">✦</span> No seu ritmo. Com a sua voz.</span>
      </section>
      <div className="treino-layout">
        <section className="cartao formulario-treino" aria-labelledby="titulo-formulario">
          <div className="cabecalho-cartao"><div><span className="etiqueta">01 / SEU MOMENTO</span>
            <h2 id="titulo-formulario">Vamos conhecer sua história</h2></div>
            <span className="contador-campos">{preenchidos} de {desafio.campos.length} campos</span>
          </div>
          <p className="ajuda-formulario">Não precisa ter experiência profissional. O que você viveu também tem valor.</p>
          <p className="ajuda-cronometro">O tempo começa ao selecionar uma resposta e pausa ao sair dela. Ao voltar, continua de onde parou. É só para seu treino: não muda a nota.</p>
          <form onSubmit={analisar} aria-busy={analisando}>
            {desafio.campos.map(({ id, rotulo, linhas }, index) => (
              <ResponseField key={id} id={id} rotulo={rotulo} linhas={linhas} index={index}
                placeholder={exemplos[id]} value={valores[id] || ''}
                onChange={evento => setValores(atuais => ({ ...atuais, [id]: evento.target.value }))} />
            ))}
            <button className="botao-analisar" type="submit" disabled={analisando}>
              {analisando ? <><span className="spinner" aria-hidden="true" /> Analisando...</> : <>{desafio.botao}<ArrowIcon /></>}
            </button>
            <p className="aviso-desafio"><small>{desafio.aviso}</small></p>
          </form>
          {erro && <p className="erro" role="alert">{erro}</p>}
          {avisoHistorico && <p className="erro" role="alert">{avisoHistorico}</p>}
        </section>
        <aside className="coluna-resultado">
          <section className="cartao resultado" aria-live="polite" aria-busy={analisando} aria-labelledby="titulo-resultado">
            <span className="etiqueta">02 / NOVAS PERSPECTIVAS</span>
            <h2 id="titulo-resultado">Seu próximo passo</h2>
            {resposta ? <p className="texto-resposta">{resposta}</p> : <div className="resultado-vazio">
              <span className="vazio-simbolo" aria-hidden="true">✦</span>
              <h3>{analisando ? 'Analisando...' : 'Um olhar novo para o seu potencial.'}</h3>
              <p>{analisando ? 'Estamos preparando sugestões a partir das suas respostas.' : 'Preencha os campos ao lado. Sua avaliação aparecerá aqui, com sugestões para você seguir em frente.'}</p>
              {!analisando && <ul className="lista-retorno"><li>Uma nota para cada resposta</li><li>Seus pontos positivos</li><li>Sugestões práticas para melhorar</li></ul>}
            </div>}
          </section>
          <div className="nota-incentivo"><ArrowIcon /><p><strong>Confiança se constrói praticando.</strong><br />Um treino de cada vez, um passo mais perto.</p></div>
        </aside>
      </div>
      <footer className="rodape-site">POWER GIRLS <span aria-hidden="true">·</span> Seu futuro merece um começo.</footer>
    </main>
  );
}
