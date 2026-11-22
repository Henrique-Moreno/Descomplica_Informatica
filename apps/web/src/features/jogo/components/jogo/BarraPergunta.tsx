import { mensagemConexao, nomeComArtigo } from '../../model/mensagens';
import { progressoDaPartida } from '../../model/seletores';
import type { EstadoJogo, Peca } from '../../model/tipos';
import estilos from './BarraPergunta.module.css';

interface BarraPerguntaProps {
  readonly estado: EstadoJogo;
  readonly peca: Peca;
  readonly podeAvancar: boolean;
  readonly onProximaPeca: () => void;
}

export function BarraPergunta({ estado, peca, podeAvancar, onProximaPeca }: BarraPerguntaProps) {
  const feedback = mensagemConexao(peca, estado.resultadoConexao);
  const progresso = progressoDaPartida(estado);
  const conectado = estado.fase === 'conectado';

  return (
    <section className={estilos.barra} aria-label="Conexão da peça">
      <h2>Eu sou {nomeComArtigo(peca)}. Em que lugar eu devo me conectar?</h2>
      <p className={estilos.instrucao}>
        Puxe o meu cabo até a porta certa do gabinete. Pelo teclado: Tab até a porta e Enter.
      </p>
      <div
        className={`${estilos.feedback} ${feedback ? estilos[feedback.tom] : ''}`}
        aria-live="polite"
        aria-atomic="true"
      >
        {feedback && (
          <>
            {feedback.tom !== 'neutro' && (
              <span className={estilos.icone} aria-hidden="true">
                {feedback.tom === 'bom' ? '✓' : '✕'}
              </span>
            )}
            <div>
              <strong>{feedback.titulo}</strong>
              {feedback.detalhe && <p>{feedback.detalhe}</p>}
            </div>
          </>
        )}
      </div>
      {conectado && !podeAvancar && (
        <p className={estilos.viajando} role="status" aria-live="polite">
          A informação está viajando…
        </p>
      )}
      {conectado && podeAvancar && (
        <button className={estilos.proxima} type="button" autoFocus onClick={onProximaPeca}>
          {progresso.atual === progresso.total ? 'Ver resultado' : 'Próxima peça'}
        </button>
      )}
    </section>
  );
}
