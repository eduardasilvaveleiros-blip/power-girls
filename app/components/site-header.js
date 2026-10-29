import Link from 'next/link';
import Brand from './brand';
import SignOutButton from './sign-out-button';

export default function SiteHeader({ email, history = false }) {
  return (
    <header className="topo">
      <div className="topo-interior">
        <Brand />
        <nav className="acoes-topo" aria-label="Navegação da conta">
          <Link href="/" aria-current={!history ? 'page' : undefined}>Treinar entrevista</Link>
          <Link href="/historico" aria-current={history ? 'page' : undefined}>Meu histórico</Link>
        </nav>
        <div className="conta-topo"><span className="avatar" aria-hidden="true">{email?.slice(0, 1).toUpperCase()}</span><span className="email-usuario">{email}</span><SignOutButton /></div>
      </div>
    </header>
  );
}
