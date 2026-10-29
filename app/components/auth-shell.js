import Brand from './brand';

export default function AuthShell({ children }) {
  return (
    <main className="acesso-pagina">
      <aside className="acesso-editorial" aria-label="Sobre o Power Girls">
        <Brand />
        <div className="acesso-mensagem">
          <span className="etiqueta">SEU FUTURO, DO SEU JEITO</span>
          <h2>Grandes começos.<br />{' '}<em>Do seu jeito.</em></h2>
          <p>Você tem uma história para contar. Vamos ajudar a transformar suas experiências em confiança para a próxima entrevista.</p>
          <div className="acesso-ilustracao" aria-hidden="true">
            <div className="orbita orbita-um" /><div className="orbita orbita-dois" />
            <span className="estrela-grande">✦</span><span className="estrela-pequena">✦</span>
            <div className="bilhete"><span>UM LEMBRETE PARA VOCÊ</span><strong>Sua história<br />tem valor.</strong><i>O próximo passo começa aqui.</i></div>
          </div>
        </div>
        <p className="acesso-rodape">Pratique. Descubra seu potencial. Siga em frente.</p>
      </aside>
      <div className="acesso-conteudo"><div className="acesso-formulario">{children}</div></div>
    </main>
  );
}
