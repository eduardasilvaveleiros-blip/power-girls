'use client';

import { useEffect, useRef, useState } from 'react';

function formatTime(milliseconds) {
  const seconds = Math.floor(milliseconds / 1000);
  return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
}

export default function ResponseField({ id, rotulo, linhas, index, value, onChange, placeholder }) {
  const timed = /^resposta[123]$/.test(id);
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const total = useRef(0);
  const started = useRef(null);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      if (started.current !== null) setElapsed(total.current + performance.now() - started.current);
    }, 250);
    return () => clearInterval(interval);
  }, [running]);

  function start() {
    if (!timed || started.current !== null) return;
    started.current = performance.now();
    setRunning(true);
  }

  function pause() {
    if (started.current === null) return;
    total.current += performance.now() - started.current;
    started.current = null;
    setElapsed(total.current);
    setRunning(false);
  }

  return (
    <div className="campo-desafio">
      <div className="rotulo-resposta">
        <label htmlFor={id}><span className="numero-campo" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>{rotulo}</label>
        {timed && <span className={`cronometro${running ? ' cronometro-ativo' : ''}`} role="timer" aria-live="off" aria-label={`Tempo na resposta ${id.slice(-1)}`}>
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><circle cx="10" cy="11" r="6.5" /><path d="M10 7v4l2 1M7 1.5h6M10 1.5v3" /></svg>
          {formatTime(elapsed)}
        </span>}
      </div>
      <textarea id={id} name={id} rows={linhas} maxLength={10000} placeholder={placeholder}
        value={value} onChange={onChange} onFocus={start} onBlur={pause} />
    </div>
  );
}
