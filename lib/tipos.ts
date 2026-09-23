// Herramientas para comprobar TIPOS (no valores). No necesitas tocar este archivo.
//
//   type _ = Comprobar<Igual<MiTipo, string>>;
//
// Si MiTipo no es exactamente string, TypeScript te marca ESA linea en rojo
// y `npm run tipos` falla. Si esta bien, no dice nada.

export type Igual<A, B> =
  (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false;

export type Comprobar<T extends true> = T;
