import { createClient } from '../../../lib/supabase/server';

function redirectTo(request, path) {
  return new Response(null, {
    status: 303,
    headers: { Location: new URL(path, request.url).toString(), 'Cache-Control': 'private, no-store', 'Referrer-Policy': 'no-referrer' },
  });
}

export async function GET(request) {
  const code = new URL(request.url).searchParams.get('code');
  if (code) {
    try {
      const supabase = await createClient();
      if (supabase) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) return redirectTo(request, '/redefinir-senha');
      }
    } catch {
      // Invalid or expired links must never grant access to a password update.
    }
  }
  return redirectTo(request, '/esqueci-senha?erro=link');
}
