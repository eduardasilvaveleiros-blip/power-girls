import { redirect } from 'next/navigation';
import { getUser } from '../../lib/supabase/server';
import PasswordForm from './password-form';

export const metadata = { title: 'Nova senha | Power Girls' };
export const dynamic = 'force-dynamic';

export default async function ResetPasswordPage() {
  if (!await getUser()) redirect('/esqueci-senha?erro=link');
  return (
    <main className="pagina">
      <section className="cartao">
        <span className="etiqueta">POWER GIRLS ✨</span>
        <h1>Crie uma nova senha</h1>
        <PasswordForm />
      </section>
    </main>
  );
}
