// Tipos del mini framework de tests, para que TypeScript entienda lib/mini-test.js.
// No necesitas tocar este archivo.

export interface Afirmacion<T> {
  /** Compara el valor con el esperado (compara arrays y objetos por contenido). */
  aSer(esperado: T): void;
  /** Comprueba con una funcion propia. */
  cumple(fn: (valor: T) => boolean, mensaje: string): void;
}

export declare function grupo(nombre: string, fn: () => void): void;
export declare function prueba(descripcion: string, fn: () => void | Promise<void>): void;
export declare function esperar<T>(actual: T): Afirmacion<T>;
export declare function usar<T>(valor: T): NonNullable<T>;
export declare function cuerpoVacio(fn: Function): boolean;
/** Marca la prueba como PENDIENTE a mano. */
export declare function pendiente(): never;
/** Se escribe dentro de un ejercicio sin resolver: `return falta();` */
export declare function falta(): never;

export declare const estado: {
  grupos: Array<{ nombre: string; pruebas: Array<{ descripcion: string; estado: string; detalle: string }> }>;
  enCurso: Promise<unknown>[];
};
