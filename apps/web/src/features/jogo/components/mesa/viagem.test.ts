import { describe, expect, it } from 'vitest';
import { pecaPorId } from '../../data/pecas';
import { ANCORA_CABO, DESTINOS, POSICAO_PORTAS } from './geometria';
import { pontoDoCabo } from './arrasto';
import { amostrarCabo, comprimento, etapasDaViagem, pontoNaPolilinha, rotaDeIda } from './viagem';

describe('geometria da viagem da informação', () => {
  it('avalia o ponto inicial, final e intermediário do cabo', () => {
    const inicio = [0, 10] as const;
    const fim = [100, 50] as const;
    expect(pontoDoCabo(inicio, fim, 0)).toEqual(inicio);
    expect(pontoDoCabo(inicio, fim, 1)).toEqual(fim);
    expect(pontoDoCabo(inicio, fim, 0.5)).toEqual([50, 30]);
  });

  it('amostra a rota da âncora pelo cabo, porta e destino da peça', () => {
    const teclado = rotaDeIda('teclado', 'usb1');
    expect(teclado[0]).toEqual(ANCORA_CABO.teclado);
    expect(teclado.at(-1)).toEqual(DESTINOS.processador);
    expect(teclado[24]).toEqual(POSICAO_PORTAS.usb1.entrada);

    const pendrive = rotaDeIda('pendrive', 'usb1');
    expect(pendrive.at(-1)).toEqual(DESTINOS.armazenamento);
  });

  it('amostra o cabo nos dois extremos', () => {
    const pontos = amostrarCabo([1, 2], [50, 60]);
    expect(pontos).toHaveLength(25);
    expect(pontos[0]).toEqual([1, 2]);
    expect(pontos.at(-1)).toEqual([50, 60]);
  });

  it('percorre a polilinha pela distância total e limita a fração', () => {
    const pontos = [
      [0, 0],
      [10, 0],
      [10, 10],
    ] as const;
    expect(comprimento(pontos)).toBe(20);
    expect(pontoNaPolilinha(pontos, 0.5)).toEqual([10, 0]);
    expect(pontoNaPolilinha(pontos, 0)).toEqual([0, 0]);
    expect(pontoNaPolilinha(pontos, 1)).toEqual([10, 10]);
    expect(pontoNaPolilinha(pontos, -1)).toEqual([0, 0]);
    expect(pontoNaPolilinha(pontos, 2)).toEqual([10, 10]);
  });

  it('monta ida, volta e ciclo de ida e volta conforme a direção', () => {
    const ida = rotaDeIda('pendrive', 'usb1');
    const entrada = etapasDaViagem(pecaPorId('teclado').direcao, ida);
    expect(entrada).toHaveLength(1);
    expect(entrada[0]?.destinoAcesoNoFim).toBe(true);

    const rotaMonitor = rotaDeIda('monitor', 'hdmi');
    const saida = etapasDaViagem(pecaPorId('monitor').direcao, rotaMonitor);
    expect(saida).toHaveLength(1);
    expect(saida[0]?.pontos[0]).toEqual(DESTINOS.processador);
    expect(saida[0]?.destinoAcesoNoInicio).toBe(true);

    const entradaESaida = etapasDaViagem(pecaPorId('pendrive').direcao, ida);
    expect(entradaESaida).toHaveLength(2);
    expect(entradaESaida[1]?.pontos[0]).toEqual(DESTINOS.armazenamento);
  });
});
