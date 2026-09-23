/* ============================================================================
   29 · OBJETOS: interface y type
   Nivel 5 · TypeScript
   ----------------------------------------------------------------------------
   Esto es el 70% del TypeScript que vas a escribir: describir la forma de los
   objetos que van y vienen de la API.
   Corrige con:  npm run ts 29     ·    npm run tipos
   ============================================================================ */

import { falta } from '../lib/mini-test';
import type { Igual, Comprobar } from '../lib/tipos';


/* ############################################################################
   29.1  DESCRIBIR UN OBJETO
   ############################################################################

     interface Usuario {
       id: number;
       nombre: string;
       email: string | null;      // puede venir null
       telefono?: string;         // puede NO venir  (es  string | undefined)
       readonly creado: string;   // no se puede reasignar después
     }

     const u: Usuario = { id: 1, nombre: 'Ana', email: null, creado: '2026-01-01' };

   · Los campos se separan con `;` (también acepta `,`, pero `;` es lo común).
   · Si falta un campo obligatorio: error. Si sobra uno: también error.
   · `?` = opcional · `readonly` = solo lectura

   ⚠ El error "Object literal may only specify known properties" significa que
     pusiste un campo de más. Pasa muchísimo con typos: `nombe` en vez de
     `nombre`.

   EJEMPLO --------------------------------------------------------------------
     interface Producto {
       id: number;
       nombre: string;
       precio: number;
       descuento?: number;
     }
     const p: Producto = { id: 1, nombre: 'Mouse', precio: 80 };   // ✓ sin descuento
   -------------------------------------------------------------------------- */

// E1. Declara la interfaz Producto: id (number), nombre (string),
// precio (number) y descuento OPCIONAL (number).
export interface Producto {
  // TODO
  id: number;
}

// E2. Devuelve el precio con el descuento aplicado. Si no hay descuento,
// devuelve el precio tal cual.  (descuento 0.1 = 10%)
// precioFinal({ id:1, nombre:'x', precio:100, descuento:0.1 }) -> 90
export function precioFinal(p: Producto): number {
  return falta();
}



/* ############################################################################
   29.2  interface vs type — cuál usar
   ############################################################################

     interface Usuario { id: number; }

     type Usuario = { id: number; };          // hace lo mismo para objetos

   Diferencias que importan de verdad:

     · `interface` se puede REABRIR: si la declaras dos veces, se fusionan.
       Sirve para extender tipos de librerías.
     · `type` sirve para MÁS cosas: unions, tuplas, primitivos, funciones.
         type Id = number | string;         // interface no puede hacer esto
         type Punto = [number, number];

   Regla que usan casi todos los proyectos Vue:
     · objetos y props de componentes   -> `interface`
     · uniones, alias y tipos derivados -> `type`
     (Y si dudas: cualquiera de las dos funciona.)

   HEREDAR:
     interface Admin extends Usuario { permisos: string[] }
     type Admin = Usuario & { permisos: string[] };      // `&` = intersección

   EJEMPLO --------------------------------------------------------------------
     interface Base { id: number }
     interface ConFecha extends Base { creado: string }
     // ConFecha tiene id Y creado
   -------------------------------------------------------------------------- */

// E3. Declara `Identificable` con solo `id: number`.
export interface Identificable {
  // TODO
}

// E4. Declara `Cliente` que EXTIENDA Identificable y agregue `nombre: string`.
export interface Cliente extends Identificable {
  // TODO
}

// E5. Lo mismo pero con `type` e intersección `&`:
// `Empleado` = Identificable + { cargo: string }
export type Empleado = Identificable;   // TODO: agrégale  & { cargo: string }

// E6. Devuelve "1 - Ana" a partir de un Cliente.
export function describirCliente(c: Cliente): string {
  return falta();
}

// --- comprobaciones de tipos ------------------------------------------------
type _c3 = Comprobar<Igual<Identificable, { id: number }>>;
type _c5 = Comprobar<Igual<Empleado, Identificable & { cargo: string }>>;
export type _comprobaciones1 = [_c3, _c5];



/* ############################################################################
   29.3  OBJETOS ANIDADOS Y ARRAYS DE OBJETOS
   ############################################################################

     interface Direccion { ciudad: string; pais: string }

     interface Pedido {
       id: number;
       cliente: { nombre: string; direccion: Direccion };   // anidado en línea
       items: Item[];                                       // array de objetos
       total: number;
     }

   Dos formas de escribir "array de X":
     Item[]              // la común
     Array<Item>         // la misma, con genéricos (tema 33)

   ⚠ Para lo anidado conviene declarar tipos sueltos y reusarlos, no anidar
     todo en línea: así puedes tipar funciones que reciben solo la Direccion.

   EJEMPLO --------------------------------------------------------------------
     const p: Pedido = {
       id: 1,
       cliente: { nombre: 'Ana', direccion: { ciudad: 'Lima', pais: 'PE' } },
       items: [{ sku: 'A1', cantidad: 2 }],
       total: 100,
     };
   -------------------------------------------------------------------------- */

export interface Item {
  sku: string;
  cantidad: number;
  precio: number;
}

// E7. Declara `Pedido`: id (number), cliente (string) e items (array de Item).
export interface Pedido {
  // TODO
  id: number;
}

