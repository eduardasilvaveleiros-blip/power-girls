'use client';

import { useState } from 'react';

export default function ResultActions({ text }) {
  const [message, setMessage] = useState('');
  const [copying, setCopying] = useState(false);

  async function copy() {
    setMessage('');
    setCopying(true);
    try {
      await navigator.clipboard.writeText(text);
      setMessage('Avaliação copiada! Agora você pode colar onde quiser.');
    } catch {
      setMessage('Não foi possível copiar automaticamente. Selecione o texto da avaliação e copie manualmente.');
    } finally {
      setCopying(false);
    }
  }

  return (
    <div className="acoes-avaliacao">
      <div className="botoes-avaliacao">
        <button type="button" className="secundario" onClick={copy} disabled={copying}>{copying ? 'Copiando...' : 'Copiar avaliação'}</button>
        <button type="button" className="secundario" onClick={() => window.print()}>Imprimir</button>
      </div>
      <p className="aviso-copia" role="status">{message}</p>
    </div>
  );
}
