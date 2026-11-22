import { useLayoutEffect, useState } from 'react';
import { pecaPorId } from '../data/pecas';
import type { EstadoJogo, IdPeca } from '../model/tipos';
import {
  etapasDaViagem,
  pontoNaPolilinha,
  rotaDeIda,
  comprimento,
} from '../components/mesa/viagem';
import type { Destino } from '../components/mesa/viagem';
import type { Ponto } from '../components/mesa/geometria';

export interface Viagem {
  readonly peca: IdPeca;
  readonly ponto: Ponto | null;
  readonly destinoAceso: Destino | null;
}

interface EstadoAnimacao {
  readonly chave: EstadoJogo | null;
  readonly viagem: Viagem | null;
  readonly animando: boolean;
}

const TEMPO_LUZ_DESTINO = 300;
const TEMPO_LUZ_REDUZIDO = 600;
const VELOCIDADE_POR_MS = 0.4;
const DURACAO_MINIMA_TRECHO = 500;
const DURACAO_MAXIMA_TRECHO = 1400;

function duracaoTrecho(pontos: readonly Ponto[]): number {
  return Math.min(
    Math.max(comprimento(pontos) / VELOCIDADE_POR_MS, DURACAO_MINIMA_TRECHO),
    DURACAO_MAXIMA_TRECHO,
  );
}

export function useViagemDaInformacao(estado: EstadoJogo): {
  viagem: Viagem | null;
  animando: boolean;
} {
  const [animacao, setAnimacao] = useState<EstadoAnimacao>({
    chave: null,
    viagem: null,
    animando: false,
  });
  const { fase, indice } = estado;
  const ordem = estado.partida.ordem;
  const conexoes = estado.conexoes;
  const idPeca = ordem[indice];
  const idPorta = idPeca ? conexoes[idPeca] : undefined;
  const chave = fase === 'conectado' && idPeca && idPorta ? estado : null;

  useLayoutEffect(() => {
    let cancelada = false;
    let quadro: number | null = null;
    let temporizador: ReturnType<typeof setTimeout> | null = null;
    let resolverPausa: (() => void) | null = null;
    let resolverTrecho: (() => void) | null = null;

    const atualizar = (viagem: Viagem | null, ativa: boolean) => {
      if (!cancelada) setAnimacao({ chave: estado, viagem, animando: ativa });
    };
    const pausar = (duracao: number) =>
      new Promise<void>((resolver) => {
        resolverPausa = resolver;
        temporizador = setTimeout(() => {
          temporizador = null;
          resolverPausa = null;
          resolver();
        }, duracao);
      });

    if (fase === 'conectado' && idPeca && idPorta) {
      const peca = pecaPorId(idPeca);
      const destino = peca.destino;
      const etapas = etapasDaViagem(peca.direcao, rotaDeIda(idPeca, idPorta));
      const reduzirMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const animarTrecho = (pontos: Ponto[]) =>
        new Promise<void>((resolver) => {
          const duracao = duracaoTrecho(pontos);
          let inicio: number | null = null;
          resolverTrecho = resolver;

          const quadroSeguinte = (agora: number) => {
            if (cancelada) {
              quadro = null;
              resolverTrecho = null;
              resolver();
              return;
            }
            if (inicio === null) inicio = agora;
            const proporcao = Math.min((agora - inicio) / duracao, 1);
            atualizar(
              { peca: idPeca, ponto: pontoNaPolilinha(pontos, proporcao), destinoAceso: null },
              true,
            );
            if (proporcao >= 1) {
              quadro = null;
              resolverTrecho = null;
              resolver();
            } else {
              quadro = requestAnimationFrame(quadroSeguinte);
            }
          };
          quadro = requestAnimationFrame(quadroSeguinte);
        });

      const executar = async () => {
        if (reduzirMovimento) {
          atualizar({ peca: idPeca, ponto: null, destinoAceso: destino }, true);
          await pausar(TEMPO_LUZ_REDUZIDO);
          if (cancelada) return;
          atualizar(null, false);
          return;
        }

        let destinoJaAceso = false;
        for (const etapa of etapas) {
          const primeiro = etapa.pontos[0] ?? null;
          if (etapa.destinoAcesoNoInicio) {
            atualizar({ peca: idPeca, ponto: primeiro, destinoAceso: destino }, true);
            if (!destinoJaAceso) {
              await pausar(TEMPO_LUZ_DESTINO);
              if (cancelada) return;
            }
            destinoJaAceso = true;
            atualizar({ peca: idPeca, ponto: primeiro, destinoAceso: null }, true);
            destinoJaAceso = false;
          } else {
            atualizar({ peca: idPeca, ponto: primeiro, destinoAceso: null }, true);
          }

          await animarTrecho(etapa.pontos);
          if (cancelada) return;
          if (etapa.destinoAcesoNoFim) {
            atualizar(
              { peca: idPeca, ponto: etapa.pontos.at(-1) ?? null, destinoAceso: destino },
              true,
            );
            destinoJaAceso = true;
            await pausar(TEMPO_LUZ_DESTINO);
            if (cancelada) return;
          }
        }
        atualizar(null, false);
      };

      quadro = requestAnimationFrame(() => {
        quadro = null;
        if (cancelada) return;
        atualizar({ peca: idPeca, ponto: null, destinoAceso: null }, true);
        void executar();
      });
    }

    return () => {
      cancelada = true;
      if (quadro !== null) cancelAnimationFrame(quadro);
      if (temporizador !== null) clearTimeout(temporizador);
      resolverPausa?.();
      resolverTrecho?.();
    };
  }, [estado, fase, indice, idPeca, idPorta]);

  if (!chave || !idPeca) return { viagem: null, animando: false };
  if (animacao.chave !== chave) {
    return { viagem: { peca: idPeca, ponto: null, destinoAceso: null }, animando: true };
  }
  return { viagem: animacao.viagem, animando: animacao.animando };
}
