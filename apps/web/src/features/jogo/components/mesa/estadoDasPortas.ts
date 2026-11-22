import type { EstadoJogo, IdPorta } from '../../model/tipos';
import { portasEmDestaque } from '../../model/seletores';
import type { EstadoPorta } from './portas/PortaSvg';

export function calcularEstadoPortas(estado: EstadoJogo): Partial<Record<IdPorta, EstadoPorta>> {
  const estados: Partial<Record<IdPorta, EstadoPorta>> = {};
  for (const portaId of Object.values(estado.conexoes)) {
    if (portaId) estados[portaId] = 'usada';
  }
  if (estado.resultadoConexao?.tipo === 'porta-errada') {
    estados[estado.resultadoConexao.portaId] = 'errada';
  }
  for (const portaId of portasEmDestaque(estado)) {
    if (estados[portaId] !== 'usada' && estados[portaId] !== 'errada') estados[portaId] = 'dica';
  }
  return estados;
}
