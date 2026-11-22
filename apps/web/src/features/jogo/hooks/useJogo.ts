import { useCallback, useReducer } from 'react';
import { pecaPorId } from '../data/pecas';
import { estadoInicial, reducerJogo } from '../model/jogo';
import { criarPartida } from '../model/partida';
import type { IdPorta, Peca } from '../model/tipos';

export function useJogo() {
  const [estado, despachar] = useReducer(reducerJogo, estadoInicial);

  const idAtual = estado.partida.ordem[estado.indice];
  const emJogo = estado.fase !== 'inicio' && estado.fase !== 'fim';
  const pecaAtual: Peca | null = emJogo && idAtual ? pecaPorId(idAtual) : null;

  const iniciar = useCallback((rotulosNasPortas: boolean) => {
    despachar({ tipo: 'iniciar', partida: criarPartida(), rotulosNasPortas });
  }, []);
  const escolherOpcao = useCallback(
    (nome: string) => despachar({ tipo: 'escolherOpcao', nome }),
    [],
  );
  const continuar = useCallback(() => despachar({ tipo: 'continuar' }), []);
  const soltarCabo = useCallback(
    (portaId: IdPorta | null) => despachar({ tipo: 'soltarCabo', portaId }),
    [],
  );
  const proximaPeca = useCallback(() => despachar({ tipo: 'proximaPeca' }), []);
  const jogarDeNovo = useCallback(() => {
    despachar({
      tipo: 'iniciar',
      partida: criarPartida(),
      rotulosNasPortas: estado.rotulosNasPortas,
    });
  }, [estado.rotulosNasPortas]);

  return {
    estado,
    pecaAtual,
    iniciar,
    escolherOpcao,
    continuar,
    soltarCabo,
    proximaPeca,
    jogarDeNovo,
  };
}