// E8. Suma el total del pedido (cantidad * precio de cada item).
// totalPedido({ id:1, cliente:'Ana', items:[{sku:'a',cantidad:2,precio:10}] }) -> 20
export function totalPedido(p: Pedido): number {
  return falta();
}

// E9. Devuelve los sku de los items cuya cantidad sea mayor a 1.
export function skusRepetidos(p: Pedido): string[] {
  return falta();
}



/* ############################################################################
   29.4  FIRMAS DE ÍNDICE — objetos con claves libres
   ############################################################################
   Cuando no sabes de antemano cuáles son las claves:

     interface Diccionario {
       [clave: string]: number;         // cualquier clave string -> number
     }

     const stock: Diccionario = { mouse: 5, teclado: 2 };
     stock.loQueSea;                    // TS dice: number

   Más moderno y más usado en proyectos Vue (tema 34):
     type Diccionario = Record<string, number>;

   Para el típico "indexar por id":
     type PorId = Record<number, Usuario>;

   ⚠ Cuidado: TS cree que TODA clave existe. `stock.noExiste` compila pero en
     ejecución es undefined. Si quieres que TS te avise, activa
     `noUncheckedIndexedAccess` en el tsconfig (y entonces devuelve
     `number | undefined`).

   EJEMPLO --------------------------------------------------------------------
     const conteo: Record<string, number> = {};
     conteo['a'] = 1;
   -------------------------------------------------------------------------- */

// E10. Declara `Stock` como un objeto de claves string y valores number.
// Usa Record.
export type Stock = object;   // TODO

// E11. Suma todas las cantidades del stock.
// totalStock({ a: 2, b: 3 }) -> 5
export function totalStock(s: Stock): number {
  return falta();
}

// E12. Cuenta cuántas veces aparece cada texto.
// contar(['a','b','a']) -> { a: 2, b: 1 }
export function contar(textos: string[]): Record<string, number> {
  return falta();
}

// --- comprobaciones de tipos ------------------------------------------------
type _c10 = Comprobar<Igual<Stock, Record<string, number>>>;
export type _comprobaciones2 = [_c10];



/* ############################################################################
   29.5  TIPAR LO QUE LLEGA DE LA API
   ############################################################################
   Esto es lo que harás en el proyecto, literalmente:

     export interface UsuarioDTO {
       id: number;
       nombre: string;
       correo_electronico: string;      // como lo manda el backend
       fecha_alta: string;              // llega como texto ISO, no como Date
     }

     export interface Usuario {          // como lo quieres en el front
       id: number;
       nombre: string;
       email: string;
       alta: Date;
     }

     function aUsuario(dto: UsuarioDTO): Usuario {
       return {
         id: dto.id,
         nombre: dto.nombre,
         email: dto.correo_electronico,
         alta: new Date(dto.fecha_alta),
       };
     }

   A esa función se le llama "mapper" o "adapter". Vale la pena: si mañana el
   backend renombra un campo, tocas un solo archivo.

   ⚠ TS NO comprueba en ejecución: si el backend manda otra cosa, TS no se
     entera. Tipar la respuesta es una PROMESA, no una garantía. Para
     garantizarlo de verdad se usan librerías como zod.
   -------------------------------------------------------------------------- */

export interface UsuarioDTO {
  id: number;
  nombre_completo: string;
  correo: string;
  activo: number;          // el backend manda 1 / 0
}

// E13. Declara el tipo `Usuario` del front: id (number), nombre (string),
// email (string) y activo (boolean).
export interface Usuario {
  // TODO
  id: number;
}

// E14. Convierte el DTO al tipo del front.
// aUsuario({ id:1, nombre_completo:'Ana', correo:'a@b.c', activo:1 })
//   -> { id:1, nombre:'Ana', email:'a@b.c', activo:true }
export function aUsuario(dto: UsuarioDTO): Usuario {
  return falta();
}

// E15. Convierte una lista completa.
export function aUsuarios(dtos: UsuarioDTO[]): Usuario[] {
  return falta();
}


/* ============================================================================
   SOLUCIONES
   ----------------------------------------------------------------------------
   E1   export interface Producto {
          id: number;
          nombre: string;
          precio: number;
          descuento?: number;
        }
   E2   return p.descuento ? p.precio * (1 - p.descuento) : p.precio;
   E3   export interface Identificable { id: number }
   E4   export interface Cliente extends Identificable { nombre: string }
   E5   export type Empleado = Identificable & { cargo: string };
   E6   return `${c.id} - ${c.nombre}`;
   E7   export interface Pedido {
          id: number;
          cliente: string;
          items: Item[];
        }
   E8   return p.items.reduce((t, i) => t + i.cantidad * i.precio, 0);
   E9   return p.items.filter(i => i.cantidad > 1).map(i => i.sku);
   E10  export type Stock = Record<string, number>;
   E11  return Object.values(s).reduce((t, n) => t + n, 0);
   E12  return textos.reduce<Record<string, number>>((acc, t) => {
          acc[t] = (acc[t] || 0) + 1;
          return acc;
        }, {});
   E13  export interface Usuario {
          id: number;
          nombre: string;
          email: string;
          activo: boolean;
        }
   E14  return {
          id: dto.id,
          nombre: dto.nombre_completo,
          email: dto.correo,
          activo: dto.activo === 1,
        };
   E15  return dtos.map(aUsuario);
   ============================================================================ */
