import { memo } from 'react';
import estilos from './Gabinete.module.css';

export const Gabinete = memo(function Gabinete() {
  return (
    <g>
      <rect
        x="340"
        y="20"
        width="280"
        height="560"
        rx="18"
        fill="url(#iq-escuro)"
        stroke="#0e1226"
        strokeWidth="3"
        filter="url(#iq-sombra)"
      />
      <rect
        x="356"
        y="38"
        width="248"
        height="334"
        rx="10"
        fill="#0e1226"
        stroke="#59638f"
        strokeWidth="2"
      />
      <rect
        x="366"
        y="48"
        width="228"
        height="314"
        rx="6"
        fill="#17614a"
        stroke="#0f4a38"
        strokeWidth="2"
      />
      <path
        d="M372 150H380M372 150V300H392M458 109H484M540 66V48M540 166V200M394 252V280M560 252V340"
        stroke="#2f9b78"
        strokeWidth="2"
        opacity=".7"
        fill="none"
      />
      <rect
        x="380"
        y="70"
        width="78"
        height="78"
        rx="6"
        fill="#0e1226"
        stroke="#3a4160"
        strokeWidth="2"
      />
      <circle
        id="iq-cpu"
        cx="419"
        cy="109"
        r="34"
        fill="#1b2038"
        stroke="#8d97b0"
        strokeWidth="3"
      />
      <g fill="#2D4BFF" opacity=".9" transform="translate(419 109)">
        <path d="M0 0C6-12 18-22 28-16C22-8 10-2 0 0Z" />
        <path d="M0 0C6-12 18-22 28-16C22-8 10-2 0 0Z" transform="rotate(72)" />
        <path d="M0 0C6-12 18-22 28-16C22-8 10-2 0 0Z" transform="rotate(144)" />
        <path d="M0 0C6-12 18-22 28-16C22-8 10-2 0 0Z" transform="rotate(216)" />
        <path d="M0 0C6-12 18-22 28-16C22-8 10-2 0 0Z" transform="rotate(288)" />
      </g>
      <circle cx="419" cy="109" r="7" fill="#0e1226" />
      <text className={estilos.rotulo} x="419" y="164">
        Processador
      </text>
      <rect
        x="484"
        y="66"
        width="14"
        height="100"
        rx="2"
        fill="#0e1226"
        stroke="#cfd5e4"
        strokeWidth="1.5"
      />
      <rect x="487" y="72" width="8" height="12" fill="#59638f" />
      <rect x="487" y="90" width="8" height="12" fill="#59638f" />
      <rect x="487" y="108" width="8" height="12" fill="#59638f" />
      <rect x="484" y="160" width="14" height="6" fill="#f4c542" />
      <rect
        x="508"
        y="66"
        width="14"
        height="100"
        rx="2"
        fill="#0e1226"
        stroke="#cfd5e4"
        strokeWidth="1.5"
      />
      <rect x="511" y="72" width="8" height="12" fill="#59638f" />
      <rect x="511" y="90" width="8" height="12" fill="#59638f" />
      <rect x="511" y="108" width="8" height="12" fill="#59638f" />
      <rect x="508" y="160" width="14" height="6" fill="#f4c542" />
      <text className={estilos.rotulo} x="503" y="182">
        RAM
      </text>
      <rect
        id="iq-ssd"
        x="392"
        y="200"
        width="170"
        height="52"
        rx="6"
        fill="url(#iq-metal)"
        stroke="#8d97b0"
        strokeWidth="3"
      />
      <text
        x="477"
        y="231"
        fontSize="14"
        fill="#1b2250"
        textAnchor="middle"
        fontFamily="var(--fonte-texto)"
        fontWeight={800}
      >
        Armazenamento
      </text>
      <rect x="392" y="282" width="170" height="10" rx="2" fill="#0e1226" />
      <rect x="392" y="312" width="170" height="10" rx="2" fill="#0e1226" />
      <path d="M356 38L604 38L604 120L356 190Z" fill="#fff" opacity=".05" />
      <rect
        x="356"
        y="384"
        width="248"
        height="180"
        rx="10"
        fill="url(#iq-metal)"
        stroke="#8d97b0"
        strokeWidth="2"
      />
      <text className={estilos.titulo} x="480" y="395">
        Portas do gabinete
      </text>
    </g>
  );
});
