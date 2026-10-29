import { redirect } from 'next/navigation';
import { getUser } from '../../lib/supabase/server';
import PasswordForm from './password-form';
import AuthShell from '../components/auth-shell';

export const metadata = { title: 'Nova senha | Power Girls' };
export const dynamic = 'force-dynamic';

export default async function ResetPasswordPage() {
  if (!await getUser()) redirect('/esqueci-senha?erro=link');
  return (
    <AuthShell>
        <span className="etiqueta">UM NOVO COMEÇO</span>
        <h1>Crie uma nova senha</h1>
        <PasswordForm />
    </AuthShell>
  );
}
