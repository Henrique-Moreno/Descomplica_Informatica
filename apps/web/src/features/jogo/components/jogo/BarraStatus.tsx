import { progressoDaPartida } from '../../model/seletores';
import type { EstadoJogo } from '../../model/tipos';
import estilos from './BarraStatus.module.css';

interface BarraStatusProps {
  readonly estado: EstadoJogo;
}

export function BarraStatus({ estado }: BarraStatusProps) {
  const progresso = progressoDaPartida(estado);
  return (
    <div className={estilos.status} aria-label="Progresso da partida">
      <span>
        Peça {progresso.atual} de {progresso.total}
      </span>
      <span>{estado.pontos} pontos</span>
    </div>
  );
}
