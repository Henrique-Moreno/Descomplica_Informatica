import { describe, expect, it } from 'vitest';
import { estadoInicial, reducerJogo } from './jogo';
import { criarPartida } from './partida';
import { pecaAtual, portasLivres, progresso } from './seletores';

describe('seletores do jogo', () => {
  it('atualiza portas livres depois de conectar', () => {
    let estado = reducerJogo(estadoInicial, {
      tipo: 'iniciar',
      partida: { ...criarPartida(() => 0.5), ordem: ['teclado'] },
      rotulosNasPortas: false,
    });
    estado = reducerJogo(estado, { tipo: 'escolherOpcao', nome: 'Teclado' });
    estado = reducerJogo(estado, { tipo: 'continuar' });
    const totalAntes = portasLivres(estado).length;
    estado = reducerJogo(estado, { tipo: 'soltarCabo', portaId: 'usb1' });
    expect(portasLivres(estado)).toHaveLength(totalAntes - 1);
    expect(pecaAtual(estado)?.id).toBe('teclado');
  });

  it('retorna o progresso atual e total', () => {
    const estado = reducerJogo(estadoInicial, {
      tipo: 'iniciar',
      partida: criarPartida(() => 0.5),
      rotulosNasPortas: false,
    });
    expect(progresso(estado)).toEqual({ atual: 1, total: 8 });
  });
});
