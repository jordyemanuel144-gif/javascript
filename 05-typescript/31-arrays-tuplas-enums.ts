/* ============================================================================
   31 · ARRAYS, TUPLAS, ENUMS Y as const
   Nivel 5 · TypeScript
   ----------------------------------------------------------------------------
   Corrige con:  npm run ts 31     ·    npm run tipos
   ============================================================================ */

import { falta } from '../lib/mini-test';
import type { Igual, Comprobar } from '../lib/tipos';


/* ############################################################################
   31.1  ARRAYS
   ############################################################################

     const nombres: string[] = ['Ana', 'Luis'];
     const edades: Array<number> = [30, 25];          // lo mismo, otra sintaxis
     const usuarios: Usuario[] = [];

     const matriz: number[][] = [[1, 2], [3]];        // array de arrays
     const mezcla: (string | number)[] = ['a', 1];    // ojo los paréntesis

   ⚠ `string[] | number[]` NO es lo mismo que `(string | number)[]`:
        el primero es "o un array de textos o uno de números"
        el segundo es "un array con textos Y números mezclados"

   SOLO LECTURA:
     const fijos: readonly string[] = ['a', 'b'];
     fijos.push('c');          // ✗ error: push no existe en readonly

   Al recorrer, TS infiere el tipo de cada elemento:
     nombres.map(n => n.toUpperCase());     // n es string, autocompleta

   EJEMPLO --------------------------------------------------------------------
     const precios: number[] = [10, 20];
     const total = precios.reduce((t, p) => t + p, 0);   // total: number
   -------------------------------------------------------------------------- */

// E1. Declara el tipo: array de textos.
export type Nombres = object;   // TODO

// E2. Declara el tipo: array que mezcla textos y números.
export type Mezcla = object;    // TODO: (string | number)[]

// E3. Devuelve solo los textos de un array mezclado.
// soloTextos(['a', 1, 'b']) -> ['a','b']
export function soloTextos(lista: (string | number)[]): string[] {
  return falta();
}

// E4. Devuelve la suma de un array de números (tipado).
export function sumar(nums: number[]): number {
  return falta();
}

// --- comprobaciones ---------------------------------------------------------
type _c1 = Comprobar<Igual<Nombres, string[]>>;
type _c2 = Comprobar<Igual<Mezcla, (string | number)[]>>;
export type _comprobaciones1 = [_c1, _c2];



/* ############################################################################
   31.2  TUPLAS — arrays de largo y tipos fijos
   ############################################################################

     type Punto = [number, number];
     const p: Punto = [10, 20];
     const mal: Punto = [10];               // ✗ faltan elementos

     type Par = [string, number];
     const [clave, valor]: Par = ['edad', 30];

   Con nombres (solo para leerse mejor, no cambia nada):
     type Rango = [minimo: number, maximo: number];

   Dónde aparecen de verdad:
     · `Object.entries(obj)` devuelve `[string, any][]`
     · los composables de Vue que devuelven pares
     · `useState`-style: `const [valor, setValor] = useAlgo()`

   Opcionales y rest en tuplas:
     type Config = [string, number?];
     type Ruta = [string, ...number[]];

   EJEMPLO --------------------------------------------------------------------
     const entradas: [string, number][] = Object.entries({ a: 1 });
     entradas[0][0];          // string
   -------------------------------------------------------------------------- */

// E5. Declara `Coordenada` como tupla de dos números.
export type Coordenada = object;   // TODO

// E6. Declara `ParClaveValor` como tupla [string, number].
export type ParClaveValor = object;   // TODO

// E7. Devuelve la distancia horizontal entre dos coordenadas
// (la resta de las primeras posiciones, en valor absoluto).
// distanciaX([0,0],[3,5]) -> 3
export function distanciaX(a: [number, number], b: [number, number]): number {
  return falta();
}

// E8. Convierte un objeto en array de pares.
// aPares({ a: 1, b: 2 }) -> [['a',1],['b',2]]
export function aPares(obj: Record<string, number>): [string, number][] {
  return falta();
}

// --- comprobaciones ---------------------------------------------------------
type _c5 = Comprobar<Igual<Coordenada, [number, number]>>;
type _c6 = Comprobar<Igual<ParClaveValor, [string, number]>>;
export type _comprobaciones2 = [_c5, _c6];



/* ############################################################################
   31.3  UNIÓN DE LITERALES — lo que se usa en vez de enum
   ############################################################################

     type Estado = 'pendiente' | 'enviado' | 'entregado';

     let e: Estado = 'pendiente';     // ✓
     let x: Estado = 'cualquiera';    // ✗ error, y el editor te autocompleta

   Es la forma preferida en proyectos Vue modernos: no genera código al
   compilar, autocompleta igual y se serializa directo a JSON.

   Lo mismo con números:
     type Nivel = 1 | 2 | 3;

   Y se combina con objetos:
     interface Pedido { id: number; estado: Estado }

   EJEMPLO --------------------------------------------------------------------
     type Tamano = 'sm' | 'md' | 'lg';
     const clases: Record<Tamano, string> = {
       sm: 'text-sm', md: 'text-base', lg: 'text-lg',
     };
   -------------------------------------------------------------------------- */

// E9. Declara `Estado` como unión: 'pendiente' | 'enviado' | 'entregado'.
export type Estado = string;   // TODO

