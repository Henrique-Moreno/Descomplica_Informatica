import { DefinicoesSvg, Mesa } from '@/features/jogo';

export function App() {
  return (
    <main>
      <DefinicoesSvg />
      <h1>InfoQuest</h1>
      {/* A mesa fica provisoriamente montada para conferência visual. */}
      <Mesa pecaAlvo="teclado" pecasLigadas={[]} conexoes={{}} estadoPortas={{}} mostrarRotulos />
    </main>
  );
}
