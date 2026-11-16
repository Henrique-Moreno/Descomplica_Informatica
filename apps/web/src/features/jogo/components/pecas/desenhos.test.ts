import { describe, expect, it } from 'vitest';
import { PECAS } from '../../data/pecas';
import { DESENHOS_PECAS } from './desenhos';

describe('DESENHOS_PECAS', () => {
  it('tem exatamente as chaves dos ids das peças', () => {
    expect(Object.keys(DESENHOS_PECAS).sort()).toEqual(PECAS.map((peca) => peca.id).sort());
  });

  it('define viewBox com quatro números separados por espaço', () => {
    for (const { viewBox } of Object.values(DESENHOS_PECAS)) {
      expect(viewBox.trim().split(/\s+/)).toHaveLength(4);
      expect(
        viewBox
          .trim()
          .split(/\s+/)
          .every((valor) => Number.isFinite(Number(valor))),
      ).toBe(true);
    }
  });
});
