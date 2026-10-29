'use server';

import { redirect } from 'next/navigation';
import { createClient } from '../../lib/supabase/server';
import { authErrorMessage, logAuthFailure } from '../../lib/supabase/errors';

export async function authenticate(_previousState, formData) {
  const email = String(formData.get('email') || '').trim();
  const password = String(formData.get('password') || '');
  const intent = formData.get('intent');
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return { error: 'Informe um e-mail completo, como seunome@exemplo.com.', field: 'email' };
  }
  if (!password) return { error: 'Informe sua senha.', field: 'password' };
  if (intent !== 'login' && intent !== 'signup') return { error: 'Escolha Entrar ou Criar conta.' };
  if (intent === 'signup' && password.length < 6) return { error: 'A senha deve ter pelo menos 6 caracteres.' };
  try {
    const supabase = await createClient();
    if (!supabase) return { error: 'O login ainda não foi configurado. Configure as variáveis públicas do Supabase.' };
    const { data, error } = intent === 'signup'
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      logAuthFailure(intent, error);
      return { error: authErrorMessage(error) };
    }
    if (!data?.session) {
      if (intent === 'signup') return { message: 'Verifique seu e-mail para confirmar o cadastro. Depois, entre com seu e-mail e senha.' };
      logAuthFailure(intent, { code: 'session_missing' });
      return { error: 'Não foi possível iniciar sua sessão. Tente entrar novamente.' };
    }
  } catch {
    return { error: 'Não foi possível conectar ao serviço de login. Tente novamente em alguns instantes.' };
  }
  redirect('/');
}

export async function signOut() {
  try {
    const supabase = await createClient();
    if (supabase) {
      const { error } = await supabase.auth.signOut();
      if (error) return { error: 'Não foi possível sair. Tente novamente.' };
    }
  } catch {
    return { error: 'Não foi possível conectar ao serviço para sair. Tente novamente.' };
  }
  redirect('/login');
}
