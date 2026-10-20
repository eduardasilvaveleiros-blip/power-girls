'use client';

import { useState } from 'react';

export default function IdeaForm() {
  const [texto, setTexto] = useState('');
  const [resposta, setResposta] = useState('');

  function analisar(evento) {
    evento.preventDefault();
    setResposta(texto);
  }

  return (
    <main className="pagina">
      <section className="cartao">
        <span className="etiqueta">POWER GIRLS ✨</span>
        <h1>Suas ideias têm poder.</h1>
        <p className="descricao">Escreva o que está pensando e dê o primeiro passo para transformar suas ideias em realidade.</p>

        <form onSubmit={analisar}>
          <label htmlFor="mensagem">O que você gostaria de analisar?</label>
          <textarea
            id="mensagem"
            value={texto}
            onChange={(evento) => setTexto(evento.target.value)}
            placeholder="Digite sua ideia aqui..."
            rows={5}
          />
          <button type="submit">Analisar</button>
        </form>

        <section className="resultado" aria-live="polite">
          <h2>Resultado</h2>
          <p>{resposta || 'Sua resposta aparecerá aqui.'}</p>
        </section>
      </section>
    </main>
  );
}
