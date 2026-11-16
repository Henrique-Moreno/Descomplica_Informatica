export function DefinicoesSvg() {
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: 'absolute' }}>
      <defs>
        <linearGradient id="iq-metal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6f8fc" />
          <stop offset="1" stopColor="#aab3c8" />
        </linearGradient>
        <linearGradient id="iq-escuro" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a4160" />
          <stop offset="1" stopColor="#151a2e" />
        </linearGradient>
        <linearGradient id="iq-corpo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f5f7fc" />
          <stop offset="1" stopColor="#bcc4d8" />
        </linearGradient>
        <linearGradient id="iq-azul" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5b7bff" />
          <stop offset="1" stopColor="#1d34c4" />
        </linearGradient>
        <linearGradient id="iq-tela" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4f7cff" />
          <stop offset="1" stopColor="#8be0ff" />
        </linearGradient>
        <radialGradient id="iq-lente" cx=".35" cy=".3" r=".8">
          <stop offset="0" stopColor="#8f9bff" />
          <stop offset=".5" stopColor="#2a2f7a" />
          <stop offset="1" stopColor="#0b0f20" />
        </radialGradient>
        <pattern id="iq-teclas" x="10" y="9" width="18" height="17" patternUnits="userSpaceOnUse">
          <rect
            x="1.5"
            y="1.5"
            width="15"
            height="14"
            rx="3"
            fill="#fbfcff"
            stroke="#a9b1c7"
            strokeWidth="1"
          />
        </pattern>
        <pattern id="iq-malha" width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="1.3" fill="#47507a" />
        </pattern>
        <filter id="iq-sombra" x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#0b1030" floodOpacity=".28" />
        </filter>
      </defs>
    </svg>
  );
}
