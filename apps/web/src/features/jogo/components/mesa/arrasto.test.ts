import { describe, expect, it } from 'vitest';
import {
  caminhoDoCabo,
  interpolar,
  limitarAMesa,
  pontaDoPlugue,
  portaMaisProxima,
  posicionarPlugue,
} from './arrasto';

describe('funções de arrasto do cabo', () => {
  it('posiciona o plugue à esquerda ou à direita do ponteiro', () => {
    expect(posicionarPlugue([100, 300])).toEqual({ origem: [80, 300], lado: 1 });
    expect(posicionarPlugue([700, 300])).toEqual({ origem: [720, 300], lado: -1 });
  });

  it('limita o ponteiro às bordas da mesa antes de posicionar', () => {
    expect(limitarAMesa([-50, 700])).toEqual([0, 600]);
    expect(posicionarPlugue([-50, 700])).toEqual({ origem: [-20, 600], lado: 1 });
  });

  it('calcula a ponta do plugue e encontra portas dentro do raio', () => {
    expect(pontaDoPlugue([80, 300], 1)).toEqual([120, 300]);
    expect(portaMaisProxima([395, 426])).toBe('usb1');
    expect(portaMaisProxima([415, 426])).toBe('usb1');
    expect(portaMaisProxima([100, 100])).toBeNull();
  });

  it('escolhe a porta mais próxima', () => {
    expect(portaMaisProxima([395, 445])).toBe('usb2');
  });

  it('desenha o cabo e interpola posições', () => {
    expect(caminhoDoCabo([0, 0], [100, 50])).toBe('M0 0C50 0 50 50 100 50');
    expect(interpolar([0, 0], [100, 50], 0)).toEqual([0, 0]);
    expect(interpolar([0, 0], [100, 50], 0.5)).toEqual([50, 25]);
    expect(interpolar([0, 0], [100, 50], 1)).toEqual([100, 50]);
  });
});
