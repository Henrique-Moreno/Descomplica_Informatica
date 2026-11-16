import { calcularEstadoPortas } from '../mesa/estadoDasPortas';
import { Mesa } from '../mesa/Mesa';
import { useJogo } from '../../hooks/useJogo';
import { BarraPergunta } from './BarraPergunta';
import { BarraStatus } from './BarraStatus';
import { ModalIdentificar } from './ModalIdentificar';
import { TelaFinal } from './TelaFinal';
import { TelaInicio } from './TelaInicio';
import estilos from './Jogo.module.css';

export function Jogo() {
  const jogo = useJogo();
  const { estado, pecaAtual } = jogo;

  if (estado.fase === 'inicio') return <TelaInicio onIniciar={jogo.iniciar} />;
  if (estado.fase === 'fim') return <TelaFinal estado={estado} onJogarDeNovo={jogo.jogarDeNovo} />;
  if (!pecaAtual) return null;

  const emConexao = estado.fase === 'conectar' || estado.fase === 'conectado';
  const pecasLigadas = estado.partida.ordem.filter((id) => estado.conexoes[id] !== undefined);

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
        estadoPortas={calcularEstadoPortas(estado)}
        mostrarRotulos={estado.rotulosNasPortas}
        aoEscolherPorta={estado.fase === 'conectar' ? jogo.soltarCabo : undefined}
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
