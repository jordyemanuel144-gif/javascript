/* ============================================================================
   28 · TYPESCRIPT: TIPOS BÁSICOS
   Nivel 5 · TypeScript
   ----------------------------------------------------------------------------
   TypeScript es JavaScript + una capa de tipos que se revisa ANTES de ejecutar.
   Al compilar, los tipos se borran: lo que corre en el navegador es JS normal.
   No aprendes un lenguaje nuevo: aprendes a ANOTAR el que ya sabes.

   Cómo se corrige este nivel:
     npm run ts 28      -> ejecuta los ejercicios (PASA / FALLA / PENDIENTE)
     npm run tipos      -> revisa solo los TIPOS, sin ejecutar nada

   Los ejercicios sin resolver dicen `return falta();`. Bórralo y escribe tu
   solución.
   ============================================================================ */

import { falta } from '../lib/mini-test';
import type { Igual, Comprobar } from '../lib/tipos';


/* ############################################################################
   28.1  ANOTAR UNA VARIABLE
   ############################################################################

     let nombre: string = 'Ana';
     let edad: number = 30;
     let activo: boolean = true;

   Los tipos básicos son:
     string · number · boolean · null · undefined · bigint · symbol

   ⚠ En TS los tipos van en MINÚSCULA: `string`, no `String`.

   INFERENCIA: casi nunca hace falta escribirlos. TS los deduce solo:

     let nombre = 'Ana';        // TS ya sabe que es string
     nombre = 5;                // ✗ error: no se puede asignar number a string

   Regla práctica del día a día:
     · variables con valor inicial -> NO anotes, deja que infiera
     · parámetros de función       -> SÍ anota siempre
     · valores que vienen de fuera (API) -> SÍ anota

   ⚠ Diferencia importante:
        let x = 'Ana';            // tipo string (se puede reasignar a otro texto)
        const y = 'Ana';          // tipo 'Ana'  <- el tipo es ESE texto exacto
     A eso se le llama "literal type" y es la base de muchas cosas (tema 32).
   -------------------------------------------------------------------------- */

// E1. Anota el tipo de estas tres constantes (aunque TS las infiera: es para
// practicar la sintaxis). Deben quedar: string, number, boolean.
export const ciudad = 'Lima';        // TODO: ponle  : string
export const habitantes = 9700000;   // TODO
export const esCapital = true;       // TODO

// E2. Devuelve el texto en mayúsculas. Anota el parámetro y el retorno.
export function gritar(texto: string): string {
  return falta();
}

// E3. Suma dos números. Anota parámetros y retorno.
export function sumar(a: number, b: number): number {
  return falta();
}



/* ############################################################################
   28.2  LOS TIPOS ESPECIALES: any, unknown, void, never
   ############################################################################

     any       apaga TypeScript para ese valor. Se permite todo. Evítalo.
     unknown   "no sé qué es": no se puede usar hasta que compruebes qué es.
     void      la función no devuelve nada.
     never     la función nunca termina bien (siempre lanza o es bucle infinito).

     let a: any = 5;
     a.loQueSea.total();        // compila... y revienta en ejecución

     let u: unknown = 5;
     u.toFixed(2);              // ✗ error: primero hay que comprobar
     if (typeof u === 'number') u.toFixed(2);   // ✓

   Regla: si no sabes el tipo, usa `unknown`, no `any`. `unknown` te obliga a
   comprobar; `any` te deja pasar el bug hasta producción.

     function registrar(msg: string): void {
       console.log(msg);           // no devuelve nada
     }

   EJEMPLO --------------------------------------------------------------------
     function explotar(msg: string): never {
       throw new Error(msg);
     }
   -------------------------------------------------------------------------- */

// E4. Devuelve la longitud si el valor es un texto, y 0 si no lo es.
// El parámetro tiene que ser `unknown` (no `any`).
// largoSeguro('hola') -> 4 ;  largoSeguro(5) -> 0
export function largoSeguro(valor: unknown): number {
  return falta();
}

// E5. Función que no devuelve nada: anótala con `void`.
// Agrega el texto al array `registro`.
export const registro: string[] = [];
export function anotar(texto: string): void {
  falta();
}

// E6. Siempre lanza. Anótala con `never`.
export function explotar(mensaje: string): never {
  return falta();
}



/* ############################################################################
   28.3  null Y undefined — strictNullChecks
   ############################################################################
   Con `"strict": true` en el tsconfig (lo normal), TS NO te deja usar algo
   que pueda ser null sin comprobarlo. Esto es lo que evita el 80% de los
   "Cannot read properties of undefined".

     let nombre: string = null;          // ✗ error
     let nombre: string | null = null;   // ✓ el `|` es "o esto o lo otro"

     function saludar(nombre: string | null) {
       nombre.toUpperCase();             // ✗ error: puede ser null
       if (nombre) nombre.toUpperCase(); // ✓ dentro del if ya es string
       nombre?.toUpperCase();            // ✓ también vale
     }

   El `?` en un parámetro u objeto significa "puede no venir":
     function f(x?: number) { }          // x es  number | undefined
     f();  f(5);                         // las dos son válidas

   ⚠ `x?: number` y `x: number | undefined` NO son lo mismo:
        el primero se puede omitir al llamar; el segundo hay que pasarlo
        (aunque sea `undefined`).

   EJEMPLO --------------------------------------------------------------------
     function mostrar(nombre: string | null): string {
       return nombre ?? 'sin nombre';
     }
   -------------------------------------------------------------------------- */

