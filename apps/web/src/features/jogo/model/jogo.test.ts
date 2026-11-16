import { describe, expect, it } from 'vitest';
import { PECAS } from '@/features/jogo/data/pecas';
import { PORTAS } from '@/features/jogo/data/portas';
import { criarPartida } from './partida';
import { estadoInicial, reducerJogo } from './jogo';
import { deveMostrarDicaDasPortas } from './seletores';
import type { AcaoJogo, EstadoJogo, IdPeca, Peca } from './tipos';

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

function pecaAtual(estado: EstadoJogo): Peca {
  const id = estado.partida.ordem[estado.indice];
  if (!id) throw new Error('A peça atual não existe');
  const peca = PECAS.find((item) => item.id === id);
  if (!peca) throw new Error('A peça atual não existe nos dados');
  return peca;
}

function opcaoErrada(estado: EstadoJogo): string {
  const peca = pecaAtual(estado);
  const errada = estado.partida.opcoes[peca.id].find((nome) => nome !== peca.nome);
  if (!errada) throw new Error('Partida sem alternativa');
  return errada;
}

function identificar(estado: EstadoJogo): EstadoJogo {
  return agir(estado, { tipo: 'escolherOpcao', nome: pecaAtual(estado).nome });
}

function conectar(estado: EstadoJogo, tentativasErradas = 0): EstadoJogo {
  let resultado = estado;
  const peca = pecaAtual(estado);
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

function jogarPartidaPerfeita(): EstadoJogo {
  let estado = iniciarPartida();
  for (let indice = 0; indice < estado.partida.ordem.length; indice += 1) {
    estado = identificar(estado);
    estado = agir(estado, { tipo: 'continuar' });
    estado = conectar(estado);
    estado = agir(estado, { tipo: 'proximaPeca' });
  }
  return estado;
}

describe('reducerJogo', () => {
  it('conclui uma partida perfeita com 120 pontos', () => {
    const estado = jogarPartidaPerfeita();
    expect(estado.fase).toBe('fim');
    expect(estado.pontos).toBe(120);
  });

  it('mantém o índice na última peça ao terminar e ignora ações depois do fim', () => {
    const estado = jogarPartidaPerfeita();
    expect(estado.indice).toBe(estado.partida.ordem.length - 1);
    expect(agir(estado, { tipo: 'proximaPeca' })).toBe(estado);
    expect(agir(estado, { tipo: 'continuar' })).toBe(estado);
    expect(agir(estado, { tipo: 'soltarCabo', portaId: 'usb1' })).toBe(estado);
  });

  it('marca opção errada e concede menos pontos na identificação', () => {
    let estado = iniciarPartida();
    const errada = opcaoErrada(estado);
    estado = agir(estado, { tipo: 'escolherOpcao', nome: errada });
    expect(estado.opcoesErradas).toContain(errada);
    expect(estado.tentativasIdentificacao).toBe(1);
    estado = identificar(estado);
    expect(estado.pontos).toBe(2);
  });

  it('não conta duas vezes a mesma opção errada', () => {
    let estado = iniciarPartida();
    const errada = opcaoErrada(estado);
    estado = agir(estado, { tipo: 'escolherOpcao', nome: errada });
    const depoisDaPrimeira = estado;
    estado = agir(estado, { tipo: 'escolherOpcao', nome: errada });
    expect(estado).toBe(depoisDaPrimeira);
    expect(estado.tentativasIdentificacao).toBe(1);
    expect(estado.opcoesErradas).toEqual([errada]);
  });

  it('ignora um nome que não está entre as opções da peça', () => {
    const estado = iniciarPartida();
    expect(agir(estado, { tipo: 'escolherOpcao', nome: 'Impressora' })).toBe(estado);
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

  it('conta o erro de porta e continua na fase de conexão', () => {
    let estado = iniciarPartida();
    const peca = pecaAtual(estado);
    const portaIncorreta = PORTAS.find((porta) => porta.tipo !== peca.tipoPorta);
    if (!portaIncorreta) throw new Error('Não existe porta incorreta');
    estado = identificar(estado);
    estado = agir(estado, { tipo: 'continuar' });
    estado = agir(estado, { tipo: 'soltarCabo', portaId: portaIncorreta.id });
    expect(estado.fase).toBe('conectar');
    expect(estado.tentativasConexao).toBe(1);
    expect(estado.resultadoConexao).toEqual({
      tipo: 'porta-errada',
      tipoPortaTocada: portaIncorreta.tipo,
    });
  });

  it('dá 5 pontos na conexão depois de um erro', () => {
    let estado = iniciarPartida();
    estado = identificar(estado);
    estado = agir(estado, { tipo: 'continuar' });
    estado = conectar(estado, 1);
    expect(estado.fase).toBe('conectado');
    expect(estado.resultadoConexao).toEqual({ tipo: 'acertou', pontosGanhos: 5 });
    expect(estado.pontos).toBe(10);
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

  it('não inicia uma partida sem peças', () => {
    const vazia = { ordem: [], opcoes: estadoInicial.partida.opcoes };
    expect(agir(estadoInicial, { tipo: 'iniciar', partida: vazia, rotulosNasPortas: false })).toBe(
      estadoInicial,
    );
  });

  it('devolve a mesma referência para ações fora da fase permitida', () => {
    const estado = iniciarPartida();
    expect(agir(estado, { tipo: 'continuar' })).toBe(estado);
    expect(agir(estado, { tipo: 'proximaPeca' })).toBe(estado);
  });

  it('não altera o estado anterior', () => {
    const estado = iniciarPartida();
    const copia = structuredClone(estado);
    const proximo = agir(estado, { tipo: 'escolherOpcao', nome: opcaoErrada(estado) });
    expect(proximo).not.toBe(estado);
    expect(estado).toEqual(copia);
  });
});
