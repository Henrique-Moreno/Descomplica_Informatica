import { describe, expect, it } from 'vitest';
import { estadoInicial, reducerJogo } from './jogo';
import { criarPartida } from './partida';
import {
  deveParabenizar,
  pecaAtual,
  portaAceita,
  portasEmDestaque,
  portasLivres,
  progresso,
  progressoDaPartida,
} from './seletores';

describe('seletores do jogo', () => {
  it('aceita apenas uma porta correta e livre na fase de conexão', () => {
    let estado = reducerJogo(estadoInicial, {
      tipo: 'iniciar',
      partida: { ...criarPartida(() => 0.5), ordem: ['teclado'] },
      rotulosNasPortas: false,
    });
    estado = reducerJogo(estado, { tipo: 'escolherOpcao', nome: 'Teclado' });
    estado = reducerJogo(estado, { tipo: 'continuar' });

    expect(portaAceita(estado, 'usb1')).toBe(true);
    expect(portaAceita(estado, 'hdmi')).toBe(false);
    expect(portaAceita({ ...estado, conexoes: { mouse: 'usb1' } }, 'usb1')).toBe(false);
    expect(portaAceita(estado, null)).toBe(false);
    expect(portaAceita({ ...estado, fase: 'identificar' }, 'usb1')).toBe(false);
  });

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

  it('mostra somente portas USB livres depois de dois erros', () => {
    let estado = reducerJogo(estadoInicial, {
      tipo: 'iniciar',
      partida: { ...criarPartida(() => 0.5), ordem: ['mouse', 'teclado'] },
      rotulosNasPortas: false,
    });
    estado = reducerJogo(estado, { tipo: 'escolherOpcao', nome: 'Mouse' });
    estado = reducerJogo(estado, { tipo: 'continuar' });
    estado = reducerJogo(estado, { tipo: 'soltarCabo', portaId: 'usb1' });
    estado = reducerJogo(estado, { tipo: 'proximaPeca' });
    estado = reducerJogo(estado, { tipo: 'escolherOpcao', nome: 'Teclado' });
    estado = reducerJogo(estado, { tipo: 'continuar' });

    expect(portasEmDestaque(estado)).toEqual([]);
    estado = reducerJogo(estado, { tipo: 'soltarCabo', portaId: 'hdmi' });
    expect(portasEmDestaque(estado)).toEqual([]);
    estado = reducerJogo(estado, { tipo: 'soltarCabo', portaId: 'audio1' });
    expect(portasEmDestaque(estado)).toEqual(['usb2', 'usb3', 'usb4']);
  });

  it('retorna o progresso específico da partida na primeira e última peça', () => {
    let estado = reducerJogo(estadoInicial, {
      tipo: 'iniciar',
      partida: criarPartida(() => 0.5),
      rotulosNasPortas: false,
    });
    expect(progressoDaPartida(estado)).toEqual({ atual: 1, total: 8 });
    estado = { ...estado, indice: estado.partida.ordem.length - 1 };
    expect(progressoDaPartida(estado)).toEqual({ atual: 8, total: 8 });
  });

  it('parabeniza ao atingir setenta por cento da pontuação máxima', () => {
    expect(deveParabenizar(84)).toBe(true);
    expect(deveParabenizar(83)).toBe(false);
    expect(deveParabenizar(120)).toBe(true);
    expect(deveParabenizar(0)).toBe(false);
  });
});
