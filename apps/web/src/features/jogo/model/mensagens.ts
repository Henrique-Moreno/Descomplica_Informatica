import type { Peca, ResultadoConexao, TipoPorta } from './tipos';

export type TomMensagem = 'bom' | 'ruim' | 'neutro';

export interface MensagemFeedback {
  readonly tom: TomMensagem;
  readonly titulo: string;
  readonly detalhe: string;
}

export function descreverPorta(tipo: TipoPorta): string {
  switch (tipo) {
    case 'usb':
      return 'USB';
    case 'hdmi':
      return 'HDMI';
    case 'saidaAudio':
      return 'de saída de áudio (a verde)';
    case 'microfone':
      return 'de microfone (a rosa)';
  }
}

export function nomeComArtigo(peca: Peca, inicioDeFrase = false): string {
  const artigo = inicioDeFrase ? peca.artigo.toLocaleUpperCase('pt-BR') : peca.artigo;
  return `${artigo} ${peca.nome}`;
}

export function explicacaoDaPeca(peca: Peca): string {
  const direcao =
    peca.direcao === 'entrada'
      ? 'É uma peça de entrada: ela envia informação para o computador.'
      : peca.direcao === 'saida'
        ? 'É uma peça de saída: ela mostra ou toca o que o computador manda.'
        : 'É uma peça de entrada e saída: ela guarda e entrega arquivos do computador.';
  const destino =
    peca.destino === 'processador'
      ? ' A informação passa pelo processador, o cérebro do computador.'
      : ' Os arquivos ficam guardados no armazenamento.';
  return `${direcao}${destino}`;
}

export function mensagemIdentificacao(peca: Peca, pontosGanhos: number): MensagemFeedback {
  return {
    tom: 'bom',
    titulo: `Acertou! Eu sou ${nomeComArtigo(peca)}. +${pontosGanhos} pontos.`,
    detalhe: `Eu ${peca.frase}.`,
  };
}

export function mensagemConexao(
  peca: Peca,
  resultado: ResultadoConexao | null,
): MensagemFeedback | null {
  if (resultado === null) return null;
  switch (resultado.tipo) {
    case 'acertou':
      return {
        tom: 'bom',
        titulo: `Acertou! ${nomeComArtigo(peca, true)} liga numa porta ${descreverPorta(peca.tipoPorta)}. +${resultado.pontosGanhos} pontos.`,
        detalhe: explicacaoDaPeca(peca),
      };
    case 'porta-errada':
      return {
        tom: 'ruim',
        titulo: `Ops! ${nomeComArtigo(peca, true)} não liga numa porta ${descreverPorta(resultado.tipoPortaTocada)}.`,
        detalhe: 'Tente outra porta. Puxe o meu cabo até a porta certa do gabinete.',
      };
    case 'porta-ocupada':
      return {
        tom: 'ruim',
        titulo: 'Essa porta já está ocupada.',
        detalhe: 'Escolha outra porta.',
      };
    case 'sem-porta':
      return { tom: 'neutro', titulo: 'Leve o plugue até uma porta do gabinete.', detalhe: '' };
  }
}
