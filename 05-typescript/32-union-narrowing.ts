/* ============================================================================
   32 · UNIONES, LITERALES Y NARROWING
   Nivel 5 · TypeScript
   ----------------------------------------------------------------------------
   "Narrowing" (estrechar) es cómo TS va descartando posibilidades a medida
   que compruebas cosas. Es lo que hace que el editor sepa, dentro de un if,
   exactamente qué tienes entre manos.
   Corrige con:  npm run ts 32     ·    npm run tipos
   ============================================================================ */

import { falta } from '../lib/mini-test';
import type { Igual, Comprobar } from '../lib/tipos';


/* ############################################################################
   32.1  UNIÓN: "o esto o lo otro"
   ############################################################################

     type Id = number | string;
     let id: Id = 1;
     id = 'abc';                   // las dos valen

   ⚠ Mientras TS no sepa cuál de las dos es, SOLO te deja usar lo que tienen
     en común:

        function f(id: number | string) {
          id.toFixed(2);           // ✗ error: string no tiene toFixed
          id.toString();           // ✓ las dos lo tienen
        }

   Por eso hay que "estrechar" antes de usar:

        if (typeof id === 'number') id.toFixed(2);     // ✓ aquí ya es number
        else                        id.toUpperCase();  // ✓ aquí es string

   INTERSECCIÓN `&`: "esto Y lo otro a la vez"
        type Auditado = { creadoPor: string };
        type Usuario = { id: number } & Auditado;      // tiene los dos campos

   EJEMPLO --------------------------------------------------------------------
     function formatear(v: number | string): string {
       if (typeof v === 'number') return v.toFixed(2);
       return v.trim();
     }
   -------------------------------------------------------------------------- */

// E1. Declara `Id` como number o string.
export type Id = number;   // TODO

// E2. Devuelve el id como texto. Si es número, con 2 decimales.
// idATexto(5) -> '5.00' ;  idATexto(' ab ') -> 'ab'
export function idATexto(id: number | string): string {
  return falta();
}

// --- comprobación -----------------------------------------------------------
type _c1 = Comprobar<Igual<Id, number | string>>;
export type _comprobaciones1 = [_c1];



/* ############################################################################
   32.2  LAS CINCO FORMAS DE ESTRECHAR
   ############################################################################

   1) typeof            -> para tipos primitivos
        if (typeof x === 'string')
        ('string' | 'number' | 'boolean' | 'undefined' | 'function' | 'object')

   2) truthiness        -> descarta null y undefined
        if (usuario) usuario.nombre;

   3) === con literal   -> para uniones de literales
        if (estado === 'enviado')

   4) `in`              -> para objetos con campos distintos
        if ('permisos' in persona) persona.permisos;

   5) instanceof        -> para clases y Error / Date
        if (error instanceof Error) error.message;

   Y una extra, Array.isArray(x), para distinguir T de T[].

   ⚠ typeof null es 'object'. Para descartar null usa la forma 2 o
     `x !== null`.

   EJEMPLO --------------------------------------------------------------------
     function describir(v: string | number | null): string {
       if (v === null) return 'nada';
       if (typeof v === 'number') return `numero ${v}`;
       return `texto ${v}`;
     }
   -------------------------------------------------------------------------- */

// E3. Describe el valor: 'nada' si es null o undefined, 'numero X' si es
// número, 'texto X' si es texto.
// describir(null) -> 'nada' ;  describir(5) -> 'numero 5' ;  describir('a') -> 'texto a'
export function describir(v: string | number | null | undefined): string {
  return falta();
}

// E4. Si recibe un array, únelo con '-'. Si recibe un texto, devuélvelo igual.
// unir(['a','b']) -> 'a-b' ;  unir('abc') -> 'abc'
export function unir(v: string | string[]): string {
  return falta();
}

// E5. Devuelve el mensaje del error. Si no es un Error de verdad, devuelve
// 'error desconocido'. (Esto es literalmente lo que se escribe en cada catch.)
// mensajeDeError(new Error('uy')) -> 'uy' ;  mensajeDeError('x') -> 'error desconocido'
export function mensajeDeError(e: unknown): string {
  return falta();
}



/* ############################################################################
   32.3  UNIONES DISCRIMINADAS — el patrón más útil de TS
   ############################################################################
   Varios objetos que comparten un campo "etiqueta" con valor literal:

     type Resultado =
       | { estado: 'cargando' }
       | { estado: 'ok'; datos: string[] }
       | { estado: 'error'; mensaje: string };

     function mostrar(r: Resultado): string {
       switch (r.estado) {
         case 'cargando': return 'Cargando...';
         case 'ok':       return r.datos.join(', ');   // ✓ TS sabe que hay datos
         case 'error':    return r.mensaje;            // ✓ y aquí que hay mensaje
       }
     }

   El campo `estado` es el "discriminante": con él TS sabe cuál de las tres
   formas tienes, y te deja acceder SOLO a los campos de esa forma.

   Esto modela perfecto el estado de una pantalla y evita el clásico
   `if (cargando && !error && datos)`.

   EJEMPLO --------------------------------------------------------------------
     const r: Resultado = { estado: 'ok', datos: ['a'] };
     r.mensaje;         // ✗ error: en la forma 'ok' no existe mensaje
   -------------------------------------------------------------------------- */

