import { describe, expect, it } from 'vitest';
import { PECAS } from '@/features/jogo/data/pecas';
import { PORTAS } from '@/features/jogo/data/portas';
import { criarPartida } from './partida';
import { estadoInicial, reducerJogo } from './jogo';
import { deveMostrarDicaDasPortas } from './seletores';
import type { AcaoJogo, EstadoJogo, IdPeca } from './tipos';

function agir(estado: EstadoJogo, acao: AcaoJogo): EstadoJogo {
  return reducerJogo(estado, acao);
}

function novaPartida(permutacao: readonly IdPeca[] = PECAS.map((peca) => peca.id)) {
  return { ...criarPartida(() => 0.5), ordem: permutacao };
}

function iniciarPartida(ordem?: readonly IdPeca[]): EstadoJogo {
  return agir(estadoInicial, {
    tipo: 'iniciar',
    partida: novaPartida(ordem),
    rotulosNasPortas: false,
  });
}

function identificar(estado: EstadoJogo): EstadoJogo {
  const id = estado.partida.ordem[estado.indice];
  if (!id) throw new Error('A peça atual não existe');
  const peca = PECAS.find((item) => item.id === id);
  if (!peca) throw new Error('A peça atual não existe nos dados');
  return agir(estado, { tipo: 'escolherOpcao', nome: peca.nome });
}

function conectar(estado: EstadoJogo, tentativasErradas = 0): EstadoJogo {
  let resultado = estado;
  const id = estado.partida.ordem[estado.indice];
  if (!id) throw new Error('A peça atual não existe');
  const peca = PECAS.find((item) => item.id === id);
  if (!peca) throw new Error('A peça atual não existe nos dados');
  for (let tentativa = 0; tentativa < tentativasErradas; tentativa += 1) {
    const ocupadas = Object.values(resultado.conexoes);
    const portaIncorreta = PORTAS.find(
      (porta) => porta.tipo !== peca.tipoPorta && !ocupadas.includes(porta.id),
    );
    if (!portaIncorreta) throw new Error('Não existe porta livre incorreta');
    resultado = agir(resultado, { tipo: 'soltarCabo', portaId: portaIncorreta.id });
  }
  const portasOcupadasAtual = Object.values(resultado.conexoes);
  const portaCorreta = PORTAS.find(
    (porta) => porta.tipo === peca.tipoPorta && !portasOcupadasAtual.includes(porta.id),
  );
  if (!portaCorreta) throw new Error('Não existe porta correta livre');
  return agir(resultado, { tipo: 'soltarCabo', portaId: portaCorreta.id });
}

describe('reducerJogo', () => {
  it('conclui uma partida perfeita com 120 pontos', () => {
    let estado = iniciarPartida();
    for (let indice = 0; indice < estado.partida.ordem.length; indice += 1) {
      estado = identificar(estado);
      estado = agir(estado, { tipo: 'continuar' });
      estado = conectar(estado);
      estado = agir(estado, { tipo: 'proximaPeca' });
    }
    expect(estado.fase).toBe('fim');
    expect(estado.pontos).toBe(120);
  });

  it('marca opção errada e concede menos pontos na identificação', () => {
    let estado = iniciarPartida();
    const id = estado.partida.ordem[0];
    if (!id) throw new Error('Partida sem peça');
    const errada = estado.partida.opcoes[id].find(
      (nome) => nome !== PECAS.find((peca) => peca.id === id)?.nome,
    );
    if (!errada) throw new Error('Partida sem alternativa');
    estado = agir(estado, { tipo: 'escolherOpcao', nome: errada });
    expect(estado.opcoesErradas).toContain(errada);
    expect(estado.tentativasIdentificacao).toBe(1);
    estado = identificar(estado);
    expect(estado.pontos).toBe(2);
  });

  it('não conta soltar fora de porta nem tentar uma porta ocupada', () => {
    let estado = iniciarPartida();
    estado = identificar(estado);
    estado = agir(estado, { tipo: 'continuar' });
    estado = agir(estado, { tipo: 'soltarCabo', portaId: null });
    expect(estado.tentativasConexao).toBe(0);
    estado = conectar(estado);
    estado = agir(estado, { tipo: 'proximaPeca' });
    estado = identificar(estado);
    estado = agir(estado, { tipo: 'continuar' });
    estado = agir(estado, { tipo: 'soltarCabo', portaId: 'usb1' });
    expect(estado.resultadoConexao).toEqual({ tipo: 'porta-ocupada' });
    expect(estado.tentativasConexao).toBe(0);
  });

  it('ativa a dica depois de dois erros de conexão', () => {
    let estado = iniciarPartida([
      'monitor',
      'teclado',
      'mouse',
      'webcam',
      'pendrive',
      'caixaDeSom',
      'fone',
      'microfone',
    ]);
    estado = identificar(estado);
    estado = agir(estado, { tipo: 'continuar' });
    estado = agir(estado, { tipo: 'soltarCabo', portaId: 'usb1' });
    estado = agir(estado, { tipo: 'soltarCabo', portaId: 'usb2' });
    expect(estado.tentativasConexao).toBe(2);
    expect(deveMostrarDicaDasPortas(estado)).toBe(true);
  });

  it('devolve a mesma referência para ações fora da fase permitida', () => {
    const estado = iniciarPartida();
    expect(agir(estado, { tipo: 'continuar' })).toBe(estado);
    expect(agir(estado, { tipo: 'proximaPeca' })).toBe(estado);
  });

  it('não altera o estado anterior', () => {
    const estado = iniciarPartida();
    const copia = structuredClone(estado);
    agir(estado, { tipo: 'escolherOpcao', nome: estado.partida.opcoes.teclado[0] ?? '' });
    expect(estado).toEqual(copia);
  });
});
