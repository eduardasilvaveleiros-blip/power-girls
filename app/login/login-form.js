'use client';

import { useActionState, useState } from 'react';
import { authenticate } from './actions';
import Link from 'next/link';

export default function LoginForm({ configured }) {
  const [state, formAction, pending] = useActionState(authenticate, {});
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  return (
    <form action={formAction} aria-busy={pending}>
      <label htmlFor="email">E-mail</label>
      <input id="email" name="email" type="email" autoComplete="email" autoCapitalize="none" spellCheck={false}
        placeholder="seunome@exemplo.com" required maxLength={254}
        value={email} onChange={event => setEmail(event.target.value)}
        onBlur={event => setEmail(event.currentTarget.value.trim())}
        aria-invalid={state.field === 'email' || undefined}
        aria-describedby={state.field === 'email' ? 'login-error' : undefined} />
      <div className="rotulo-senha"><label htmlFor="password">Senha</label><Link href="/esqueci-senha">Esqueci minha senha</Link></div>
      <div className="campo-senha">
      <input id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required
        value={password} onChange={event => setPassword(event.target.value)}
        aria-invalid={state.field === 'password' || undefined}
        aria-describedby={state.field === 'password' ? 'login-error' : undefined} />
      <button type="button" className="mostrar-senha" aria-controls="password" aria-pressed={showPassword}
        onClick={() => setShowPassword(value => !value)}>{showPassword ? 'Ocultar senha' : 'Mostrar senha'}</button>
      </div>
      {!configured && <p role="alert" className="erro">O login ainda não foi configurado. Configure as variáveis públicas do Supabase.</p>}
      {state.error && <p id="login-error" role="alert" className="erro">{state.error}</p>}
      {state.message && <p role="status" className="aviso">{state.message}</p>}
      <div className="acoes-login" aria-busy={pending}>
        <button type="submit" name="intent" value="login" disabled={pending || !configured}>Entrar</button>
        <button type="submit" name="intent" value="signup" className="secundario" disabled={pending || !configured}>Criar conta</button>
      </div>
      {pending && <p role="status">Aguarde...</p>}
    </form>
  );
}
