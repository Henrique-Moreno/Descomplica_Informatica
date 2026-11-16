import { useMemo } from 'react';
import { calcularEstadoPortas } from '../mesa/estadoDasPortas';
import { Mesa } from '../mesa/Mesa';
import { useJogo } from '../../hooks/useJogo';
import { useArrastarCabo } from '../../hooks/useArrastarCabo';
import { BarraPergunta } from './BarraPergunta';
import { BarraStatus } from './BarraStatus';
import { ModalIdentificar } from './ModalIdentificar';
import { TelaFinal } from './TelaFinal';
import { TelaInicio } from './TelaInicio';
import estilos from './Jogo.module.css';

export function Jogo() {
  const jogo = useJogo();
  const { estado, pecaAtual } = jogo;
  const controleDeArrasto = useArrastarCabo({
    estado,
    pecaAtual,
    aoSoltar: jogo.soltarCabo,
  });
  const pecasLigadas = useMemo(
    () => estado.partida.ordem.filter((id) => estado.conexoes[id] !== undefined),
    [estado.partida.ordem, estado.conexoes],
  );
  const estadoDasPortas = useMemo(() => calcularEstadoPortas(estado), [estado]);

  if (estado.fase === 'inicio') return <TelaInicio onIniciar={jogo.iniciar} />;
  if (estado.fase === 'fim') return <TelaFinal estado={estado} onJogarDeNovo={jogo.jogarDeNovo} />;
  if (!pecaAtual) return null;

  const emConexao = estado.fase === 'conectar' || estado.fase === 'conectado';
  return (
    <section className={estilos.jogo} aria-label="Partida InfoQuest">
      <BarraStatus estado={estado} />
      {emConexao && (
        <BarraPergunta estado={estado} peca={pecaAtual} onProximaPeca={jogo.proximaPeca} />
      )}
      <Mesa
        pecaAlvo={estado.fase === 'conectar' ? pecaAtual.id : null}
        pecasLigadas={pecasLigadas}
        conexoes={estado.conexoes}
        estadoPortas={estadoDasPortas}
        mostrarRotulos={estado.rotulosNasPortas}
        aoEscolherPorta={estado.fase === 'conectar' ? jogo.soltarCabo : undefined}
        controleDeArrasto={estado.fase === 'conectar' ? controleDeArrasto : undefined}
      />
      {(estado.fase === 'identificar' || estado.fase === 'identificado') && (
        <ModalIdentificar
          estado={estado}
          peca={pecaAtual}
          onEscolher={jogo.escolherOpcao}
          onContinuar={jogo.continuar}
        />
      )}
    </section>
  );
}
