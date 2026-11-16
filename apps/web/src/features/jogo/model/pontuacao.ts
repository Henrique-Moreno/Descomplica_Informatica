const PONTOS_IDENTIFICACAO_PRIMEIRA = 5;
const PONTOS_IDENTIFICACAO_COM_ERRO = 2;
const PONTOS_CONEXAO_PRIMEIRA = 10;
const PONTOS_CONEXAO_SEGUNDA = 5;
const PONTOS_CONEXAO_DEMAIS = 2;
const PONTOS_POR_PECA = 15;
const LIMITE_TRES_ESTRELAS = 0.85;
const LIMITE_DUAS_ESTRELAS = 0.6;

export function pontosIdentificacao(tentativasErradas: number): number {
  return tentativasErradas === 0 ? PONTOS_IDENTIFICACAO_PRIMEIRA : PONTOS_IDENTIFICACAO_COM_ERRO;
}

export function pontosConexao(tentativasErradas: number): number {
  if (tentativasErradas === 0) return PONTOS_CONEXAO_PRIMEIRA;
  if (tentativasErradas === 1) return PONTOS_CONEXAO_SEGUNDA;
  return PONTOS_CONEXAO_DEMAIS;
}

export function pontuacaoMaxima(totalPecas: number): number {
  return totalPecas * PONTOS_POR_PECA;
}

export function estrelas(pontos: number, maximo: number): 1 | 2 | 3 {
  const proporcao = maximo > 0 ? pontos / maximo : 0;
  if (proporcao >= LIMITE_TRES_ESTRELAS) return 3;
  if (proporcao >= LIMITE_DUAS_ESTRELAS) return 2;
  return 1;
}
