import { redirect } from 'next/navigation';
import { getUser } from '../lib/supabase/server';
import IdeaForm from './components/idea-form';
import SignOutButton from './components/sign-out-button';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const user = await getUser();
  if (!user) redirect('/login');
  return (
    <>
      <header className="topo">
        <span className="email-usuario">{user.email}</span>
        <nav className="acoes-topo" aria-label="Navegação da conta">
          <Link href="/historico">Meu histórico</Link>
          <SignOutButton />
        </nav>
      </header>
      <IdeaForm />
    </>
  );
}
