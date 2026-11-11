import { PECAS, pecaPorId } from '@/features/jogo/data/pecas';
import { PORTAS } from '@/features/jogo/data/portas';
import { pontosConexao, pontosIdentificacao } from './pontuacao';
import type { AcaoJogo, EstadoJogo, IdPeca, Partida } from './tipos';

const PECAS_IDS: readonly IdPeca[] = PECAS.map((peca) => peca.id);
const PARTIDA_VAZIA: Partida = {
  ordem: [],
  opcoes: Object.fromEntries(PECAS_IDS.map((id) => [id, []])) as unknown as Record<
    IdPeca,
    readonly string[]
  >,
};

export const estadoInicial: EstadoJogo = {
  fase: 'inicio',
  partida: PARTIDA_VAZIA,
  indice: 0,
  pontos: 0,
  tentativasIdentificacao: 0,
  tentativasConexao: 0,
  opcoesErradas: [],
  conexoes: {},
  rotulosNasPortas: false,
  resultadoConexao: null,
};

export function reducerJogo(estado: EstadoJogo, acao: AcaoJogo): EstadoJogo {
  switch (acao.tipo) {
    case 'iniciar':
      return {
        fase: 'identificar',
        partida: acao.partida,
        indice: 0,
        pontos: 0,
        tentativasIdentificacao: 0,
        tentativasConexao: 0,
        opcoesErradas: [],
        conexoes: {},
        rotulosNasPortas: acao.rotulosNasPortas,
        resultadoConexao: null,
      };
    case 'escolherOpcao': {
      if (estado.fase !== 'identificar') return estado;
      const id = estado.partida.ordem[estado.indice];
      if (!id) return estado;
      const peca = pecaPorId(id);
      const opcoes = estado.partida.opcoes[id];
      if (!opcoes?.includes(acao.nome)) return estado;

      if (acao.nome === peca.nome) {
        return {
          ...estado,
          fase: 'identificado',
          pontos: estado.pontos + pontosIdentificacao(estado.tentativasIdentificacao),
        };
      }
      if (estado.opcoesErradas.includes(acao.nome)) return estado;
      return {
        ...estado,
        tentativasIdentificacao: estado.tentativasIdentificacao + 1,
        opcoesErradas: [...estado.opcoesErradas, acao.nome],
      };
    }
    case 'continuar':
      if (estado.fase !== 'identificado') return estado;
      return { ...estado, fase: 'conectar', tentativasConexao: 0, resultadoConexao: null };
    case 'soltarCabo': {
      if (estado.fase !== 'conectar') return estado;
      if (acao.portaId === null) {
        return { ...estado, resultadoConexao: { tipo: 'sem-porta' } };
      }
      if (Object.values(estado.conexoes).includes(acao.portaId)) {
        return { ...estado, resultadoConexao: { tipo: 'porta-ocupada' } };
      }
      const porta = PORTAS.find((item) => item.id === acao.portaId);
      if (!porta) return estado;
      const id = estado.partida.ordem[estado.indice];
      if (!id) return estado;
      const peca = pecaPorId(id);
      if (porta.tipo !== peca.tipoPorta) {
        return {
          ...estado,
          tentativasConexao: estado.tentativasConexao + 1,
          resultadoConexao: { tipo: 'porta-errada', tipoPortaTocada: porta.tipo },
        };
      }
      const pontosGanhos = pontosConexao(estado.tentativasConexao);
      return {
        ...estado,
        fase: 'conectado',
        pontos: estado.pontos + pontosGanhos,
        conexoes: { ...estado.conexoes, [id]: acao.portaId },
        resultadoConexao: { tipo: 'acertou', pontosGanhos },
      };
    }
    case 'proximaPeca':
      if (estado.fase !== 'conectado') return estado;
      if (estado.indice >= estado.partida.ordem.length - 1) return { ...estado, fase: 'fim' };
      return {
        ...estado,
        fase: 'identificar',
        indice: estado.indice + 1,
        tentativasIdentificacao: 0,
        tentativasConexao: 0,
        opcoesErradas: [],
        resultadoConexao: null,
      };
    default: {
      const acaoInvalida: never = acao;
      return acaoInvalida;
    }
  }
}
