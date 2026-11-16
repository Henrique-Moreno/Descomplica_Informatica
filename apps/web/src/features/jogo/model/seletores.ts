import { PORTAS } from '@/features/jogo/data/portas';
import { pecaPorId } from '@/features/jogo/data/pecas';
import type { EstadoJogo, IdPorta, Peca, Porta } from './tipos';

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
