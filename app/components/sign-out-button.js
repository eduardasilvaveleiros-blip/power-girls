'use client';

import { useActionState } from 'react';
import { signOut } from '../login/actions';

export default function SignOutButton() {
  const [state, action, pending] = useActionState(signOut, {});
  return (
    <form action={action}>
      <button type="submit" disabled={pending}>{pending ? 'Saindo...' : 'Sair'}</button>
      {state?.error && <p role="alert" className="erro">{state.error}</p>}
    </form>
  );
}
