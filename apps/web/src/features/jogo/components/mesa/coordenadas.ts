import type { Ponto } from './geometria';

export function coordenadasDaMesa(
  clientX: number,
  clientY: number,
  svg: SVGSVGElement,
): Ponto | null {
  const matriz = svg.getScreenCTM();
  if (!matriz) return null;
  const ponto = new DOMPoint(clientX, clientY).matrixTransform(matriz.inverse());
  return [ponto.x, ponto.y];
}
