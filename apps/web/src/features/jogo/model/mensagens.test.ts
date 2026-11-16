import { describe, expect, it } from 'vitest';
import { pecaPorId } from '@/features/jogo/data/pecas';
import { descreverPorta, explicacaoDaPeca, mensagemConexao, nomeComArtigo } from './mensagens';

describe('mensagens do jogo', () => {
  it('formata artigos e início de frase', () => {
    expect(nomeComArtigo(pecaPorId('teclado'))).toBe('o Teclado');
    expect(nomeComArtigo(pecaPorId('webcam'))).toBe('a Webcam');
    expect(nomeComArtigo(pecaPorId('teclado'), true)).toBe('O Teclado');
    expect(nomeComArtigo(pecaPorId('webcam'), true)).toBe('A Webcam');
  });

  it('descreve os quatro tipos de porta', () => {
    expect(descreverPorta('usb')).toBe('USB');
    expect(descreverPorta('hdmi')).toBe('HDMI');
    expect(descreverPorta('saidaAudio')).toBe('de saída de áudio (a verde)');
    expect(descreverPorta('microfone')).toBe('de microfone (a rosa)');
  });

  it('gera feedback para cada resultado de conexão', () => {
    const teclado = pecaPorId('teclado');
    expect(mensagemConexao(teclado, { tipo: 'acertou', pontosGanhos: 10 })).toEqual({
      tom: 'bom',
      titulo: 'Acertou! O Teclado liga numa porta USB. +10 pontos.',
      detalhe: explicacaoDaPeca(teclado),
    });
    expect(
      mensagemConexao(teclado, {
        tipo: 'porta-errada',
        portaId: 'hdmi',
        tipoPortaTocada: 'hdmi',
      }),
    ).toEqual({
      tom: 'ruim',
      titulo: 'Ops! O Teclado não liga numa porta HDMI.',
      detalhe: 'Tente outra porta. Puxe o meu cabo até a porta certa do gabinete.',
    });
    expect(mensagemConexao(teclado, { tipo: 'porta-ocupada', portaId: 'usb1' })).toEqual({
      tom: 'ruim',
      titulo: 'Essa porta já está ocupada.',
      detalhe: 'Escolha outra porta.',
    });
    expect(mensagemConexao(teclado, { tipo: 'sem-porta' })).toEqual({
      tom: 'neutro',
      titulo: 'Leve o plugue até uma porta do gabinete.',
      detalhe: '',
    });
    expect(mensagemConexao(teclado, null)).toBeNull();
  });

  it('explica o processador e o armazenamento', () => {
    expect(explicacaoDaPeca(pecaPorId('pendrive'))).toContain('armazenamento');
    expect(explicacaoDaPeca(pecaPorId('teclado'))).toContain('processador');
  });
});
