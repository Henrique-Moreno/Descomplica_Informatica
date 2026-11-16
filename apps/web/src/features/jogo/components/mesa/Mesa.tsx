import { memo } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { PECAS } from '../../data/pecas';
import { PORTAS } from '../../data/portas';
import type { ControleDeArrasto } from '../../hooks/useArrastarCabo';
import type { IdPeca, IdPorta, TipoPorta } from '../../model/tipos';
import { DESENHOS_PECAS } from '../pecas/desenhos';
import { Gabinete } from './Gabinete';
import {
  ALTURA_MESA,
  ANCORA_CABO,
  AREA_PECAS,
  ladoDoPlugue,
  LARGURA_MESA,
  POSICAO_PECAS,
  POSICAO_PORTAS,
} from './geometria';
import { PortaSvg } from './portas/PortaSvg';
import type { EstadoPorta } from './portas/PortaSvg';
import { PlugueSvg } from './plugues/PlugueSvg';
import { caminhoDoCabo } from './arrasto';
import estilos from './Mesa.module.css';

interface MesaProps {
  readonly pecaAlvo: IdPeca | null;
  readonly pecasLigadas: readonly IdPeca[];
  readonly conexoes: Partial<Record<IdPeca, IdPorta>>;
  readonly estadoPortas: Partial<Record<IdPorta, EstadoPorta>>;
  readonly mostrarRotulos: boolean;
  readonly aoEscolherPorta?: (portaId: IdPorta) => void;
  readonly controleDeArrasto?: ControleDeArrasto;
}

interface PecaNaMesaProps {
  readonly id: IdPeca;
  readonly estado: EstadoPorta | 'alvo' | 'apagada' | 'ligada';
  readonly interativa: boolean;
  readonly arrastando: boolean;
  readonly aoComecar?: ControleDeArrasto['aoComecar'];
  readonly aoMover?: ControleDeArrasto['aoMover'];
  readonly aoTerminar?: ControleDeArrasto['aoTerminar'];
  readonly aoCancelar?: ControleDeArrasto['aoCancelar'];
}

const PecaNaMesa = memo(function PecaNaMesa({
  id,
  estado,
  interativa,
  arrastando,
  aoComecar,
  aoMover,
  aoTerminar,
  aoCancelar,
}: PecaNaMesaProps) {
  const { Desenho } = DESENHOS_PECAS[id];
  const { x, y } = POSICAO_PECAS[id];
  const area = AREA_PECAS[id];
  return (
    <g
      data-peca={id}
      className={`${estilos.peca} ${estado === 'alvo' ? estilos.alvo : estado === 'ligada' ? estilos.ligada : estilos.apagada} ${interativa ? estilos.arrastavel : ''} ${arrastando ? estilos.emArrasto : ''}`}
    >
      <g transform={`translate(${x} ${y})`} filter="url(#iq-sombra)">
        <Desenho />
      </g>
      <rect
        x={area.x}
        y={area.y}
        width={area.largura}
        height={area.altura}
        fill="transparent"
        className={interativa ? estilos.areaArrastavel : undefined}
        onPointerDown={
          interativa && aoComecar
            ? (evento: ReactPointerEvent<SVGRectElement>) => aoComecar(id, evento)
            : undefined
        }
        onPointerMove={interativa ? aoMover : undefined}
        onPointerUp={interativa ? aoTerminar : undefined}
        onPointerCancel={interativa ? aoCancelar : undefined}
      />
    </g>
  );
});

const PortasMesa = memo(function PortasMesa({
  estadoPortas,
  mostrarRotulos,
}: {
  readonly estadoPortas: Partial<Record<IdPorta, EstadoPorta>>;
  readonly mostrarRotulos: boolean;
}) {
  return (
    <>
      {PORTAS.map((porta) => (
        <PortaSvg
          key={porta.id}
          id={porta.id}
          tipo={porta.tipo}
          estado={estadoPortas[porta.id] ?? 'livre'}
          mostrarRotulo={mostrarRotulos}
        />
      ))}
    </>
  );
});

const PecasMesa = memo(function PecasMesa({
  pecaAlvo,
  pecasLigadas,
  controle,
}: {
  readonly pecaAlvo: IdPeca | null;
  readonly pecasLigadas: readonly IdPeca[];
  readonly controle?: ControleDeArrasto;
}) {
  return (
    <>
      {PECAS.map((peca) => {
        const ativa = pecaAlvo === peca.id;
        const estado = ativa ? 'alvo' : pecasLigadas.includes(peca.id) ? 'ligada' : 'apagada';
        return (
          <PecaNaMesa
            key={peca.id}
            id={peca.id}
            estado={estado}
            interativa={ativa && controle !== undefined}
            arrastando={controle?.arrasto?.peca === peca.id}
            aoComecar={ativa ? controle?.aoComecar : undefined}
            aoMover={ativa ? controle?.aoMover : undefined}
            aoTerminar={ativa ? controle?.aoTerminar : undefined}
            aoCancelar={ativa ? controle?.aoCancelar : undefined}
          />
        );
      })}
    </>
  );
});