// E10. Devuelve el texto para mostrar de cada estado.
// etiqueta('enviado') -> 'En camino'
// pendiente -> 'En espera' ; enviado -> 'En camino' ; entregado -> 'Finalizado'
export function etiqueta(estado: Estado): string {
  return falta();
}

// --- comprobación -----------------------------------------------------------
type _c9 = Comprobar<Igual<Estado, 'pendiente' | 'enviado' | 'entregado'>>;
export type _comprobaciones3 = [_c9];



/* ############################################################################
   31.4  enum — el que sí genera código
   ############################################################################

     enum Rol {
       Admin = 'ADMIN',
       Usuario = 'USER',
     }
     Rol.Admin;              // 'ADMIN'

     enum Nivel { Bajo, Medio, Alto }     // numérico: 0, 1, 2
     Nivel.Medio;            // 1

   Diferencias con la unión de literales:
     · el enum EXISTE en tiempo de ejecución (genera un objeto de verdad)
     · se puede recorrer:  Object.values(Rol)
     · el enum numérico acepta cualquier número (¡agujero de tipos!)
     · `const enum` se borra al compilar, pero da problemas con Vite

   Recomendación práctica: en proyectos nuevos, unión de literales.
   Si el proyecto ya usa enums, respeta lo que hay.

   La alternativa que da lo mejor de los dos mundos (tema 31.5):
     const ROLES = { Admin: 'ADMIN', Usuario: 'USER' } as const;
     type Rol = typeof ROLES[keyof typeof ROLES];     // 'ADMIN' | 'USER'
   -------------------------------------------------------------------------- */

// E11. Declara un enum `Prioridad` con Baja = 'BAJA', Alta = 'ALTA'.
export enum Prioridad {
  // TODO
  Baja = 'BAJA',
}

// E12. Devuelve true si la prioridad es Alta.
export function esUrgente(p: Prioridad): boolean {
  return falta();
}



/* ############################################################################
   31.5  as const — congelar los valores
   ############################################################################

     const config = { url: '/api', reintentos: 3 };
     // tipo: { url: string; reintentos: number }

     const config = { url: '/api', reintentos: 3 } as const;
     // tipo: { readonly url: '/api'; readonly reintentos: 3 }   <- literales

   Para qué sirve de verdad:

     const ESTADOS = ['pendiente', 'enviado'] as const;
     type Estado = typeof ESTADOS[number];      // 'pendiente' | 'enviado'

   Así tienes el array (para recorrerlo en un v-for) Y el tipo, sin repetirlos.
   Es EL patrón para listas de opciones en Vue.

   ⚠ Sin `as const`, `['a','b']` se infiere como `string[]` y pierdes los
     valores exactos.

   EJEMPLO --------------------------------------------------------------------
     const TAMANOS = ['sm', 'md', 'lg'] as const;
     type Tamano = typeof TAMANOS[number];     // 'sm' | 'md' | 'lg'
     TAMANOS.map(t => t);                      // se puede recorrer
   -------------------------------------------------------------------------- */

// E13. Agrega `as const` para que el tipo sea de literales, no string[].
export const MONEDAS = ['PEN', 'USD', 'EUR'];   // TODO: ponle  as const

// E14. Declara el tipo `Moneda` a partir del array de arriba.
export type Moneda = string;   // TODO: typeof MONEDAS[number]

// E15. Devuelve el símbolo de la moneda.
// simbolo('PEN') -> 'S/' ; 'USD' -> '$' ; 'EUR' -> '€'
export function simbolo(m: Moneda): string {
  return falta();
}

// --- comprobaciones ---------------------------------------------------------
type _c13 = Comprobar<Igual<typeof MONEDAS, readonly ['PEN', 'USD', 'EUR']>>;
type _c14 = Comprobar<Igual<Moneda, 'PEN' | 'USD' | 'EUR'>>;
export type _comprobaciones4 = [_c13, _c14];


/* ============================================================================
   SOLUCIONES
   ----------------------------------------------------------------------------
   E1   export type Nombres = string[];
   E2   export type Mezcla = (string | number)[];
   E3   return lista.filter((x): x is string => typeof x === 'string');
        (el `x is string` es un "type guard", se ve en el tema 32;
         también vale:  return lista.filter(x => typeof x === 'string') as string[];)
   E4   return nums.reduce((t, n) => t + n, 0);
   E5   export type Coordenada = [number, number];
   E6   export type ParClaveValor = [string, number];
   E7   return Math.abs(a[0] - b[0]);
   E8   return Object.entries(obj);
   E9   export type Estado = 'pendiente' | 'enviado' | 'entregado';
   E10  const textos: Record<Estado, string> = {
          pendiente: 'En espera',
          enviado: 'En camino',
          entregado: 'Finalizado',
        };
        return textos[estado];
   E11  export enum Prioridad { Baja = 'BAJA', Alta = 'ALTA' }
   E12  return p === Prioridad.Alta;
   E13  export const MONEDAS = ['PEN', 'USD', 'EUR'] as const;
   E14  export type Moneda = typeof MONEDAS[number];
   E15  const simbolos: Record<Moneda, string> = { PEN: 'S/', USD: '$', EUR: '€' };
        return simbolos[m];
   ============================================================================ */
