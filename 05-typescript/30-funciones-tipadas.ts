/* ============================================================================
   30 · FUNCIONES TIPADAS
   Nivel 5 · TypeScript
   ----------------------------------------------------------------------------
   Tipar funciones es donde TS más te ayuda: el editor te dice qué recibe y
   qué devuelve sin que tengas que abrir el archivo.
   Corrige con:  npm run ts 30     ·    npm run tipos
   ============================================================================ */

import { falta } from '../lib/mini-test';
import type { Igual, Comprobar } from '../lib/tipos';


/* ############################################################################
   30.1  PARÁMETROS Y RETORNO
   ############################################################################

     function sumar(a: number, b: number): number {
       return a + b;
     }

     const sumar = (a: number, b: number): number => a + b;

   · Los PARÁMETROS hay que anotarlos siempre (si no, son `any` implícito y
     con strict eso es error).
   · El RETORNO casi siempre se puede omitir: TS lo infiere. Anotarlo igual
     tiene una ventaja: si tu código devuelve otra cosa, te avisa YA.

   Sin retorno -> `void`:
     function registrar(msg: string): void { console.log(msg); }

   ⚠ Error clásico: "Parameter 'x' implicitly has an 'any' type" = te faltó
     anotar un parámetro.

   EJEMPLO --------------------------------------------------------------------
     const mayus = (t: string): string => t.toUpperCase();
     const esPar = (n: number): boolean => n % 2 === 0;
   -------------------------------------------------------------------------- */

// E1. Escribe `esPar` como flecha tipada.  esPar(4) -> true
export const esPar = (n: number): boolean => falta();

// E2. Concatena nombre y apellido con un espacio. Anota todo.
// nombreCompleto('Ana','Pérez') -> 'Ana Pérez'
export function nombreCompleto(nombre: string, apellido: string): string {
  return falta();
}

// E3. Calcula el IVA (21%) y devuelve el total. Redondea a 2 decimales.
// conIva(100) -> 121
export function conIva(precio: number): number {
  return falta();
}



/* ############################################################################
   30.2  EL TIPO DE UNA FUNCIÓN
   ############################################################################
   Una función también es un tipo, y se escribe con flecha:

     type Comparador = (a: number, b: number) => number;
     type Handler    = (evento: string) => void;
     type Validador  = (valor: string) => boolean;

     const ordenar: Comparador = (a, b) => a - b;
     //    ^ como el tipo ya dice qué recibe, aquí NO hace falta anotar a y b

   Fíjate en la diferencia:
     (a: number) => number       <- TIPO de una función (declaración)
     (a) => a * 2                <- una función de verdad (valor)

   Como parámetro (un callback tipado):

     function aplicar(n: number, fn: (x: number) => number): number {
       return fn(n);
     }

   Esto es lo que ves en las props de los componentes:
     onGuardar: (datos: Formulario) => void

   EJEMPLO --------------------------------------------------------------------
     type Transformador = (t: string) => string;
     const gritar: Transformador = t => t.toUpperCase();
   -------------------------------------------------------------------------- */

// E4. Declara el tipo `Validador`: recibe un string y devuelve boolean.
export type Validador = object;   // TODO

// E5. Crea un validador que compruebe que el texto no esté vacío.
// noVacio('') -> false ;  noVacio('a') -> true
export const noVacio: Validador = falta;   // TODO: reemplaza por la función

// E6. Aplica el callback al número y devuelve el resultado. Tipa el callback.
// aplicar(5, n => n * 2) -> 10
export function aplicar(n: number, fn: (x: number) => number): number {
  return falta();
}

// E7. Filtra la lista con el validador recibido.
// filtrar(['', 'a'], noVacio) -> ['a']
export function filtrar(textos: string[], validar: (t: string) => boolean): string[] {
  return falta();
}

// --- comprobación de tipos --------------------------------------------------
type _c4 = Comprobar<Igual<Validador, (valor: string) => boolean>>;
export type _comprobaciones = [_c4];



/* ############################################################################
   30.3  OPCIONALES, POR DEFECTO Y REST
   ############################################################################

     function f(a: number, b?: number) { }             // b puede faltar
     function g(a: number, b: number = 10) { }         // b tiene defecto
     function h(...nums: number[]): number { }         // rest: SIEMPRE array

   Reglas:
     · los opcionales van SIEMPRE al final
     · `b?: number` es lo mismo que `b: number | undefined` pero se puede omitir
     · el parámetro rest se tipa como ARRAY

   Desestructurar en el parámetro (lo que hacen los componentes):

     function saludar({ nombre, edad }: { nombre: string; edad: number }) { }

     // más legible con un tipo aparte:
     interface Persona { nombre: string; edad: number }
     function saludar({ nombre }: Persona) { }

   EJEMPLO --------------------------------------------------------------------
     function sumarTodos(...nums: number[]): number {
       return nums.reduce((t, n) => t + n, 0);
     }
     sumarTodos(1, 2, 3);        // 6
   -------------------------------------------------------------------------- */

