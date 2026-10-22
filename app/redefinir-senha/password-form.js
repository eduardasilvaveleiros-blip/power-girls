'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { updatePassword } from './actions';

export default function PasswordForm() {
  const [state, action, pending] = useActionState(updatePassword, {});
  if (state.message) return <><p className="aviso" role="status">{state.message}</p><Link href="/">Entrar no site</Link></>;
  return (
    <form action={action} noValidate aria-busy={pending}>
      <label htmlFor="password">Nova senha</label>
      <input id="password" name="password" type="password" autoComplete="new-password" minLength={6} required aria-describedby="senha-ajuda" />
      <p id="senha-ajuda">Use pelo menos 6 caracteres.</p>
      <label htmlFor="confirmation">Confirme a nova senha</label>
      <input id="confirmation" name="confirmation" type="password" autoComplete="new-password" minLength={6} required />
      {state.error && <p className="erro" role="alert">{state.error}</p>}
      <button type="submit" disabled={pending}>{pending ? 'Salvando...' : 'Salvar nova senha'}</button>
      <p><Link href="/esqueci-senha">Solicitar outro link de recuperação</Link></p>
    </form>
  );
}
