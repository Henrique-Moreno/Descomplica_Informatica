import { memo } from 'react';
import { POSICAO_PORTAS } from '../geometria';
import estilos from './PortaSvg.module.css';
import type { IdPorta, TipoPorta } from '../../../model/tipos';

export type EstadoPorta = 'livre' | 'usada' | 'errada' | 'dica';

interface PortaSvgProps {
  readonly id: IdPorta;
  readonly tipo: TipoPorta;
  readonly estado: EstadoPorta;
  readonly mostrarRotulo: boolean;
}

export const PortaSvg = memo(function PortaSvg({ id, tipo, estado, mostrarRotulo }: PortaSvgProps) {
  const [cx, cy] = POSICAO_PORTAS[id].centro;

  return (
    <g transform={`translate(${cx} ${cy})`} data-porta={id} className={estilos.porta}>
      {tipo === 'usb' && (
        <>
          <rect x="-19" y="-8" width="38" height="16" rx="2" fill="#1b2038" />
          <rect x="-15" y="-3" width="30" height="6" fill="#2D4BFF" />
          <rect
            x="-23"
            y="-12"
            width="46"
            height="24"
            rx="5"
            className={`${estilos.contorno} ${estilos[estado]}`}
          />
          {mostrarRotulo && (
            <text className={estilos.rotulo} x="25" y="4" textAnchor="start">
              USB
            </text>
          )}
        </>
      )}
      {tipo === 'hdmi' && (
        <>
          <rect x="-25" y="-9" width="50" height="18" rx="3" fill="#1b2038" />
          <path d="M-20 -4H20V3L16 6H-16L-20 3Z" fill="#0a0d1c" />
          <rect
            x="-29"
            y="-13"
            width="58"
            height="26"
            rx="6"
            className={`${estilos.contorno} ${estilos[estado]}`}
          />
          {mostrarRotulo && (
            <text className={estilos.rotulo} x="-25" y="-12" textAnchor="start">
              HDMI
            </text>
          )}
        </>
      )}
      {tipo === 'saidaAudio' && (
        <>
          <circle r="12" fill="#1b2038" stroke="#34c76a" strokeWidth="4" />
          <circle r="5" fill="#000" />
          <circle r="19" className={`${estilos.contorno} ${estilos[estado]}`} />
          {mostrarRotulo && (
            <text className={estilos.rotulo} x="-26" y="4" textAnchor="end">
              Áudio
            </text>
          )}
        </>
      )}
      {tipo === 'microfone' && (
        <>
          <circle r="12" fill="#1b2038" stroke="#ff5fa8" strokeWidth="4" />
          <circle r="5" fill="#000" />
          <circle r="19" className={`${estilos.contorno} ${estilos[estado]}`} />
          {mostrarRotulo && (
            <text className={estilos.rotulo} x="-26" y="4" textAnchor="end">
              Mic
            </text>
          )}
        </>
      )}
    </g>
  );
});
