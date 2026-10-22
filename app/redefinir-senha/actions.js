'use server';

import { createClient } from '../../lib/supabase/server';
import { authErrorMessage } from '../../lib/supabase/errors';

export async function updatePassword(_previousState, formData) {
  const password = String(formData.get('password') || '');
  const confirmation = String(formData.get('confirmation') || '');
  if (password.length < 6) return { error: 'A senha deve ter pelo menos 6 caracteres.' };
  if (password !== confirmation) return { error: 'As senhas não coincidem. Digite novamente.' };
  try {
    const supabase = await createClient();
    if (!supabase) return { error: 'A recuperação de senha ainda não foi configurada.' };
    const { data, error: sessionError } = await supabase.auth.getUser();
    if (sessionError || !data?.user) return { error: 'Sua sessão expirou. Solicite um novo link de recuperação.' };
    const { error } = await supabase.auth.updateUser({ password });
    if (error) return { error: authErrorMessage(error) };
    return { message: 'Sua senha foi alterada! Você já pode entrar no site.' };
  } catch {
    return { error: 'Não foi possível alterar sua senha agora. Tente novamente em alguns instantes.' };
  }
}
