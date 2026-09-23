/* ============================================================================
   35 · keyof, typeof, TIPOS INDEXADOS Y MAPEADOS
   Nivel 5 · TypeScript
   ----------------------------------------------------------------------------
   Aquí TS deja de "anotar" y empieza a CALCULAR tipos a partir de otros. Es
   lo que hace que las librerías autocompleten tan bien.
   No necesitas escribirlo a diario, pero sí leerlo sin asustarte.
   Corrige con:  npm run ts 35     ·    npm run tipos
   ============================================================================ */

import { falta } from '../lib/mini-test';
import type { Igual, Comprobar } from '../lib/tipos';

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  activo: boolean;
}


/* ############################################################################
   35.1  keyof — las claves de un tipo, como unión
   ############################################################################

     type Claves = keyof Usuario;      // 'id' | 'nombre' | 'email' | 'activo'

   Sirve para escribir funciones que reciben un NOMBRE DE CAMPO y no aceptan
   cualquier texto:

     function leer(u: Usuario, campo: keyof Usuario) {
       return u[campo];
     }
     leer(u, 'nombre');       // ✓
     leer(u, 'nombe');        // ✗ error de typo, atrapado al escribir

   Combinado con genéricos, el retorno es EXACTO:

     function leer<T, K extends keyof T>(obj: T, campo: K): T[K] {
       return obj[campo];
     }
     leer(u, 'id');           // number    ✓ no `string | number | boolean`
     leer(u, 'nombre');       // string

   Esa es la firma que verás en mil librerías. Ahora ya sabes leerla.

   EJEMPLO --------------------------------------------------------------------
     type ClaveUsuario = keyof Usuario;
     const campos: ClaveUsuario[] = ['id', 'nombre'];
   -------------------------------------------------------------------------- */

// E1. Declara `ClaveUsuario` como la unión de las claves de Usuario.
export type ClaveUsuario = string;   // TODO: keyof Usuario

// E2. Devuelve el valor de ese campo, con el tipo exacto.
// leer(u, 'id') -> number ; leer(u, 'nombre') -> string
export function leer<T, K extends keyof T>(obj: T, campo: K): T[K] {
  return falta();
}

// E3. Devuelve los valores de esos campos, en ese orden.
// valores(u, ['nombre','id']) -> ['Ana', 1]
export function valores<T, K extends keyof T>(obj: T, campos: K[]): T[K][] {
  return falta();
}

// --- comprobación -----------------------------------------------------------
type _c1 = Comprobar<Igual<ClaveUsuario, 'id' | 'nombre' | 'email' | 'activo'>>;
export type _comprobaciones1 = [_c1];



/* ############################################################################
   35.2  typeof (el de TIPOS) — sacar el tipo de un valor
   ############################################################################
   Ojo: hay DOS typeof y no son lo mismo.

     typeof x === 'string'      // el de JavaScript, en tiempo de EJECUCIÓN
     type T = typeof x;         // el de TypeScript, en tiempo de TIPOS

   El de TS convierte un VALOR en su TIPO:

     const config = { url: '/api', reintentos: 3 };
     type Config = typeof config;        // { url: string; reintentos: number }

     function crear() { return { id: 1 }; }
     type Creado = ReturnType<typeof crear>;

   El patrón de oro, ya visto en el tema 31:

     const ESTADOS = ['ok', 'error'] as const;
     type Estado = typeof ESTADOS[number];      // 'ok' | 'error'

   Se lee: "el tipo de ESTADOS, indexado por cualquier número" = el tipo de
   sus elementos.

   EJEMPLO --------------------------------------------------------------------
     const COLORES = { ok: 'verde', error: 'rojo' } as const;
     type Color = typeof COLORES[keyof typeof COLORES];     // 'verde' | 'rojo'
   -------------------------------------------------------------------------- */

export const CONFIG = {
  url: '/api',
  reintentos: 3,
  debug: false,
};

export const ROLES = ['admin', 'editor', 'lector'] as const;

// E4. `Config` = el tipo del objeto CONFIG.
export type Config = object;   // TODO: typeof CONFIG

// E5. `Rol` = la unión de los valores de ROLES.
export type Rol = string;   // TODO: typeof ROLES[number]

// E6. Devuelve true si el texto es un Rol válido.
// esRol('admin') -> true ; esRol('otro') -> false
export function esRol(texto: string): boolean {
  return falta();
}

// --- comprobaciones ---------------------------------------------------------
type _c4 = Comprobar<Igual<Config, { url: string; reintentos: number; debug: boolean }>>;
type _c5 = Comprobar<Igual<Rol, 'admin' | 'editor' | 'lector'>>;
export type _comprobaciones2 = [_c4, _c5];



/* ############################################################################
   35.3  TIPOS INDEXADOS — T['campo']
   ############################################################################

     type Nombre = Usuario['nombre'];          // string
     type IdOEmail = Usuario['id' | 'email'];  // number | string
     type Todos = Usuario[keyof Usuario];      // number | string | boolean

   Y para arrays:
     type Item = Usuario[];
     type Uno = Item[number];                  // Usuario

   Sirve para no repetir: si el campo cambia de tipo, tu alias cambia solo.

     interface Pedido { items: { sku: string; cant: number }[] }
     type ItemPedido = Pedido['items'][number];    // { sku: string; cant: number }

   Esa última línea aparece muchísimo cuando tipas datos anidados de una API.

   EJEMPLO --------------------------------------------------------------------
     type Email = Usuario['email'];      // string
   -------------------------------------------------------------------------- */

