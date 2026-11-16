export const TEMAS = ['automatico', 'claro', 'escuro'] as const;

export type Tema = (typeof TEMAS)[number];

interface RaizTema {
  dataset?: { theme?: string };
  setAttribute?: (nome: string, valor: string) => void;
  removeAttribute?: (nome: string) => void;
}

const CHAVE_TEMA = 'infoquest:tema';

export function aplicarTema(tema: Tema, raiz: RaizTema): void {
  const valor = tema === 'claro' ? 'light' : tema === 'escuro' ? 'dark' : null;

  if (valor === null) {
    if (raiz.removeAttribute) raiz.removeAttribute('data-theme');
    else if (raiz.dataset) delete raiz.dataset.theme;
    return;
  }

  if (raiz.setAttribute) raiz.setAttribute('data-theme', valor);
  else if (raiz.dataset) raiz.dataset.theme = valor;
}

function ehTema(valor: string | null): valor is Tema {
  return TEMAS.some((tema) => tema === valor);
}

export function lerTemaSalvo(): Tema {
  try {
    const valor = globalThis.localStorage?.getItem(CHAVE_TEMA) ?? null;
    return ehTema(valor) ? valor : 'automatico';
  } catch {
    return 'automatico';
  }
}

export function salvarTema(tema: Tema): void {
  try {
    globalThis.localStorage?.setItem(CHAVE_TEMA, tema);
  } catch {
    return;
  }
}
