import { useEffect, useRef } from 'react';
import { PecaSvg } from '../PecaSvg';
import { mensagemIdentificacao } from '../../model/mensagens';
import { pontosIdentificacao } from '../../model/pontuacao';
import type { EstadoJogo, Peca } from '../../model/tipos';
import estilos from './ModalIdentificar.module.css';

interface ModalIdentificarProps {
  readonly estado: EstadoJogo;
  readonly peca: Peca;
  readonly onEscolher: (nome: string) => void;
  readonly onContinuar: () => void;
}

export function ModalIdentificar({ estado, peca, onEscolher, onContinuar }: ModalIdentificarProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const identificado = estado.fase === 'identificado';
  const feedback = identificado
    ? mensagemIdentificacao(peca, pontosIdentificacao(estado.tentativasIdentificacao))
    : null;

  useEffect(() => {
    const dialogo = dialogRef.current;
    if (dialogo && !dialogo.open) dialogo.showModal();
    return () => {
      if (dialogo?.open) dialogo.close();
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className={estilos.modal}
      aria-labelledby="titulo-identificar"
      onCancel={(evento) => evento.preventDefault()}
    >
      <div className={estilos.conteudo}>
        <h2 id="titulo-identificar">Que peça eu sou?</h2>
        <div className={estilos.ilustracao}>
          <PecaSvg id={peca.id} />
        </div>
        <div className={estilos.opcoes}>
          {estado.partida.opcoes[peca.id].map((nome) => {
            const errada = estado.opcoesErradas.includes(nome);
            const certa = identificado && nome === peca.nome;
            return (
              <button
                key={nome}
                className={`${estilos.opcao} ${errada ? estilos.errada : ''} ${certa ? estilos.certa : ''}`}
                type="button"
                disabled={errada || identificado}
                onClick={() => onEscolher(nome)}
              >
                <span>{nome}</span>
                {errada && <span aria-hidden="true">✕</span>}
                {certa && <span aria-hidden="true">✓</span>}
              </button>
            );
          })}
        </div>
        <div className={estilos.feedback} aria-live="polite" aria-atomic="true">
          {feedback && (
            <>
              <strong>{feedback.titulo}</strong>
              <p>{feedback.detalhe}</p>
            </>
          )}
        </div>
        {identificado && (
          <button className={estilos.continuar} type="button" autoFocus onClick={onContinuar}>
            Continuar
          </button>
        )}
      </div>
    </dialog>
  );
}
