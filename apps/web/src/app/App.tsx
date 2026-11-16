import { DefinicoesSvg, Jogo } from '@/features/jogo';
import { SeletorTema } from '@/shared/ui/SeletorTema';
import estilos from './App.module.css';

export function App() {
  return (
    <main>
      <DefinicoesSvg />
      <header className={estilos.cabecalho}>
        <h1 className={estilos.titulo}>InfoQuest</h1>
        <SeletorTema />
      </header>
      {/* A mesa fica provisoriamente montada para conferência visual. */}
      <Jogo />
    </main>
  );
}
