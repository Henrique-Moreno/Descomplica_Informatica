import { describe, expect, it } from 'vitest';
import { estrelas, pontuacaoMaxima, pontosConexao, pontosIdentificacao } from './pontuacao';

describe('pontuação', () => {
  it('pontua a identificação conforme os erros', () => {
    expect(pontosIdentificacao(0)).toBe(5);
    expect(pontosIdentificacao(1)).toBe(2);
    expect(pontosIdentificacao(3)).toBe(2);
  });

  it('pontua a conexão conforme os erros', () => {
    expect(pontosConexao(0)).toBe(10);
    expect(pontosConexao(1)).toBe(5);
    expect(pontosConexao(2)).toBe(2);
    expect(pontosConexao(5)).toBe(2);
  });

  it('calcula o máximo de uma partida de oito peças', () => {
    expect(pontuacaoMaxima(8)).toBe(120);
  });

  it('calcula uma, duas ou três estrelas pelas faixas', () => {
    expect(estrelas(101, 120)).toBe(2);
    expect(estrelas(102, 120)).toBe(3);
    expect(estrelas(72, 120)).toBe(2);
    expect(estrelas(71, 120)).toBe(1);
    expect(estrelas(0, 0)).toBe(1);
  });
});
