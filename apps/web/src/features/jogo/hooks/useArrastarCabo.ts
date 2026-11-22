import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import type { EstadoJogo, IdPeca, IdPorta, Peca } from '../model/tipos';
import { portaAceita } from '../model/seletores';
import { ANCORA_CABO, ladoDoPlugue, type Ponto } from '../components/mesa/geometria';
import {
  interpolar,
  pontaDoPlugue,
  posicionarPlugue,
  portaMaisProxima,
} from '../components/mesa/arrasto';
import { coordenadasDaMesa } from '../components/mesa/coordenadas';

export interface ArrastoAtivo {
  readonly peca: IdPeca;
  readonly origem: Ponto;
  readonly lado: 1 | -1;
}

export interface ControleDeArrasto {
  readonly arrasto: ArrastoAtivo | null;
  readonly aoComecar: (id: IdPeca, evento: ReactPointerEvent<SVGElement>) => void;
  readonly aoMover: (evento: ReactPointerEvent<SVGElement>) => void;
  readonly aoTerminar: (evento: ReactPointerEvent<SVGElement>) => void;
  readonly aoCancelar: (evento: ReactPointerEvent<SVGElement>) => void;
}

interface OpcoesArrasto {
  readonly estado: EstadoJogo;
  readonly pecaAtual: Peca | null;
  readonly aoSoltar: (portaId: IdPorta | null) => void;
}