// E7. Devuelve el nombre, o 'invitado' si es null o undefined.
// saludo(null) -> 'invitado' ;  saludo('Ana') -> 'Ana'
export function saludo(nombre: string | null | undefined): string {
  return falta();
}

// E8. Parámetro OPCIONAL con `?`. Si no viene, usa 10.
// conLimite() -> 10 ;  conLimite(5) -> 5
export function conLimite(limite?: number): number {
  return falta();
}

// E9. Parámetro con VALOR POR DEFECTO (no hace falta el `?`, ya lo implica).
// Anota el tipo del parámetro.
// repetir('ab') -> 'abab' ;  repetir('ab', 3) -> 'ababab'
export function repetir(texto: string, veces: number = 2): string {
  return falta();
}



/* ############################################################################
   28.4  COMPROBAR TIPOS SIN EJECUTAR NADA
   ############################################################################
   Algunos ejercicios de este nivel no piden código, piden un TIPO. Para
   corregirlos se usa esto (viene de lib/tipos.ts):

     type _ = Comprobar<Igual<LoQueEscribiste, LoQueSePedia>>;

   Si tu tipo no coincide, TS marca esa línea en rojo y `npm run tipos` falla.
   Si coincide, no pasa nada.

   ⚠ El error que verás es:
        Type 'false' does not satisfy the constraint 'true'.
     Traducido: "el tipo que escribiste no es el que pedía el ejercicio".

   Para declarar un tipo propio se usa `type`:

     type Id = number;
     type Nombre = string;
     type Estado = 'activo' | 'inactivo';     // union de literales (tema 32)

   EJEMPLO --------------------------------------------------------------------
     type Edad = number;
     type _ok = Comprobar<Igual<Edad, number>>;     // compila
     type _mal = Comprobar<Igual<Edad, string>>;    // error en rojo
   -------------------------------------------------------------------------- */

// E10. Declara un tipo `Precio` que sea number.
export type Precio = number;   // TODO: ya está hecho, es el ejemplo

// E11. Declara un tipo `TextoOpcional` que sea string o undefined.
export type TextoOpcional = string;   // TODO: agrégale  | undefined

// E12. Declara un tipo `Bandera` que sea boolean o null.
export type Bandera = boolean;   // TODO

// --- comprobaciones (no las toques: son el corrector de tipos) ---------------
type _c01a = Comprobar<Igual<typeof ciudad, string>>;
type _c01b = Comprobar<Igual<typeof habitantes, number>>;
type _c01c = Comprobar<Igual<typeof esCapital, boolean>>;
type _c10 = Comprobar<Igual<Precio, number>>;
type _c11 = Comprobar<Igual<TextoOpcional, string | undefined>>;
type _c12 = Comprobar<Igual<Bandera, boolean | null>>;
export type _comprobaciones = [_c01a, _c01b, _c01c, _c10, _c11, _c12];



/* ############################################################################
   28.5  CÓMO SE LEE UN ERROR DE TYPESCRIPT
   ############################################################################

     Type 'number' is not assignable to type 'string'.
     └─ le pasaste un número donde pedía texto

     Object is possibly 'null'.
     └─ puede ser null: comprueba antes (if, ?. o ??)

     Property 'nombre' does not exist on type '{}'.
     └─ el objeto no tiene ese campo según su tipo

     Argument of type 'X' is not assignable to parameter of type 'Y'.
     └─ el argumento no encaja con lo que pide la función

     Parameter 'x' implicitly has an 'any' type.
     └─ falta anotar un parámetro

   Se leen de atrás para adelante: primero lo que PEDÍA, después lo que LE
   DISTE. El editor subraya la línea exacta: pasa el mouse por encima.
   -------------------------------------------------------------------------- */

// E13. Este ejercicio junta todo: recibe un texto que puede faltar, un número
// opcional con defecto 1, y devuelve el texto repetido en mayúsculas.
// formatear('ab')        -> 'AB'
// formatear('ab', 2)     -> 'ABAB'
// formatear(undefined)   -> ''
export function formatear(texto: string | undefined, veces: number = 1): string {
  return falta();
}


/* ============================================================================
   SOLUCIONES
   ----------------------------------------------------------------------------
   E1   export const ciudad: string = 'Lima';
        export const habitantes: number = 9700000;
        export const esCapital: boolean = true;
   E2   return texto.toUpperCase();
   E3   return a + b;
   E4   return typeof valor === 'string' ? valor.length : 0;
   E5   registro.push(texto);
   E6   throw new Error(mensaje);
   E7   return nombre ?? 'invitado';
   E8   return limite ?? 10;
   E9   return texto.repeat(veces);
   E11  export type TextoOpcional = string | undefined;
   E12  export type Bandera = boolean | null;
   E13  if (!texto) return '';
        return texto.toUpperCase().repeat(veces);
   ============================================================================ */
