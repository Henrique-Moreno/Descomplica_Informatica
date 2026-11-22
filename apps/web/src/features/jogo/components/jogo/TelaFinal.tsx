import { deveParabenizar, progressoDaPartida } from '../../model/seletores';
import { estrelas, pontuacaoMaxima } from '../../model/pontuacao';
import type { EstadoJogo } from '../../model/tipos';
import estilos from './TelaFinal.module.css';

interface TelaFinalProps {
  readonly estado: EstadoJogo;
  readonly onJogarDeNovo: () => void;
}

export function TelaFinal({ estado, onJogarDeNovo }: TelaFinalProps) {
  const progresso = progressoDaPartida(estado);
  const maximo = pontuacaoMaxima(progresso.total);
  const quantidadeEstrelas = estrelas(estado.pontos, maximo);

  return (
    <section className={estilos.tela} aria-labelledby="titulo-final">
      <h2 id="titulo-final">Partida concluída!</h2>
      <svg
        className={estilos.estrelas}
        viewBox="0 0 180 64"
        role="img"
        aria-label={`${quantidadeEstrelas} de 3 estrelas`}
      >
        {[0, 1, 2].map((indice) => (
          <path
            key={indice}
            className={indice < quantidadeEstrelas ? estilos.estrelaCheia : estilos.estrelaVazia}
            transform={`translate(${indice * 60 + 4} 2)`}
            d="M26 2 33 19 52 20 37 32 42 51 26 40 10 51 15 32 0 20 19 19Z"
          />
        ))}
      </svg>
      <p className={estilos.pontos}>
        {estado.pontos} de {maximo} pontos
      </p>
      <p className={estilos.mensagem}>
        {deveParabenizar(estado.pontos)
          ? 'Parabéns! Você mandou muito bem conectando as peças!'
          : 'Bom treino! Tente de novo para ganhar mais pontos.'}
      </p>
      <button type="button" onClick={onJogarDeNovo}>
        Jogar de novo
      </button>
    </section>
  );
}