const CabosConectados = memo(function CabosConectados({
  conexoes,
}: {
  readonly conexoes: Partial<Record<IdPeca, IdPorta>>;
}) {
  return (
    <>
      {PECAS.map((peca) => {
        const portaId = conexoes[peca.id];
        if (!portaId) return null;
        return (
          <path
            key={peca.id}
            d={caminhoDoCabo(ANCORA_CABO[peca.id], POSICAO_PORTAS[portaId].entrada)}
            className={estilos.cabo}
          />
        );
      })}
    </>
  );
});

const PortasTocaveis = memo(function PortasTocaveis({
  aoEscolherPorta,
}: {
  readonly aoEscolherPorta: (portaId: IdPorta) => void;
}) {
  function rotuloPorta(tipo: TipoPorta, posicao: number): string {
    if (tipo === 'usb') return `Porta USB ${posicao}`;
    if (tipo === 'hdmi') return 'Porta HDMI';
    if (tipo === 'saidaAudio') return `Porta de áudio ${posicao}`;
    return 'Porta de microfone';
  }

  return (
    <>
      {PORTAS.map((porta) => {
        const [cx, cy] = POSICAO_PORTAS[porta.id].centro;
        const posicao =
          PORTAS.filter((item) => item.tipo === porta.tipo).findIndex(
            (item) => item.id === porta.id,
          ) + 1;
        return (
          <g
            key={porta.id}
            role="button"
            tabIndex={0}
            aria-label={rotuloPorta(porta.tipo, posicao)}
            className={estilos.alvoToque}
            onClick={() => aoEscolherPorta(porta.id)}
            onKeyDown={(evento) => {
              if (evento.key === 'Enter' || evento.key === ' ') {
                evento.preventDefault();
                aoEscolherPorta(porta.id);
              }
            }}
          >
            {porta.tipo === 'saidaAudio' || porta.tipo === 'microfone' ? (
              <circle className={estilos.zonaToque} cx={cx} cy={cy} r="24" />
            ) : (
              <rect
                className={estilos.zonaToque}
                x={cx - 28}
                y={cy - 16}
                width="56"
                height="32"
                rx="6"
              />
            )}
          </g>
        );
      })}
    </>
  );
});

export function Mesa({
  pecaAlvo,
  pecasLigadas,
  conexoes,
  estadoPortas,
  mostrarRotulos,
  aoEscolherPorta,
  controleDeArrasto,
}: MesaProps) {
  const arrasto = controleDeArrasto?.arrasto ?? null;
  return (
    <svg
      className={`${estilos.mesa} ${controleDeArrasto ? estilos.arrastavel : ''}`}
      viewBox={`0 0 ${LARGURA_MESA} ${ALTURA_MESA}`}
      role={aoEscolherPorta ? 'group' : 'img'}
      aria-label="Computador com portas e peças para ligar"
    >
      <rect width={LARGURA_MESA} height={ALTURA_MESA} rx="20" fill="var(--cor-mesa)" />
      <Gabinete />
      <PortasMesa estadoPortas={estadoPortas} mostrarRotulos={mostrarRotulos} />
      <PecasMesa pecaAlvo={pecaAlvo} pecasLigadas={pecasLigadas} controle={controleDeArrasto} />
      <g id="iq-cabos" className={estilos.semPonteiro}>
        <CabosConectados conexoes={conexoes} />
        {arrasto && (
          <path
            d={caminhoDoCabo(ANCORA_CABO[arrasto.peca], arrasto.origem)}
            className={estilos.cabo}
          />
        )}
      </g>
      <g className={estilos.semPonteiro}>
        {PECAS.map((peca) => {
          const portaId = conexoes[peca.id];
          const ancora = ANCORA_CABO[peca.id];
          const posicaoPorta = portaId ? POSICAO_PORTAS[portaId] : null;
          const ponto: readonly [number, number] = posicaoPorta?.entrada ?? [ancora[0], ancora[1]];
          const ativo = arrasto?.peca === peca.id;
          const [x, y] = ativo ? arrasto.origem : ponto;
          const lado = ativo ? arrasto.lado : (posicaoPorta?.lado ?? ladoDoPlugue(ancora[0]));
          return <PlugueSvg key={peca.id} tipo={peca.tipoPorta} x={x} y={y} lado={lado} />;
        })}
      </g>
      {/* Toque e teclado nas portas seguem como alternativa ao arrasto. */}
      {aoEscolherPorta && <PortasTocaveis aoEscolherPorta={aoEscolherPorta} />}
      <circle
        id="iq-ponto"
        className={estilos.semPonteiro}
        r="9"
        cx="-50"
        cy="-50"
        fill="#FFC93C"
        stroke="#1b2250"
        strokeWidth="3"
      />
    </svg>
  );
}