export interface Pedido {
  id: number;
  items: { sku: string; cantidad: number }[];
}

// E7. `ItemPedido` = el tipo de UN item del pedido, sacado de Pedido.
export type ItemPedido = object;   // TODO: Pedido['items'][number]

// E8. Suma las cantidades de los items.
export function totalItems(p: Pedido): number {
  return falta();
}

// --- comprobación -----------------------------------------------------------
type _c7 = Comprobar<Igual<ItemPedido, { sku: string; cantidad: number }>>;
export type _comprobaciones3 = [_c7];



/* ############################################################################
   35.4  TIPOS MAPEADOS — recorrer las claves de un tipo
   ############################################################################
   Es un "for" a nivel de tipos:

     type Opcional<T> = {
       [K in keyof T]?: T[K];              // esto ES Partial<T>
     };

     type SoloLectura<T> = {
       readonly [K in keyof T]: T[K];      // esto ES Readonly<T>
     };

     type ATexto<T> = {
       [K in keyof T]: string;             // todos los campos pasan a string
     };

   Se lee: "para cada clave K de T, el campo K con tipo ...".

   Un caso real: el objeto de errores de un formulario.

     type Errores<T> = {
       [K in keyof T]?: string;            // cada campo puede tener un error
     };
     const errores: Errores<Usuario> = { email: 'No es válido' };

   Modificadores:
     -?          quita el opcional        (esto es Required<T>)
     -readonly   quita el readonly
     as          renombra la clave:
                   type ConPrefijo<T> = { [K in keyof T as `campo_${string & K}`]: T[K] }

   EJEMPLO --------------------------------------------------------------------
     type Banderas<T> = { [K in keyof T]: boolean };
     type UsuarioTocado = Banderas<Usuario>;   // { id: boolean; nombre: boolean; ... }
   -------------------------------------------------------------------------- */

// E9. `Errores<T>`: cada clave de T, opcional y de tipo string.
export type Errores<T> = T;   // TODO: tipo mapeado

// E10. `Banderas<T>`: cada clave de T con valor boolean (no opcional).
export type Banderas<T> = T;   // TODO

// E11. Devuelve un objeto con todos los campos en false.
// sinTocar(['a','b']) -> { a: false, b: false }
export function sinTocar(campos: string[]): Record<string, boolean> {
  return falta();
}

// E12. Devuelve solo los campos que tienen error (las claves).
// camposConError({ email: 'malo', nombre: undefined }) -> ['email']
export function camposConError(errores: Record<string, string | undefined>): string[] {
  return falta();
}

// --- comprobaciones ---------------------------------------------------------
type _c9 = Comprobar<Igual<Errores<Usuario>, { id?: string; nombre?: string; email?: string; activo?: string }>>;
type _c10 = Comprobar<Igual<Banderas<Usuario>, { id: boolean; nombre: boolean; email: boolean; activo: boolean }>>;
export type _comprobaciones4 = [_c9, _c10];



/* ############################################################################
   35.5  satisfies — validar sin perder el tipo exacto
   ############################################################################
   Problema:

     const colores: Record<string, string> = { ok: 'verde', error: 'rojo' };
     colores.ok;           // string   <- perdiste que era 'verde'
     colores.loQueSea;     // string   <- y acepta claves que no existen

   Con `satisfies` compruebas la forma PERO sin cambiar el tipo del valor:

     const colores = { ok: 'verde', error: 'rojo' } satisfies Record<string, string>;
     colores.loQueSea;     // ✗ error   ✓ ahora sí te avisa de la clave inventada

   Y si además quieres conservar los valores EXACTOS, se combina con as const:

     const colores = { ok: 'verde' } as const satisfies Record<string, string>;
     colores.ok;           // 'verde'   ✓ el literal, no `string`

   Regla: `:` comprueba y AMPLÍA el tipo · `satisfies` comprueba y NO lo toca.
   Para objetos de configuración, `as const satisfies ...` es la combinación
   que verás en los proyectos nuevos.
   -------------------------------------------------------------------------- */

// E13. Haz que TEMAS conserve los valores exactos y además se valide como
// Record<string, string>.
// TODO: agrégale   as const satisfies Record<string, string>
export const TEMAS = { claro: '#fff', oscuro: '#000' };

// --- comprobación -----------------------------------------------------------
type _c13 = Comprobar<Igual<typeof TEMAS, { readonly claro: '#fff'; readonly oscuro: '#000' }>>;
export type _comprobaciones5 = [_c13];


/* ============================================================================
   SOLUCIONES
   ----------------------------------------------------------------------------
   E1   export type ClaveUsuario = keyof Usuario;
   E2   return obj[campo];
   E3   return campos.map(c => obj[c]);
   E4   export type Config = typeof CONFIG;
   E5   export type Rol = typeof ROLES[number];
   E6   return (ROLES as readonly string[]).includes(texto);
   E7   export type ItemPedido = Pedido['items'][number];
   E8   return p.items.reduce((t, i) => t + i.cantidad, 0);
   E9   export type Errores<T> = { [K in keyof T]?: string };
   E10  export type Banderas<T> = { [K in keyof T]: boolean };
   E11  return Object.fromEntries(campos.map(c => [c, false]));
   E12  return Object.entries(errores)
          .filter(([, v]) => v !== undefined)
          .map(([k]) => k);
   E13  export const TEMAS = { claro: '#fff', oscuro: '#000' } as const
          satisfies Record<string, string>;
   ============================================================================ */
