import './globals.css';

export const metadata = {
  title: 'Power Girls',
  description: 'Seu espaço para transformar ideias em possibilidades.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
