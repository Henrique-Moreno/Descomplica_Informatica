import { useState } from 'react';
import estilos from './TelaInicio.module.css';

interface TelaInicioProps {
  readonly onIniciar: (rotulosNasPortas: boolean) => void;
}

export function TelaInicio({ onIniciar }: TelaInicioProps) {
  const [rotulosNasPortas, setRotulosNasPortas] = useState(true);

  return (
    <section className={estilos.cartao} aria-labelledby="titulo-inicio">
      <h2 id="titulo-inicio">Vamos ligar o computador!</h2>
      <ol className={estilos.passos}>
        <li>Descubra que peça aparece na tela.</li>
        <li>Puxe o cabo dela até a porta certa do computador.</li>
      </ol>
      <fieldset className={estilos.escolha}>
        <legend>Como quer ver as portas?</legend>
        <div className={estilos.opcoes}>
          <button
            type="button"
            aria-pressed={rotulosNasPortas}
            className={rotulosNasPortas ? estilos.selecionada : ''}
            onClick={() => setRotulosNasPortas(true)}
          >
            Portas com nome
          </button>
          <button
            type="button"
            aria-pressed={!rotulosNasPortas}
            className={!rotulosNasPortas ? estilos.selecionada : ''}
            onClick={() => setRotulosNasPortas(false)}
          >
            Portas sem nome
          </button>
        </div>
      </fieldset>
      <button className={estilos.comecar} type="button" onClick={() => onIniciar(rotulosNasPortas)}>
        Começar
      </button>
    </section>
  );
}
