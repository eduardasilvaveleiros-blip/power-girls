'use server';

import { headers } from 'next/headers';
import { createClient } from '../../lib/supabase/server';
import { authErrorMessage } from '../../lib/supabase/errors';

export async function requestPasswordReset(_previousState, formData) {
  const email = String(formData.get('email') || '').trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return { error: 'Informe um e-mail válido.' };
  }
  try {
    const supabase = await createClient();
    if (!supabase) return { error: 'A recuperação de senha ainda não foi configurada.' };
    // Server Actions validate Origin against the host before running this action.
    const origin = (await headers()).get('origin');
    const callback = new URL('/auth/callback', origin);
    if (!['https:', 'http:'].includes(callback.protocol)) throw new Error('Invalid origin');
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: callback.toString() });
    if (error) return { error: authErrorMessage(error) };
    return { message: 'Se este e-mail estiver cadastrado, você receberá um link para criar uma nova senha. Confira também a pasta de spam. Abra o link neste mesmo navegador.' };
  } catch {
    return { error: 'Não foi possível enviar o link agora. Tente novamente em alguns instantes.' };
  }
}
