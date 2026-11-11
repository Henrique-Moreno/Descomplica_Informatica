import { DefinicoesSvg, Mesa } from '@/features/jogo';
import { BotaoTema } from '@/shared/ui/BotaoTema';
import estilos from './App.module.css';

export function App() {
  return (
    <main>
      <DefinicoesSvg />
      <header className={estilos.cabecalho}>
        <h1 className={estilos.titulo}>InfoQuest</h1>
        <BotaoTema />
      </header>
      {/* A mesa fica provisoriamente montada para conferência visual. */}
      <Mesa pecaAlvo="teclado" pecasLigadas={[]} conexoes={{}} estadoPortas={{}} mostrarRotulos />
    </main>
  );
}
