'use client';

import { useActionState } from 'react';
import { authenticate } from './actions';

export default function LoginForm({ configured }) {
  const [state, formAction, pending] = useActionState(authenticate, {});
  return (
    <form action={formAction} noValidate>
      <label htmlFor="email">E-mail</label>
      <input id="email" name="email" type="email" autoComplete="email" required maxLength={254} />
      <label htmlFor="password">Senha</label>
      <input id="password" name="password" type="password" autoComplete="current-password" required />
      {!configured && <p role="alert" className="erro">O login ainda não foi configurado. Configure as variáveis públicas do Supabase.</p>}
      {state.error && <p role="alert" className="erro">{state.error}</p>}
      {state.message && <p role="status" className="aviso">{state.message}</p>}
      <div className="acoes-login" aria-busy={pending}>
        <button type="submit" name="intent" value="login" disabled={pending || !configured}>Entrar</button>
        <button type="submit" name="intent" value="signup" className="secundario" disabled={pending || !configured}>Criar conta</button>
      </div>
      {pending && <p role="status">Aguarde...</p>}
    </form>
  );
}
