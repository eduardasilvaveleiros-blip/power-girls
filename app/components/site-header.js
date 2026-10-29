import Link from 'next/link';
import Brand from './brand';
import SignOutButton from './sign-out-button';

export default function SiteHeader({ email, history = false, tips = false }) {
  return (
    <header className="topo">
      <div className="topo-interior">
        <Brand />
        <nav className="acoes-topo" aria-label="Navegação da conta">
          <Link href="/" aria-current={!history && !tips ? 'page' : undefined}>Treinar entrevista</Link>
          <Link href="/historico" aria-current={history ? 'page' : undefined}>Meu histórico</Link>
          <Link href="/dicas" aria-current={tips ? 'page' : undefined}>Dicas</Link>
        </nav>
        <div className="conta-topo"><span className="avatar" aria-hidden="true">{email?.slice(0, 1).toUpperCase()}</span><span className="email-usuario">{email}</span><SignOutButton /></div>
      </div>
    </header>
  );
}
