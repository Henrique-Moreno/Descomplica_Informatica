import { PECAS } from '@/features/jogo/data/pecas';
import { embaralhar } from '@/shared/lib/embaralhar';
import type { IdPeca, Partida } from './tipos';

export function criarPartida(aleatorio: () => number = Math.random): Partida {
  const opcoes = Object.fromEntries(
    PECAS.map((peca) => [peca.id, embaralhar([peca.nome, ...peca.alternativas], aleatorio)]),
  ) as unknown as Record<IdPeca, readonly string[]>;

  return {
    ordem: embaralhar(
      PECAS.map((peca) => peca.id),
      aleatorio,
    ),
    opcoes,
  };
}
