import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import { getSupabaseConfig } from './lib/supabase/config';

export async function middleware(request) {
  let response = NextResponse.next({ request });
  const config = getSupabaseConfig();
  let user = null;
  if (config) {
    try {
      const supabase = createServerClient(config.url, config.key, {
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            response = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
          },
        },
      });
      const { data, error } = await supabase.auth.getUser();
      if (!error) user = data.user;
    } catch {
      // Fail closed: auth failures never expose the protected page.
    }
  }
  const destination = !user && request.nextUrl.pathname === '/' ? '/login'
    : user && request.nextUrl.pathname === '/login' ? '/' : null;
  if (destination) {
    const url = request.nextUrl.clone();
    url.pathname = destination;
    url.search = '';
    const redirectResponse = NextResponse.redirect(url);
    response.cookies.getAll().forEach(cookie => redirectResponse.cookies.set(cookie));
    redirectResponse.headers.set('Cache-Control', 'private, no-store');
    return redirectResponse;
  }
  response.headers.set('Cache-Control', 'private, no-store');
  return response;
}

export const config = { matcher: ['/', '/login'] };
