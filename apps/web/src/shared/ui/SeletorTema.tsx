import { useState } from 'react';
import { aplicarTema, lerTemaSalvo, salvarTema, type Tema } from '../lib/tema';
import { IconeAutomatico, IconeLua, IconeSol } from './IconesTema';
import estilos from './SeletorTema.module.css';

interface OpcaoTema {
  readonly tema: Tema;
  readonly rotulo: string;
  readonly Icone: () => React.JSX.Element;
}

const OPCOES: readonly OpcaoTema[] = [
  { tema: 'automatico', rotulo: 'Automático (segue o sistema)', Icone: IconeAutomatico },
  { tema: 'claro', rotulo: 'Claro', Icone: IconeSol },
  { tema: 'escuro', rotulo: 'Escuro', Icone: IconeLua },
];

export function SeletorTema() {
  const [temaAtual, setTemaAtual] = useState<Tema>(lerTemaSalvo);

  function escolher(tema: Tema) {
    setTemaAtual(tema);
    aplicarTema(tema, document.documentElement);
    salvarTema(tema);
  }

  return (
    <div className={estilos.grupo} role="group" aria-label="Tema da página">
      {OPCOES.map(({ tema, rotulo, Icone }) => {
        const ativa = tema === temaAtual;
        return (
          <button
            key={tema}
            type="button"
            className={ativa ? `${estilos.opcao} ${estilos.ativa}` : estilos.opcao}
            aria-pressed={ativa}
            aria-label={rotulo}
            title={rotulo}
            onClick={() => escolher(tema)}
          >
            <Icone />
          </button>
        );
      })}
    </div>
  );
}
