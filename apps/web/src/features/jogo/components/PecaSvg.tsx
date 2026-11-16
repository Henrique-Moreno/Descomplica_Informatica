import { DESENHOS_PECAS } from './pecas/desenhos';
import styles from './PecaSvg.module.css';
import type { IdPeca } from '../model/tipos';

interface PecaSvgProps {
  readonly id: IdPeca;
  readonly titulo?: string;
}

export function PecaSvg({ id, titulo }: PecaSvgProps) {
  const { Desenho, viewBox } = DESENHOS_PECAS[id];

  return (
    <svg
      className={styles.svg}
      viewBox={viewBox}
      role={titulo ? 'img' : undefined}
      aria-label={titulo}
      aria-hidden={titulo ? undefined : true}
    >
      <g filter="url(#iq-sombra)">
        <Desenho />
      </g>
    </svg>
  );
}