// E6. Declara la unión discriminada `Peticion`:
//   { estado: 'cargando' }
//   { estado: 'ok', datos: string[] }
//   { estado: 'error', mensaje: string }
export type Peticion = { estado: 'cargando' };   // TODO: agrega las otras dos

// E7. Devuelve el texto a mostrar según el estado:
//   cargando -> 'Cargando...'
//   ok       -> los datos unidos por ', '
//   error    -> el mensaje
export function mostrar(p: Peticion): string {
  return falta();
}

// E8. Devuelve true solo si la petición terminó (ok o error).
export function termino(p: Peticion): boolean {
  return falta();
}



/* ############################################################################
   32.4  TYPE GUARDS PROPIOS: `x is Tipo`
   ############################################################################
   Cuando la comprobación es tuya, TS no la entiende sola. Se lo dices con
   `parametro is Tipo`:

     interface Gato { maulla: () => void }
     interface Perro { ladra: () => void }

     function esGato(a: Gato | Perro): a is Gato {
       return 'maulla' in a;
     }

     if (esGato(animal)) animal.maulla();      // ✓ TS le cree

   El caso que más se usa: filtrar nulos de un array.

     const nombres = lista
       .map(u => u.nombre)                     // (string | null)[]
       .filter((n): n is string => n !== null);   // string[]  ✓

   Sin el `n is string`, el filter devolvería `(string | null)[]` y TS
   seguiría quejándose después.

   EJEMPLO --------------------------------------------------------------------
     function esTexto(v: unknown): v is string {
       return typeof v === 'string';
     }
   -------------------------------------------------------------------------- */

// E9. Type guard: true si el valor es un número (y díselo a TS).
export function esNumero(v: unknown): v is number {
  return falta();
}

// E10. Quita los null de la lista y devuelve string[].
// sinNulos(['a', null, 'b']) -> ['a','b']
export function sinNulos(lista: (string | null)[]): string[] {
  return falta();
}

// E11. Suma solo los valores que sean números, ignorando el resto.
// sumarNumeros([1,'a',2]) -> 3
export function sumarNumeros(lista: unknown[]): number {
  return falta();
}



/* ############################################################################
   32.5  EXHAUSTIVIDAD: que no se te escape un caso
   ############################################################################
   Truco para que TS te avise si agregas un estado nuevo y te olvidas de
   manejarlo:

     function color(estado: Estado): string {
       switch (estado) {
         case 'pendiente': return 'gris';
         case 'enviado':   return 'azul';
         default:
           const nunca: never = estado;     // ✗ error si quedó algún caso
           return nunca;
       }
     }

   Si mañana alguien agrega `'cancelado'` a Estado, esta función deja de
   compilar y te obliga a agregar el caso. Es gratis y salva muchos bugs.
   -------------------------------------------------------------------------- */

export type EstadoPedido = 'pendiente' | 'enviado' | 'entregado';

// E12. Devuelve el color de cada estado, cubriendo TODOS los casos:
//   pendiente -> 'gris' ; enviado -> 'azul' ; entregado -> 'verde'
export function color(estado: EstadoPedido): string {
  return falta();
}


/* ============================================================================
   SOLUCIONES
   ----------------------------------------------------------------------------
   E1   export type Id = number | string;
   E2   if (typeof id === 'number') return id.toFixed(2);
        return id.trim();
   E3   if (v === null || v === undefined) return 'nada';
        if (typeof v === 'number') return `numero ${v}`;
        return `texto ${v}`;
   E4   return Array.isArray(v) ? v.join('-') : v;
   E5   return e instanceof Error ? e.message : 'error desconocido';
   E6   export type Peticion =
          | { estado: 'cargando' }
          | { estado: 'ok'; datos: string[] }
          | { estado: 'error'; mensaje: string };
   E7   switch (p.estado) {
          case 'cargando': return 'Cargando...';
          case 'ok': return p.datos.join(', ');
          case 'error': return p.mensaje;
        }
   E8   return p.estado !== 'cargando';
   E9   return typeof v === 'number';
   E10  return lista.filter((n): n is string => n !== null);
   E11  return lista.filter(esNumero).reduce((t, n) => t + n, 0);
   E12  switch (estado) {
          case 'pendiente': return 'gris';
          case 'enviado': return 'azul';
          case 'entregado': return 'verde';
          default: {
            const nunca: never = estado;
            return nunca;
          }
        }
   ============================================================================ */
