'use client';

import { useActionState } from 'react';
import { requestPasswordReset } from './actions';

export default function ResetRequestForm({ configured }) {
  const [state, action, pending] = useActionState(requestPasswordReset, {});
  return (
    <form action={action} noValidate aria-busy={pending}>
      <label htmlFor="email">E-mail da sua conta</label>
      <input id="email" name="email" type="email" autoComplete="email" required maxLength={254} />
      {!configured && <p className="erro" role="alert">A recuperação de senha ainda não foi configurada.</p>}
      {state.error && <p className="erro" role="alert">{state.error}</p>}
      {state.message && <p className="aviso" role="status">{state.message}</p>}
      <button type="submit" disabled={pending || !configured}>{pending ? 'Enviando...' : 'Enviar link de recuperação'}</button>
    </form>
  );
}
