import Link from 'next/link';
import { getSupabaseConfig } from '../../lib/supabase/config';
import ResetRequestForm from './reset-request-form';
import AuthShell from '../components/auth-shell';

export const metadata = { title: 'Recuperar senha | Power Girls' };
export const dynamic = 'force-dynamic';

export default async function ForgotPasswordPage({ searchParams }) {
  const params = await searchParams;
  return (
    <AuthShell>
        <span className="etiqueta">VAMOS RECOMEÇAR</span>
        <h1>Esqueci minha senha</h1>
        <p className="descricao">Informe seu e-mail para receber um link de recuperação. Abra o link neste mesmo navegador.</p>
        {params?.erro === 'link' && <p className="erro" role="alert">Este link é inválido ou expirou. Solicite um novo link abaixo.</p>}
        <ResetRequestForm configured={Boolean(getSupabaseConfig())} />
        <p><Link href="/login">Voltar para o login</Link></p>
    </AuthShell>
  );
}
