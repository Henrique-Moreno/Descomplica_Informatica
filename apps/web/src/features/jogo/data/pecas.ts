import type { IdPeca, Peca } from '@/features/jogo/model/tipos';

export const PECAS: readonly Peca[] = [
  {
    id: 'teclado',
    nome: 'Teclado',
    artigo: 'o',
    direcao: 'entrada',
    tipoPorta: 'usb',
    destino: 'processador',
    descricao: 'envio letras e números para o computador',
    alternativas: ['Mouse', 'Monitor'],
  },
  {
    id: 'monitor',
    nome: 'Monitor',
    artigo: 'o',
    direcao: 'saida',
    tipoPorta: 'hdmi',
    destino: 'processador',
    descricao: 'mostro as imagens e os vídeos do computador',
    alternativas: ['Teclado', 'Caixa de som'],
  },
  {
    id: 'caixaDeSom',
    nome: 'Caixa de som',
    artigo: 'a',
    direcao: 'saida',
    tipoPorta: 'saidaAudio',
    destino: 'processador',
    descricao: 'espalho o som do computador pela sala',
    alternativas: ['Fone de ouvido', 'Microfone'],
  },
  {
    id: 'mouse',
    nome: 'Mouse',
    artigo: 'o',
    direcao: 'entrada',
    tipoPorta: 'usb',
    destino: 'processador',
    descricao: 'movo a setinha na tela',
    alternativas: ['Teclado', 'Webcam'],
  },
  {
    id: 'webcam',
    nome: 'Webcam',
    artigo: 'a',
    direcao: 'entrada',
    tipoPorta: 'usb',
    destino: 'processador',
    descricao: 'filmo você nas chamadas de vídeo',
    alternativas: ['Microfone', 'Monitor'],
  },
  {
    id: 'pendrive',
    nome: 'Pen drive',
    artigo: 'o',
    direcao: 'entradaESaida',
    tipoPorta: 'usb',
    destino: 'armazenamento',
    descricao: 'guardo os seus arquivos e caibo no bolso',
    alternativas: ['Carregador', 'Webcam'],
  },
  {
    id: 'fone',
    nome: 'Fone de ouvido',
    artigo: 'o',
    direcao: 'saida',
    tipoPorta: 'saidaAudio',
    destino: 'processador',
    descricao: 'deixo só você ouvir o som, sem incomodar a sala',
    alternativas: ['Caixa de som', 'Microfone'],
  },
  {
    id: 'microfone',
    nome: 'Microfone',
    artigo: 'o',
    direcao: 'entrada',
    tipoPorta: 'microfone',
    destino: 'processador',
    descricao: 'capto a sua voz e mando para o computador',
    alternativas: ['Fone de ouvido', 'Caixa de som'],
  },
];

export function pecaPorId(id: IdPeca): Peca {
  const peca = PECAS.find((item) => item.id === id);
  if (!peca) throw new Error(`Peça desconhecida: ${id}`);
  return peca;
}
