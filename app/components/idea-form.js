'use client';

import { useState } from 'react';
import { desafio } from '../../desafio';

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

  return (
    <main className="pagina">
      <section className="cartao">
        <span className="etiqueta">POWER GIRLS ✨</span>
        <h1>{desafio.nome}</h1>
        <p className="descricao">{desafio.subtitulo}</p>
        <form onSubmit={analisar} aria-busy={analisando}>
          {desafio.campos.map(({ id, rotulo, linhas }) => (
            <div className="campo-desafio" key={id}>
              <label htmlFor={id}>{rotulo}</label>
              <textarea id={id} name={id} rows={linhas} maxLength={10000}
                value={valores[id] || ''}
                onChange={evento => setValores(atuais => ({ ...atuais, [id]: evento.target.value }))} />
            </div>
          ))}
          <button type="submit" disabled={analisando}>
            {analisando ? 'Analisando...' : desafio.botao}
          </button>
          <p className="aviso-desafio"><small>{desafio.aviso}</small></p>
        </form>
        {erro && <p className="erro" role="alert">{erro}</p>}
        {avisoHistorico && <p className="erro" role="alert">{avisoHistorico}</p>}
        <section className="resultado" aria-live="polite" aria-busy={analisando}>
          <h2>Resultado</h2>
          <p>{analisando ? 'Analisando...' : resposta || 'Sua resposta aparecerá aqui.'}</p>
        </section>
      </section>
    </main>
  );
}
