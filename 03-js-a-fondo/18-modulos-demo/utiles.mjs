// Módulo ESM de verdad (extensión .mjs). Esta es la sintaxis de Vue/Vite.
export const VERSION = '1.0';

export function mayus(texto) {
  return texto.toUpperCase();
}

export default function titulo(texto) {
  return `== ${texto} ==`;
}
