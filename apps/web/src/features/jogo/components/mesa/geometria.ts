import type { DestinoInformacao, IdPeca, IdPorta } from '../../model/tipos';

export type Ponto = readonly [number, number];

export const LARGURA_MESA = 960 as const;
export const ALTURA_MESA = 600 as const;

export const POSICAO_PECAS: Record<IdPeca, { readonly x: number; readonly y: number }> = {
  teclado: { x: 30, y: 30 },
  mouse: { x: 80, y: 170 },
  webcam: { x: 70, y: 320 },
  pendrive: { x: 40, y: 470 },
  monitor: { x: 670, y: 20 },
  caixaDeSom: { x: 700, y: 250 },
  microfone: { x: 830, y: 255 },
  fone: { x: 690, y: 420 },
};

export const AREA_PECAS: Record<
  IdPeca,
  { readonly x: number; readonly y: number; readonly largura: number; readonly altura: number }
> = {
  teclado: { x: 24, y: 24, largura: 262, altura: 108 },
  mouse: { x: 74, y: 164, largura: 84, altura: 116 },
  webcam: { x: 66, y: 314, largura: 100, altura: 110 },
  pendrive: { x: 34, y: 464, largura: 122, altura: 66 },
  monitor: { x: 664, y: 14, largura: 262, altura: 182 },
  caixaDeSom: { x: 694, y: 244, largura: 100, altura: 142 },
  microfone: { x: 824, y: 249, largura: 82, altura: 120 },
  fone: { x: 684, y: 414, largura: 132, altura: 124 },
};

export const ANCORA_CABO: Record<IdPeca, Ponto> = {
  teclado: [280, 76],
  mouse: [152, 222],
  webcam: [160, 352],
  pendrive: [150, 498],
  monitor: [670, 100],
  caixaDeSom: [700, 315],
  microfone: [842, 357],
  fone: [694, 500],
};

export const POSICAO_PORTAS: Record<
  IdPorta,
  { readonly centro: Ponto; readonly entrada: Ponto; readonly lado: 1 | -1 }
> = {
  usb1: { centro: [395, 426], entrada: [346, 426], lado: 1 },
  usb2: { centro: [395, 454], entrada: [346, 454], lado: 1 },
  usb3: { centro: [395, 482], entrada: [346, 482], lado: 1 },
  usb4: { centro: [395, 510], entrada: [346, 510], lado: 1 },
  hdmi: { centro: [509, 425], entrada: [564, 425], lado: -1 },
  audio1: { centro: [520, 452], entrada: [564, 452], lado: -1 },
  audio2: { centro: [520, 486], entrada: [564, 486], lado: -1 },
  mic: { centro: [520, 520], entrada: [564, 520], lado: -1 },
};

export const DESTINOS: Record<DestinoInformacao, Ponto> = {
  processador: [419, 109],
  armazenamento: [477, 226],
};

export function ladoDoPlugue(x: number): 1 | -1 {
  return x < 480 ? 1 : -1;
}
