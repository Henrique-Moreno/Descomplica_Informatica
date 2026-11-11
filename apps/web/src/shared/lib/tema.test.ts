import { afterEach, describe, expect, it, vi } from 'vitest';
import { aplicarTema, lerTemaSalvo, proximoTema, salvarTema } from './tema';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('tema', () => {
  it('alterna entre automático, claro e escuro', () => {
    expect(proximoTema('automatico')).toBe('claro');
    expect(proximoTema('claro')).toBe('escuro');
    expect(proximoTema('escuro')).toBe('automatico');
  });

  it('aplica os temas e remove o atributo no automático', () => {
    const raiz: { dataset: { theme?: string } } = { dataset: {} };

    aplicarTema('claro', raiz);
    expect(raiz.dataset.theme).toBe('light');
    aplicarTema('escuro', raiz);
    expect(raiz.dataset.theme).toBe('dark');
    aplicarTema('automatico', raiz);
    expect(raiz.dataset.theme).toBeUndefined();
  });

  it('usa automático quando o valor salvo é inválido', () => {
    vi.stubGlobal('localStorage', { getItem: () => 'sepia' });
    expect(lerTemaSalvo()).toBe('automatico');
  });

  it('salva e recupera a escolha pela chave do InfoQuest', () => {
    const valores = new Map<string, string>();
    const armazenamento = {
      getItem: vi.fn((chave: string) => valores.get(chave) ?? null),
      setItem: vi.fn((chave: string, valor: string) => valores.set(chave, valor)),
    };
    vi.stubGlobal('localStorage', armazenamento);

    salvarTema('escuro');

    expect(armazenamento.setItem).toHaveBeenCalledWith('infoquest:tema', 'escuro');
    expect(lerTemaSalvo()).toBe('escuro');
  });

  it('lê e salva o tema sem falhar quando o armazenamento lança erro', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => {
        throw new Error('Storage indisponível');
      },
      setItem: () => {
        throw new Error('Storage indisponível');
      },
    });

    expect(lerTemaSalvo()).toBe('automatico');
    expect(() => salvarTema('escuro')).not.toThrow();
  });
});
