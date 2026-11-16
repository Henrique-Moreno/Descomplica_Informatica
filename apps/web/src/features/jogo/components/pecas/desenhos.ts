import type { ComponentType } from 'react';
import type { IdPeca } from '../../model/tipos';
import { PecaCaixaDeSom } from './PecaCaixaDeSom';
import { PecaFone } from './PecaFone';
import { PecaMicrofone } from './PecaMicrofone';
import { PecaMonitor } from './PecaMonitor';
import { PecaMouse } from './PecaMouse';
import { PecaPendrive } from './PecaPendrive';
import { PecaTeclado } from './PecaTeclado';
import { PecaWebcam } from './PecaWebcam';

export interface DesenhoPeca {
  readonly Desenho: ComponentType;
  readonly viewBox: string;
}

export const DESENHOS_PECAS: Readonly<Record<IdPeca, DesenhoPeca>> = {
  teclado: { Desenho: PecaTeclado, viewBox: '-8 -8 266 108' },
  mouse: { Desenho: PecaMouse, viewBox: '-8 -8 88 120' },
  webcam: { Desenho: PecaWebcam, viewBox: '0 0 90 92' },
  pendrive: { Desenho: PecaPendrive, viewBox: '-6 -2 120 62' },
  monitor: { Desenho: PecaMonitor, viewBox: '-8 -8 266 202' },
  caixaDeSom: { Desenho: PecaCaixaDeSom, viewBox: '-8 -8 104 146' },
  fone: { Desenho: PecaFone, viewBox: '0 0 120 112' },
  microfone: { Desenho: PecaMicrofone, viewBox: '-2 -2 74 116' },
};
