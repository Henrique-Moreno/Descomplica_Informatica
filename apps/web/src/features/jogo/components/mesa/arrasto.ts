import { PORTAS } from '../../data/portas';
import type { IdPorta } from '../../model/tipos';
import { ALTURA_MESA, LARGURA_MESA, POSICAO_PORTAS, ladoDoPlugue, type Ponto } from './geometria';

export const COMPRIMENTO_PLUGUE = 40;
export const RAIO_DE_ENCAIXE = 36;

export function limitarAMesa([x, y]: Ponto): Ponto {
  return [Math.min(Math.max(x, 0), LARGURA_MESA), Math.min(Math.max(y, 0), ALTURA_MESA)];
}

export function posicionarPlugue(ponteiro: Ponto): { origem: Ponto; lado: 1 | -1 } {
  const [x, y] = limitarAMesa(ponteiro);
  const lado = ladoDoPlugue(x);
  return { origem: [x - (lado * COMPRIMENTO_PLUGUE) / 2, y], lado };
}

export function pontaDoPlugue(origem: Ponto, lado: 1 | -1): Ponto {
  return [origem[0] + lado * COMPRIMENTO_PLUGUE, origem[1]];
}

export function portaMaisProxima(ponta: Ponto, raio = RAIO_DE_ENCAIXE): IdPorta | null {
  let melhor: IdPorta | null = null;
  let menorDistancia = raio;
  for (const { id } of PORTAS) {
    const [cx, cy] = POSICAO_PORTAS[id].centro;
    const distancia = Math.hypot(ponta[0] - cx, ponta[1] - cy);
    if (distancia < menorDistancia) {
      menorDistancia = distancia;
      melhor = id;
    }
  }
  return melhor;
}

export function caminhoDoCabo(de: Ponto, ate: Ponto): string {
  const meio = de[0] + (ate[0] - de[0]) / 2;
  return `M${de[0]} ${de[1]}C${meio} ${de[1]} ${meio} ${ate[1]} ${ate[0]} ${ate[1]}`;
}

export function pontoDoCabo(de: Ponto, ate: Ponto, t: number): Ponto {
  const meio = de[0] + (ate[0] - de[0]) / 2;
  const u = 1 - t;
  const x = u ** 3 * de[0] + 3 * u * u * t * meio + 3 * u * t * t * meio + t ** 3 * ate[0];
  const y = u ** 3 * de[1] + 3 * u * u * t * de[1] + 3 * u * t * t * ate[1] + t ** 3 * ate[1];
  return [x, y];
}

export function interpolar(a: Ponto, b: Ponto, t: number): Ponto {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
}
