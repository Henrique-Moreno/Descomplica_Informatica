import { describe, expect, it } from 'vitest';
import { PECAS } from '@/features/jogo/data/pecas';
import { criarPartida } from './partida';

describe('criarPartida', () => {
  it('inclui as oito peças sem repetição e três opções com a resposta', () => {
    const partida = criarPartida();
    expect(partida.ordem).toHaveLength(8);
    expect(new Set(partida.ordem).size).toBe(8);

    for (const peca of PECAS) {
      expect(partida.opcoes[peca.id]).toHaveLength(3);
      expect(partida.opcoes[peca.id]).toContain(peca.nome);
    }
  });

  it('produz uma partida determinística com uma fonte fixa', () => {
    expect(criarPartida(() => 0.5)).toEqual(criarPartida(() => 0.5));
  });
});
