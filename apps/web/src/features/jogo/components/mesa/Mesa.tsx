import { PECAS } from '../../data/pecas';
import { PORTAS } from '../../data/portas';
import { DESENHOS_PECAS } from '../pecas/desenhos';
import { Gabinete } from './Gabinete';
import {
  ALTURA_MESA,
  ANCORA_CABO,
  AREA_PECAS,
  ladoDoPlugue,
  LARGURA_MESA,
  POSICAO_PECAS,
  POSICAO_PORTAS,
} from './geometria';
import { PortaSvg } from './portas/PortaSvg';
import type { EstadoPorta } from './portas/PortaSvg';
import { PlugueSvg } from './plugues/PlugueSvg';
import estilos from './Mesa.module.css';
import type { IdPeca, IdPorta, TipoPorta } from '../../model/tipos';

interface MesaProps {
  readonly pecaAlvo: IdPeca | null;
  readonly pecasLigadas: readonly IdPeca[];
  readonly conexoes: Partial<Record<IdPeca, IdPorta>>;
  readonly estadoPortas: Partial<Record<IdPorta, EstadoPorta>>;
  readonly mostrarRotulos: boolean;
  readonly aoEscolherPorta?: (portaId: IdPorta) => void;
}

function rotuloPorta(tipo: TipoPorta, posicao: number): string {
  if (tipo === 'usb') return `Porta USB ${posicao}`;
  if (tipo === 'hdmi') return 'Porta HDMI';
  if (tipo === 'saidaAudio') return `Porta de áudio ${posicao}`;
  return 'Porta de microfone';
}

export function Mesa({
  pecaAlvo,
  pecasLigadas,
  conexoes,
  estadoPortas,
  mostrarRotulos,
  aoEscolherPorta,
}: MesaProps) {
  return (
    <svg
      className={estilos.mesa}
      viewBox={`0 0 ${LARGURA_MESA} ${ALTURA_MESA}`}
      role={aoEscolherPorta ? 'group' : 'img'}
      aria-label="Computador com portas e peças para ligar"
    >
      <rect width={LARGURA_MESA} height={ALTURA_MESA} rx="20" fill="var(--cor-mesa)" />
      <Gabinete />
      {PORTAS.map((porta) => (
        <PortaSvg
          key={porta.id}
          id={porta.id}
          tipo={porta.tipo}
          estado={estadoPortas[porta.id] ?? 'livre'}
          mostrarRotulo={mostrarRotulos}
        />
      ))}
      {PECAS.map((peca) => {
        const { Desenho } = DESENHOS_PECAS[peca.id];
        const { x, y } = POSICAO_PECAS[peca.id];
        const area = AREA_PECAS[peca.id];
        const estado =
          pecaAlvo === peca.id
            ? estilos.alvo
            : pecasLigadas.includes(peca.id)
              ? estilos.ligada
              : estilos.apagada;

        return (
          <g key={peca.id} data-peca={peca.id} className={`${estilos.peca} ${estado}`}>
            <g transform={`translate(${x} ${y})`} filter="url(#iq-sombra)">
              <Desenho />
            </g>
            <rect
              x={area.x}
              y={area.y}
              width={area.largura}
              height={area.altura}
              fill="transparent"
            />
          </g>
        );
      })}
      <g id="iq-cabos" className={estilos.semPonteiro} />
      <g className={estilos.semPonteiro}>
        {PECAS.map((peca) => {
          const portaId = conexoes[peca.id];
          const ancora = ANCORA_CABO[peca.id];
          const posicaoPorta = portaId ? POSICAO_PORTAS[portaId] : null;
          const [x, y] = posicaoPorta?.entrada ?? ancora;
          const lado = posicaoPorta?.lado ?? ladoDoPlugue(ancora[0]);

          return <PlugueSvg key={peca.id} tipo={peca.tipoPorta} x={x} y={y} lado={lado} />;
        })}
      </g>
      {aoEscolherPorta && (
        <>
          {/* Toque provisório até o passo de conectar pelo cabo. */}
          {PORTAS.map((porta) => {
            const [cx, cy] = POSICAO_PORTAS[porta.id].centro;
            const posicao =
              PORTAS.filter((item) => item.tipo === porta.tipo).findIndex(
                (item) => item.id === porta.id,
              ) + 1;
            return (
              <g
                key={porta.id}
                role="button"
                tabIndex={0}
                aria-label={rotuloPorta(porta.tipo, posicao)}
                className={estilos.alvoToque}
                onClick={() => aoEscolherPorta(porta.id)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    aoEscolherPorta(porta.id);
                  }
                }}
              >
                {porta.tipo === 'saidaAudio' || porta.tipo === 'microfone' ? (
                  <circle className={estilos.zonaToque} cx={cx} cy={cy} r="24" />
                ) : (
                  <rect
                    className={estilos.zonaToque}
                    x={cx - 28}
                    y={cy - 16}
                    width="56"
                    height="32"
                    rx="6"
                  />
                )}
              </g>
            );
          })}
        </>
      )}
      <circle
        id="iq-ponto"
        className={estilos.semPonteiro}
        r="9"
        cx="-50"
        cy="-50"
        fill="#FFC93C"
        stroke="#1b2250"
        strokeWidth="3"
      />
    </svg>
  );
}