export function useArrastarCabo({ estado, pecaAtual, aoSoltar }: OpcoesArrasto): ControleDeArrasto {
  const [arrasto, setArrasto] = useState<ArrastoAtivo | null>(null);
  const arrastoRef = useRef<ArrastoAtivo | null>(null);
  const estadoRef = useRef(estado);
  const pecaRef = useRef(pecaAtual);
  const aoSoltarRef = useRef(aoSoltar);
  const ponteiroIdRef = useRef<number | null>(null);
  const elementoCapturaRef = useRef<SVGElement | null>(null);
  const quadroMovimentoRef = useRef<number | null>(null);
  const quadroRetornoRef = useRef<number | null>(null);
  const retornandoRef = useRef(false);

  useLayoutEffect(() => {
    estadoRef.current = estado;
    pecaRef.current = pecaAtual;
    aoSoltarRef.current = aoSoltar;
  }, [aoSoltar, estado, pecaAtual]);

  const atualizarArrasto = useCallback((proximo: ArrastoAtivo | null) => {
    arrastoRef.current = proximo;
    setArrasto(proximo);
  }, []);

  const coordenadasDoEvento = useCallback((evento: ReactPointerEvent<SVGElement>): Ponto | null => {
    const svg = evento.currentTarget.ownerSVGElement;
    return svg ? coordenadasDaMesa(evento.clientX, evento.clientY, svg) : null;
  }, []);

  const liberarPonteiro = useCallback((evento: ReactPointerEvent<SVGElement>) => {
    const elemento = evento.currentTarget;
    if (elemento.hasPointerCapture(evento.pointerId)) {
      elemento.releasePointerCapture(evento.pointerId);
    }
    ponteiroIdRef.current = null;
    elementoCapturaRef.current = null;
  }, []);

  const agendarRetorno = useCallback(
    (atual: ArrastoAtivo) => {
      const ancora = ANCORA_CABO[atual.peca];
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        retornandoRef.current = false;
        atualizarArrasto(null);
        return;
      }

      retornandoRef.current = true;
      let inicio: number | null = null;
      const animar = (agora: number) => {
        if (inicio === null) inicio = agora;
        const proporcao = Math.min((agora - inicio) / 450, 1);
        const facilidade = 1 - (1 - proporcao) ** 3;
        const origem = interpolar(atual.origem, ancora, facilidade);
        atualizarArrasto({ peca: atual.peca, origem, lado: ladoDoPlugue(origem[0]) });
        if (proporcao < 1) {
          quadroRetornoRef.current = requestAnimationFrame(animar);
        } else {
          quadroRetornoRef.current = null;
          retornandoRef.current = false;
          atualizarArrasto(null);
        }
      };
      quadroRetornoRef.current = requestAnimationFrame(animar);
    },
    [atualizarArrasto],
  );

  const aoComecar = useCallback(
    (id: IdPeca, evento: ReactPointerEvent<SVGElement>) => {
      if (
        retornandoRef.current ||
        arrastoRef.current !== null ||
        estadoRef.current.fase !== 'conectar' ||
        pecaRef.current?.id !== id
      ) {
        return;
      }
      const ponto = coordenadasDoEvento(evento);
      if (!ponto) return;
      evento.preventDefault();
      evento.currentTarget.setPointerCapture(evento.pointerId);
      ponteiroIdRef.current = evento.pointerId;
      elementoCapturaRef.current = evento.currentTarget;
      const posicao = posicionarPlugue(ponto);
      atualizarArrasto({ peca: id, ...posicao });
    },
    [atualizarArrasto, coordenadasDoEvento],
  );

  const aoMover = useCallback(
    (evento: ReactPointerEvent<SVGElement>) => {
      if (ponteiroIdRef.current !== evento.pointerId) return;
      const ponto = coordenadasDoEvento(evento);
      if (!ponto || !arrastoRef.current) return;
      const posicao = posicionarPlugue(ponto);
      const atual = arrastoRef.current;
      if (quadroMovimentoRef.current !== null) cancelAnimationFrame(quadroMovimentoRef.current);
      quadroMovimentoRef.current = requestAnimationFrame(() => {
        quadroMovimentoRef.current = null;
        if (ponteiroIdRef.current === evento.pointerId) {
          atualizarArrasto({ peca: atual.peca, ...posicao });
        }
      });
    },
    [atualizarArrasto, coordenadasDoEvento],
  );

  const aoTerminar = useCallback(
    (evento: ReactPointerEvent<SVGElement>) => {
      if (ponteiroIdRef.current !== evento.pointerId) return;
      const atual = arrastoRef.current;
      if (!atual) return;
      const ponto = coordenadasDoEvento(evento);
      if (quadroMovimentoRef.current !== null) {
        cancelAnimationFrame(quadroMovimentoRef.current);
        quadroMovimentoRef.current = null;
      }
      const final = ponto ? { peca: atual.peca, ...posicionarPlugue(ponto) } : atual;
      atualizarArrasto(final);
      liberarPonteiro(evento);
      const portaId = portaMaisProxima(pontaDoPlugue(final.origem, final.lado));
      aoSoltarRef.current(portaId);
      if (portaAceita(estadoRef.current, portaId)) {
        retornandoRef.current = false;
        atualizarArrasto(null);
      } else {
        agendarRetorno(final);
      }
    },
    [agendarRetorno, atualizarArrasto, coordenadasDoEvento, liberarPonteiro],
  );

  const aoCancelar = useCallback(
    (evento: ReactPointerEvent<SVGElement>) => {
      if (ponteiroIdRef.current !== evento.pointerId) return;
      const atual = arrastoRef.current;
      if (quadroMovimentoRef.current !== null) {
        cancelAnimationFrame(quadroMovimentoRef.current);
        quadroMovimentoRef.current = null;
      }
      liberarPonteiro(evento);
      if (atual) agendarRetorno(atual);
    },
    [agendarRetorno, liberarPonteiro],
  );

  useEffect(
    () => () => {
      if (quadroMovimentoRef.current !== null) cancelAnimationFrame(quadroMovimentoRef.current);
      if (quadroRetornoRef.current !== null) cancelAnimationFrame(quadroRetornoRef.current);
      const elemento = elementoCapturaRef.current;
      const id = ponteiroIdRef.current;
      if (elemento && id !== null && elemento.hasPointerCapture(id)) {
        elemento.releasePointerCapture(id);
      }
    },
    [],
  );

  return { arrasto, aoComecar, aoMover, aoTerminar, aoCancelar };
}
