import Link from 'next/link';

export default function Brand() {
  return (
    <Link href="/" className="marca" aria-label="Power Girls — início">
      <span className="marca-simbolo" aria-hidden="true">
        <svg viewBox="0 0 32 32" fill="none"><path d="M16 3c0 8-5 13-13 13 8 0 13 5 13 13 0-8 5-13 13-13C21 16 16 11 16 3Z" fill="currentColor" /></svg>
      </span>
      <span>power<span className="marca-leve">girls</span><span className="marca-ponto">.</span></span>
    </Link>
  );
}
