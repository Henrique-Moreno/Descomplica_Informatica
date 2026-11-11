import { describe, expect, it } from 'vitest';
import { PECAS } from './pecas';
import { PORTAS } from './portas';

describe('dados do jogo', () => {
  it('mantém ids únicos para peças e portas', () => {
    expect(new Set(PECAS.map((peca) => peca.id)).size).toBe(PECAS.length);
    expect(new Set(PORTAS.map((porta) => porta.id)).size).toBe(PORTAS.length);
  });

  it('tem três nomes distintos por peça, diferentes do nome correto', () => {
    for (const peca of PECAS) {
      const opcoes = [peca.nome, ...peca.alternativas];
      expect(peca.alternativas).not.toContain(peca.nome);
      expect(new Set(opcoes).size).toBe(3);
    }
  });

  it('tem portas suficientes para todas as peças de cada tipo', () => {
    for (const peca of PECAS) {
      const quantidadePecas = PECAS.filter((item) => item.tipoPorta === peca.tipoPorta).length;
      const quantidadePortas = PORTAS.filter((item) => item.tipo === peca.tipoPorta).length;
      expect(quantidadePortas).toBeGreaterThanOrEqual(quantidadePecas);
    }
  });
});
