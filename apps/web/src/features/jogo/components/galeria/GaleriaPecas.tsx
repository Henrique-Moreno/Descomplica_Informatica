import { PECAS } from '../../data/pecas';
import { PecaSvg } from '../PecaSvg';
import styles from './GaleriaPecas.module.css';

export function GaleriaPecas() {
  return (
    <section aria-label="Galeria temporária das peças">
      <ul className={styles.lista}>
        {PECAS.map((peca) => (
          <li className={styles.cartao} key={peca.id}>
            <div className={styles.areaDesenho}>
              <PecaSvg id={peca.id} titulo={peca.nome} />
            </div>
            <p className={styles.nome}>{peca.nome}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
