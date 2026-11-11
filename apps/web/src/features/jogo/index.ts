export type {
  AcaoJogo,
  DestinoInformacao,
  DirecaoInformacao,
  EstadoJogo,
  Fase,
  IdPeca,
  IdPorta,
  Partida,
  Peca,
  Porta,
  ResultadoConexao,
  TipoPorta,
} from './model/tipos';
export { PECAS } from './data/pecas';
export { PORTAS } from './data/portas';
export { criarPartida } from './model/partida';
export { estadoInicial, reducerJogo } from './model/jogo';
export { deveMostrarDicaDasPortas, pecaAtual, portasLivres, progresso } from './model/seletores';
export { estrelas, pontuacaoMaxima } from './model/pontuacao';
export { DefinicoesSvg } from './components/svg/DefinicoesSvg';
export { GaleriaPecas } from './components/galeria/GaleriaPecas';
