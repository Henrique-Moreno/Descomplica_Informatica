# Aplicação Web

Aplicação do InfoQuest feita com Vite, React e TypeScript.

## Arquitetura

```text
src/
├─ main.tsx                    Monta o React na página.
├─ app/
│  └─ App.tsx                  Componente raiz que compõe a aplicação.
├─ features/
│  └─ jogo/
│     ├─ components/           Componentes de tela do jogo.
│     ├─ hooks/                Lógica de interação, como arrastar o cabo.
│     ├─ model/                Tipos e reducer, sem React e sem SVG.
│     ├─ data/                 Dados das peças e das portas.
│     └─ index.ts              Única API pública da feature.
└─ shared/
   ├─ ui/                      Componentes genéricos, como Botao e Modal.
   └─ lib/                     Funções utilitárias compartilhadas.
```

### Regras de dependência

- `shared` não importa de `features`.
- `model` não importa React.
- Uma feature só expõe para outras partes do app o que está no seu `index.ts`.
- Componentes só desenham; a lógica fica em hooks e no `model`.

### Convenções de nome

- Componentes: `PascalCase.tsx`.
- Hooks: `useAlgo.ts`.
- Demais arquivos: `camelCase.ts`.
- Testes ao lado do arquivo testado, com o formato `algo.test.ts`.
- Nomes do domínio em português.
- Use exports nomeados na própria declaração; não use `export default`, exceto em arquivos de configuração.
- Estilo: CSS Modules por componente e variáveis globais em `src/app/estilos/tokens.css`.
- SVG: gradientes e filtros ficam em `DefinicoesSvg`, renderizado uma vez no `App`; ids usam o prefixo `iq-`.
- O tema oferece Automático, Claro e Escuro; a escolha é salva localmente e o automático segue o tema do sistema.

## Mesa

A mesa é uma cena SVG única com viewBox de 960×600. A geometria fica em `components/mesa/geometria.ts`; os desenhos das peças usam coordenadas locais e a mesa os posiciona. O acerto do cabo será calculado por distância, por isso as portas não capturam o ponteiro.
