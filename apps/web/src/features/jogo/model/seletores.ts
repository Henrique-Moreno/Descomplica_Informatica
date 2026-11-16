import { PORTAS } from '@/features/jogo/data/portas';
import { pecaPorId } from '@/features/jogo/data/pecas';
import type { EstadoJogo, IdPorta, Peca, Porta } from './tipos';
import { PONTUACAO_MAXIMA } from './pontuacao';

export function pecaAtual(estado: EstadoJogo): Peca | null {
  const id = estado.partida.ordem[estado.indice];
  return id ? pecaPorId(id) : null;
}

export function portasLivres(estado: EstadoJogo): readonly Porta[] {
  const ocupadas = new Set<IdPorta>(Object.values(estado.conexoes));
  return PORTAS.filter((porta) => !ocupadas.has(porta.id));
}

export function deveMostrarDicaDasPortas(estado: EstadoJogo): boolean {
  return estado.fase === 'conectar' && estado.tentativasConexao >= 2;
}

export function progresso(estado: EstadoJogo): { readonly atual: number; readonly total: number } {
  return {
    atual: Math.min(estado.indice + 1, estado.partida.ordem.length),
    total: estado.partida.ordem.length,
  };
}

export function portasEmDestaque(estado: EstadoJogo): readonly IdPorta[] {
  if (!deveMostrarDicaDasPortas(estado)) return [];
  const peca = pecaAtual(estado);
  if (!peca) return [];
  const ocupadas = new Set<IdPorta>(Object.values(estado.conexoes));
  return PORTAS.filter((porta) => porta.tipo === peca.tipoPorta && !ocupadas.has(porta.id)).map(
    (porta) => porta.id,
  );
}

export function progressoDaPartida(estado: EstadoJogo): { atual: number; total: number } {
  return { atual: estado.indice + 1, total: estado.partida.ordem.length };
}

export function deveParabenizar(pontos: number): boolean {
  return pontos >= PONTUACAO_MAXIMA * 0.7;
}

export function portaAceita(estado: EstadoJogo, portaId: IdPorta | null): boolean {
  if (estado.fase !== 'conectar' || portaId === null) return false;
  if (Object.values(estado.conexoes).includes(portaId)) return false;
  const peca = pecaAtual(estado);
  const porta = PORTAS.find((item) => item.id === portaId);
  return peca !== null && porta !== undefined && porta.tipo === peca.tipoPorta;
}
