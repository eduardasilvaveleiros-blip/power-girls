import { redirect } from 'next/navigation';
import { getUser } from '../lib/supabase/server';
import IdeaForm from './components/idea-form';
import SiteHeader from './components/site-header';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const user = await getUser();
  if (!user) redirect('/login');
  return (
    <>
      <SiteHeader email={user.email} />
      <IdeaForm />
    </>
  );
}
