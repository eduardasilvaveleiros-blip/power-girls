import { redirect } from 'next/navigation';
import { getUser } from '../../lib/supabase/server';
import { getSupabaseConfig } from '../../lib/supabase/config';
import LoginForm from './login-form';

export const metadata = { title: 'Entrar | Power Girls' };
export const dynamic = 'force-dynamic';

export default async function LoginPage() {
  if (await getUser()) redirect('/');
  return (
    <main className="pagina">
      <section className="cartao">
        <span className="etiqueta">POWER GIRLS ✨</span>
        <h1>Bem-vinda!</h1>
        <p className="descricao">Entre ou crie sua conta para dar vida às suas ideias.</p>
        <LoginForm configured={Boolean(getSupabaseConfig())} />
      </section>
    </main>
  );
}
