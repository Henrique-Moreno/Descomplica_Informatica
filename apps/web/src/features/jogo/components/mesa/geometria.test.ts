import { describe, expect, it } from 'vitest';
import { PECAS } from '../../data/pecas';
import { PORTAS } from '../../data/portas';
import { ANCORA_CABO, AREA_PECAS, ladoDoPlugue, POSICAO_PECAS, POSICAO_PORTAS } from './geometria';

describe('geometria da mesa', () => {
  it('usa os ids existentes para as posições das portas', () => {
    expect(Object.keys(POSICAO_PORTAS).sort()).toEqual(PORTAS.map((porta) => porta.id).sort());
  });

  it('define posição, área e âncora para cada peça', () => {
    const ids = PECAS.map((peca) => peca.id).sort();
    expect(Object.keys(POSICAO_PECAS).sort()).toEqual(ids);
    expect(Object.keys(AREA_PECAS).sort()).toEqual(ids);
    expect(Object.keys(ANCORA_CABO).sort()).toEqual(ids);
  });

  it('escolhe o lado do plugue pelo eixo horizontal', () => {
    expect(ladoDoPlugue(100)).toBe(1);
    expect(ladoDoPlugue(700)).toBe(-1);
  });

  it('orienta cada cabo para fora do gabinete', () => {
    for (const { centro, entrada, lado } of Object.values(POSICAO_PORTAS)) {
      expect(lado).toBe(entrada[0] < centro[0] ? 1 : -1);
    }
  });
});
