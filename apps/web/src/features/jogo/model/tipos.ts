export type IdPeca =
  'teclado' | 'mouse' | 'webcam' | 'pendrive' | 'monitor' | 'caixaDeSom' | 'fone' | 'microfone';

export type TipoPorta = 'usb' | 'hdmi' | 'saidaAudio' | 'microfone';

export type IdPorta = 'usb1' | 'usb2' | 'usb3' | 'usb4' | 'hdmi' | 'audio1' | 'audio2' | 'mic';

export type DirecaoInformacao = 'entrada' | 'saida' | 'entradaESaida';
export type DestinoInformacao = 'processador' | 'armazenamento';

export interface Peca {
  readonly id: IdPeca;
  readonly nome: string;
  readonly artigo: 'o' | 'a';
  readonly frase: string;
  readonly direcao: DirecaoInformacao;
  readonly tipoPorta: TipoPorta;
  readonly destino: DestinoInformacao;
  readonly descricao: string;
  readonly alternativas: readonly [string, string];
}

export interface Porta {
  readonly id: IdPorta;
  readonly tipo: TipoPorta;
}

export type Fase = 'inicio' | 'identificar' | 'identificado' | 'conectar' | 'conectado' | 'fim';

export type ResultadoConexao =
  | { readonly tipo: 'sem-porta' }
  | { readonly tipo: 'porta-ocupada'; readonly portaId: IdPorta }
  | {
      readonly tipo: 'porta-errada';
      readonly portaId: IdPorta;
      readonly tipoPortaTocada: TipoPorta;
    }
  | { readonly tipo: 'acertou'; readonly pontosGanhos: number };

export interface Partida {
  readonly ordem: readonly IdPeca[];
  readonly opcoes: Readonly<Record<IdPeca, readonly string[]>>;
}

export interface EstadoJogo {
  readonly fase: Fase;
  readonly partida: Partida;
  readonly indice: number;
  readonly pontos: number;
  readonly tentativasIdentificacao: number;
  readonly tentativasConexao: number;
  readonly opcoesErradas: readonly string[];
  readonly conexoes: Readonly<Partial<Record<IdPeca, IdPorta>>>;
  readonly rotulosNasPortas: boolean;
  readonly resultadoConexao: ResultadoConexao | null;
}

export type AcaoJogo =
  | { readonly tipo: 'iniciar'; readonly partida: Partida; readonly rotulosNasPortas: boolean }
  | { readonly tipo: 'escolherOpcao'; readonly nome: string }
  | { readonly tipo: 'continuar' }
  | { readonly tipo: 'soltarCabo'; readonly portaId: IdPorta | null }
  | { readonly tipo: 'proximaPeca' };
