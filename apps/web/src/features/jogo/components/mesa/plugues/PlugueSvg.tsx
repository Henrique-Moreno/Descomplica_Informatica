import { memo } from 'react';
import type { TipoPorta } from '../../../model/tipos';

interface PlugueSvgProps {
  readonly tipo: TipoPorta;
  readonly x: number;
  readonly y: number;
  readonly lado: 1 | -1;
}

export const PlugueSvg = memo(function PlugueSvg({ tipo, x, y, lado }: PlugueSvgProps) {
  return (
    <g transform={`translate(${x} ${y}) scale(${lado} 1)`} style={{ pointerEvents: 'none' }}>
      {tipo === 'usb' && (
        <>
          <rect x="0" y="-5" width="10" height="10" rx="3" fill="#1b2038" />
          <rect
            x="8"
            y="-8"
            width="18"
            height="16"
            rx="3"
            fill="url(#iq-escuro)"
            stroke="#0e1226"
            strokeWidth="1.5"
          />
          <rect
            x="26"
            y="-6.5"
            width="14"
            height="13"
            rx="1.5"
            fill="url(#iq-metal)"
            stroke="#7d87a3"
            strokeWidth="1.5"
          />
          <rect x="31" y="-2" width="7" height="4" fill="#1b2038" />
        </>
      )}
      {tipo === 'hdmi' && (
        <>
          <rect x="0" y="-5" width="10" height="10" rx="3" fill="#1b2038" />
          <rect
            x="8"
            y="-9"
            width="20"
            height="18"
            rx="3"
            fill="url(#iq-escuro)"
            stroke="#0e1226"
            strokeWidth="1.5"
          />
          <path
            d="M28 -7H40V3L37 7H31L28 3Z"
            fill="url(#iq-metal)"
            stroke="#7d87a3"
            strokeWidth="1.5"
          />
        </>
      )}
      {(tipo === 'saidaAudio' || tipo === 'microfone') && (
        <>
          <rect x="0" y="-4" width="10" height="8" rx="3" fill="#1b2038" />
          <rect
            x="8"
            y="-6"
            width="16"
            height="12"
            rx="3"
            fill="url(#iq-escuro)"
            stroke="#0e1226"
            strokeWidth="1.5"
          />
          <rect
            x="24"
            y="-3.5"
            width="16"
            height="7"
            rx="3.5"
            fill="url(#iq-metal)"
            stroke="#7d87a3"
            strokeWidth="1"
          />
          <path d="M30 -3.5V3.5M35 -3.5V3.5" stroke="#1b2038" strokeWidth="1.5" />
        </>
      )}
    </g>
  );
});