// E8. Suma todos los números que reciba (rest).
// sumarTodos(1,2,3) -> 6 ;  sumarTodos() -> 0
export function sumarTodos(...nums: number[]): number {
  return falta();
}

// E9. Une textos con un separador opcional (por defecto ', ').
// unir(['a','b']) -> 'a, b' ;  unir(['a','b'], '-') -> 'a-b'
export function unir(textos: string[], separador: string = ', '): string {
  return falta();
}

export interface Persona {
  nombre: string;
  edad: number;
  ciudad?: string;
}

// E10. Desestructura EN EL PARÁMETRO y devuelve "Ana (30) de Lima".
// Si no hay ciudad, pon 'desconocida'.
export function presentar({ nombre, edad, ciudad = 'desconocida' }: Persona): string {
  return falta();
}



/* ############################################################################
   30.4  FUNCIONES ASYNC: Promise<T>
   ############################################################################
   Una función async SIEMPRE devuelve una promesa, así que su tipo es
   `Promise<algo>`:

     async function traerNombre(id: number): Promise<string> {
       const r = await fetch(`/api/usuarios/${id}`);
       const u = await r.json();
       return u.nombre;                    // devuelves string, el tipo es Promise<string>
     }

   · `Promise<void>` si no devuelve nada.
   · `Promise<Usuario[]>` para una lista.
   · Al hacer `await`, TS te da el tipo de ADENTRO:
        const nombre = await traerNombre(1);    // nombre: string

   ⚠ `r.json()` devuelve `Promise<any>`: ahí TS deja de ayudarte. Por eso se
     anota el resultado:
        const u = await r.json() as Usuario;          // o
        const u: Usuario = await r.json();

   EJEMPLO --------------------------------------------------------------------
     async function dormir(ms: number): Promise<void> {
       return new Promise(r => setTimeout(r, ms));
     }
   -------------------------------------------------------------------------- */

// E11. Devuelve el texto en mayúsculas, de forma asíncrona.
// await gritarAsync('hola') -> 'HOLA'
export async function gritarAsync(texto: string): Promise<string> {
  return falta();
}

// E12. Espera `ms` milisegundos. Tipo: Promise<void>.
export async function dormir(ms: number): Promise<void> {
  return falta();
}

// E13. Devuelve los nombres (async) a partir de una lista de personas.
// await nombresAsync([{nombre:'Ana',edad:30}]) -> ['Ana']
export async function nombresAsync(personas: Persona[]): Promise<string[]> {
  return falta();
}



/* ############################################################################
   30.5  SOBRECARGA Y RETORNOS CONDICIONALES
   ############################################################################
   A veces una función devuelve cosas distintas según lo que recibe. Se puede
   declarar más de una firma:

     function traer(id: number): Usuario;
     function traer(id: number[]): Usuario[];
     function traer(id: number | number[]): Usuario | Usuario[] {
       // una sola implementación
       return Array.isArray(id) ? id.map(buscar) : buscar(id);
     }

   Se usa poco (y casi siempre se puede evitar con genéricos, tema 33), pero
   aparece en librerías y conviene reconocerla: varias líneas `function f(...)`
   seguidas SIN cuerpo, y al final una con cuerpo.

   Lo que sí usarás a diario es devolver una unión:

     function buscar(id: number): Usuario | undefined {
       return usuarios.find(u => u.id === id);     // find puede no encontrar
     }

   Y quien la llama está obligado a comprobar:
     const u = buscar(1);
     u.nombre;              // ✗ puede ser undefined
     u?.nombre;             // ✓
   -------------------------------------------------------------------------- */

const PERSONAS: Persona[] = [
  { nombre: 'Ana', edad: 30, ciudad: 'Lima' },
  { nombre: 'Luis', edad: 25 },
];

// E14. Busca por nombre. Devuelve la persona o undefined.
export function buscarPersona(nombre: string): Persona | undefined {
  return falta();
}

// E15. Devuelve la edad de esa persona, o 0 si no existe.
// (Aquí TS te OBLIGA a comprobar el undefined.)
export function edadDe(nombre: string): number {
  return falta();
}

export { PERSONAS };


/* ============================================================================
   SOLUCIONES
   ----------------------------------------------------------------------------
   E1   export const esPar = (n: number): boolean => n % 2 === 0;
   E2   return `${nombre} ${apellido}`;
   E3   return Number((precio * 1.21).toFixed(2));
   E4   export type Validador = (valor: string) => boolean;
   E5   export const noVacio: Validador = (valor) => valor.length > 0;
   E6   return fn(n);
   E7   return textos.filter(validar);
   E8   return nums.reduce((t, n) => t + n, 0);
   E9   return textos.join(separador);
   E10  return `${nombre} (${edad}) de ${ciudad}`;
   E11  return texto.toUpperCase();
   E12  return new Promise(r => setTimeout(r, ms));
   E13  return personas.map(p => p.nombre);
   E14  return PERSONAS.find(p => p.nombre === nombre);
   E15  return buscarPersona(nombre)?.edad ?? 0;
   ============================================================================ */
