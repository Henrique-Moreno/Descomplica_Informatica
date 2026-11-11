import { useState } from 'react';
import { aplicarTema, lerTemaSalvo, proximoTema, salvarTema } from '../lib/tema';
import type { Tema } from '../lib/tema';
import estilos from './BotaoTema.module.css';

const ROTULOS_TEMA: Record<Tema, string> = {
  automatico: 'Automático',
  claro: 'Claro',
  escuro: 'Escuro',
};

export function BotaoTema() {
  const [tema, setTema] = useState<Tema>(lerTemaSalvo);
  const proximo = proximoTema(tema);

  function alternarTema() {
    const novoTema = proximoTema(tema);
    setTema(novoTema);
    aplicarTema(novoTema, document.documentElement);
    salvarTema(novoTema);
  }

  return (
    <button
      className={estilos.botao}
      type="button"
      aria-label={`Tema: ${ROTULOS_TEMA[tema]}. Trocar para ${ROTULOS_TEMA[proximo]}`}
      onClick={alternarTema}
    >
      <svg className={estilos.icone} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        {tema === 'automatico' && (
          <>
            <circle cx="12" cy="12" r="9" className={estilos.contorno} />
            <path d="M12 3a9 9 0 0 0 0 18V3Z" fill="currentColor" />
            <path d="M12 3v18" className={estilos.contorno} />
            <path d="M5 8 3.5 7M4 12H2M5 16l-1.5 1" className={estilos.raio} />
          </>
        )}
        {tema === 'claro' && (
          <>
            <circle cx="12" cy="12" r="4" className={estilos.contorno} />
            <path
              d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"
              className={estilos.raio}
            />
          </>
        )}
        {tema === 'escuro' && (
          <path
            d="M20.5 15.5A8.5 8.5 0 0 1 8.5 3.5 8.5 8.5 0 1 0 20.5 15.5Z"
            className={estilos.lua}
          />
        )}
      </svg>
    </button>
  );
}
