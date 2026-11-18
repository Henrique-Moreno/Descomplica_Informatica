import { pecaPorId } from '../../data/pecas';
import type { DirecaoInformacao, IdPeca, IdPorta } from '../../model/tipos';
import { ANCORA_CABO, DESTINOS, POSICAO_PORTAS, type Ponto } from './geometria';
import { interpolar, pontoDoCabo } from './arrasto';

export type Destino = keyof typeof DESTINOS;

export interface Etapa {
  readonly pontos: Ponto[];
  readonly destinoAcesoNoInicio: boolean;
  readonly destinoAcesoNoFim: boolean;
}

export function amostrarCabo(de: Ponto, ate: Ponto, passos = 24): Ponto[] {
  return Array.from({ length: passos + 1 }, (_, indice) => pontoDoCabo(de, ate, indice / passos));
}

export function comprimento(pontos: readonly Ponto[]): number {
  let total = 0;
  for (let indice = 1; indice < pontos.length; indice += 1) {
    const anterior = pontos[indice - 1];
    const atual = pontos[indice];
    if (anterior && atual) total += Math.hypot(atual[0] - anterior[0], atual[1] - anterior[1]);
  }
  return total;
}

export function pontoNaPolilinha(pontos: readonly Ponto[], t: number): Ponto {
  const primeiro = pontos[0] ?? [0, 0];
  if (pontos.length < 2 || t <= 0) return primeiro;
  const ultimo = pontos[pontos.length - 1];
  if (!ultimo || t >= 1) return ultimo ?? primeiro;

  const tamanho = comprimento(pontos);
  if (tamanho === 0) return primeiro;
  const distanciaAlvo = tamanho * Math.min(Math.max(t, 0), 1);
  let percorrido = 0;

  for (let indice = 1; indice < pontos.length; indice += 1) {
    const anterior = pontos[indice - 1];
    const atual = pontos[indice];
    if (!anterior || !atual) continue;
    const trecho = Math.hypot(atual[0] - anterior[0], atual[1] - anterior[1]);
    if (percorrido + trecho >= distanciaAlvo) {
      const fracao = trecho > 0 ? (distanciaAlvo - percorrido) / trecho : 0;
      return interpolar(anterior, atual, fracao);
    }
    percorrido += trecho;
  }
  return ultimo;
}

export function rotaDeIda(idPeca: IdPeca, idPorta: IdPorta): Ponto[] {
  const peca = pecaPorId(idPeca);
  const porta = POSICAO_PORTAS[idPorta];
  return [
    ...amostrarCabo(ANCORA_CABO[idPeca], porta.entrada),
    porta.centro,
    DESTINOS[peca.destino],
  ];
}

export function etapasDaViagem(direcao: DirecaoInformacao, ida: Ponto[]): readonly Etapa[] {
  const volta = [...ida].reverse();
  if (direcao === 'entrada') {
    return [{ pontos: ida, destinoAcesoNoInicio: false, destinoAcesoNoFim: true }];
  }
  if (direcao === 'saida') {
    return [{ pontos: volta, destinoAcesoNoInicio: true, destinoAcesoNoFim: false }];
  }
  return [
    { pontos: ida, destinoAcesoNoInicio: false, destinoAcesoNoFim: true },
    { pontos: volta, destinoAcesoNoInicio: true, destinoAcesoNoFim: false },
  ];
}
