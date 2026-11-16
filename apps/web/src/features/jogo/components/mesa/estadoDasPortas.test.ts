import { describe, expect, it } from 'vitest';
import { estadoInicial, reducerJogo } from '../../model/jogo';
import { criarPartida } from '../../model/partida';
import { calcularEstadoPortas } from './estadoDasPortas';

function prepararConexao() {
  let estado = reducerJogo(estadoInicial, {
    tipo: 'iniciar',
    partida: { ...criarPartida(() => 0.5), ordem: ['teclado'] },
    rotulosNasPortas: false,
  });
  estado = reducerJogo(estado, { tipo: 'escolherOpcao', nome: 'Teclado' });
  return reducerJogo(estado, { tipo: 'continuar' });
}

describe('calcularEstadoPortas', () => {
  it('não marca portas no estado inicial', () => {
    expect(calcularEstadoPortas(estadoInicial)).toEqual({});
  });

  it('marca a porta conectada como usada', () => {
    let estado = prepararConexao();
    estado = reducerJogo(estado, { tipo: 'soltarCabo', portaId: 'usb1' });
    expect(calcularEstadoPortas(estado).usb1).toBe('usada');
  });

  it('marca como errada a porta tocada', () => {
    const estado = reducerJogo(prepararConexao(), { tipo: 'soltarCabo', portaId: 'hdmi' });
    expect(calcularEstadoPortas(estado).hdmi).toBe('errada');
  });

  it('marca portas corretas livres com dica depois de dois erros', () => {
    let estado = prepararConexao();
    estado = reducerJogo(estado, { tipo: 'soltarCabo', portaId: 'hdmi' });
    estado = reducerJogo(estado, { tipo: 'soltarCabo', portaId: 'audio1' });
    expect(calcularEstadoPortas(estado)).toMatchObject({
      usb1: 'dica',
      usb2: 'dica',
      usb3: 'dica',
      usb4: 'dica',
    });
  });
});
