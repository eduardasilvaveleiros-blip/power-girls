import { redirect } from 'next/navigation';
import { getUser } from '../../lib/supabase/server';
import { getSupabaseConfig } from '../../lib/supabase/config';
import LoginForm from './login-form';
import AuthShell from '../components/auth-shell';

export const metadata = { title: 'Entrar | Power Girls' };
export const dynamic = 'force-dynamic';

export default async function LoginPage() {
  if (await getUser()) redirect('/');
  return (
    <AuthShell>
        <span className="etiqueta">BOM TER VOCÊ AQUI</span>
        <h1>Seu próximo capítulo<br /><em>começa aqui.</em></h1>
        <p className="descricao">Entre ou crie sua conta para treinar sua próxima entrevista.</p>
        <LoginForm configured={Boolean(getSupabaseConfig())} />
        <p className="nota-acesso">Um espaço para praticar, aprender e ganhar confiança.</p>
    </AuthShell>
  );
}
