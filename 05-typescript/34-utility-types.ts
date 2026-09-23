/* ============================================================================
   34 · UTILITY TYPES
   Nivel 5 · TypeScript
   ----------------------------------------------------------------------------
   Tipos que vienen incluidos y que fabrican tipos nuevos a partir de otros.
   Son los que te evitan copiar y pegar interfaces casi iguales.
   Corrige con:  npm run ts 34     ·    npm run tipos
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
   34.1  LOS CINCO QUE USARÁS TODOS LOS DÍAS
   ############################################################################

     Partial<T>        todos los campos pasan a ser opcionales
     Required<T>       todos obligatorios (lo contrario)
     Readonly<T>       todos de solo lectura
     Pick<T, 'a'|'b'>  se queda SOLO con esos campos
     Omit<T, 'a'>      quita esos campos

   Con Usuario = { id, nombre, email, activo }:

     Partial<Usuario>                  // { id?, nombre?, email?, activo? }
     Pick<Usuario, 'id' | 'nombre'>    // { id, nombre }
     Omit<Usuario, 'id'>               // { nombre, email, activo }
     Readonly<Usuario>                 // no se puede reasignar ningún campo

   Para qué sirven de verdad:

     type NuevoUsuario = Omit<Usuario, 'id'>;        // al crear no hay id todavía
     type ParcheUsuario = Partial<Omit<Usuario, 'id'>>;   // al editar, solo lo que cambió
     type FilaTabla = Pick<Usuario, 'id' | 'nombre'>;     // la tabla muestra 2 columnas

   Y se combinan entre ellos, como arriba.

   EJEMPLO --------------------------------------------------------------------
     function actualizar(id: number, cambios: Partial<Usuario>) { ... }
     actualizar(1, { nombre: 'Ana' });         // ✓ no hace falta mandar todo
   -------------------------------------------------------------------------- */

// E1. `NuevoUsuario` = Usuario sin el id.
export type NuevoUsuario = Usuario;   // TODO: usa Omit

// E2. `CambiosUsuario` = todos los campos opcionales, sin el id.
export type CambiosUsuario = Usuario;   // TODO: Partial + Omit

// E3. `FilaTabla` = solo id y nombre.
export type FilaTabla = Usuario;   // TODO: usa Pick

// E4. Aplica los cambios al usuario y devuelve uno nuevo (sin mutar).
// actualizar(u, { nombre: 'Eva' }) -> copia con el nombre cambiado
export function actualizar(u: Usuario, cambios: CambiosUsuario): Usuario {
  return falta();
}

// E5. Convierte un usuario en fila de tabla (solo id y nombre).
export function aFila(u: Usuario): FilaTabla {
  return falta();
}

// --- comprobaciones ---------------------------------------------------------
type _c1 = Comprobar<Igual<NuevoUsuario, Omit<Usuario, 'id'>>>;
type _c2 = Comprobar<Igual<CambiosUsuario, Partial<Omit<Usuario, 'id'>>>>;
type _c3 = Comprobar<Igual<FilaTabla, Pick<Usuario, 'id' | 'nombre'>>>;
export type _comprobaciones1 = [_c1, _c2, _c3];



/* ############################################################################
   34.2  Record — objetos de claves conocidas
   ############################################################################

     Record<K, V>       un objeto con claves K y valores V

     Record<string, number>              // { [clave: string]: number }
     Record<'sm' | 'md', string>         // { sm: string; md: string }  ← obliga a
                                         //   poner las dos, ni una más ni una menos

   El segundo es un truco buenísimo: si mañana agregas un tamaño a la unión,
   TS te obliga a agregarlo también al objeto de clases.

     type Estado = 'ok' | 'error';
     const colores: Record<Estado, string> = { ok: 'verde', error: 'rojo' };

   EJEMPLO --------------------------------------------------------------------
     const conteo: Record<string, number> = {};
     conteo['a'] = (conteo['a'] ?? 0) + 1;
   -------------------------------------------------------------------------- */

export type Nivel = 'bajo' | 'medio' | 'alto';

// E6. `ColoresPorNivel` = objeto con una clave por cada Nivel y valor string.
export type ColoresPorNivel = object;   // TODO: usa Record

// E7. Devuelve el color según el nivel: bajo->verde, medio->amarillo, alto->rojo.
// Declara el mapa con el tipo de arriba y úsalo.
export function colorDeNivel(n: Nivel): string {
  return falta();
}

// E8. Indexa una lista de usuarios por id.
// indexar([{id:1,...}]) -> { 1: {id:1,...} }
export function indexar(usuarios: Usuario[]): Record<number, Usuario> {
  return falta();
}

// --- comprobación -----------------------------------------------------------
type _c6 = Comprobar<Igual<ColoresPorNivel, Record<Nivel, string>>>;
export type _comprobaciones2 = [_c6];



/* ############################################################################
   34.3  LOS QUE SACAN TIPOS DE OTRAS COSAS
   ############################################################################

     ReturnType<typeof fn>       el tipo que DEVUELVE esa función
     Parameters<typeof fn>       una tupla con sus parámetros
     Awaited<T>                  el tipo de adentro de una Promise
     NonNullable<T>              quita null y undefined de una unión

     function crear() { return { id: 1, nombre: 'Ana' }; }
     type Creado = ReturnType<typeof crear>;       // { id: number; nombre: string }

     async function traer(): Promise<Usuario> { ... }
     type U = Awaited<ReturnType<typeof traer>>;   // Usuario

     type Texto = NonNullable<string | null>;      // string

   Para qué sirve: no repetir tipos. El caso estrella en Vue es tipar un store
   o un composable sin escribir la interfaz a mano:

     const useContador = () => ({ n: ref(0), subir: () => {} });
     type Contador = ReturnType<typeof useContador>;

   EJEMPLO --------------------------------------------------------------------
     type Args = Parameters<(a: string, b: number) => void>;   // [string, number]
   -------------------------------------------------------------------------- */

export function crearUsuario() {
  return { id: 1, nombre: 'Ana', activo: true };
}

export async function traerUsuario(): Promise<Usuario> {
  return { id: 1, nombre: 'Ana', email: 'a@b.c', activo: true };
}

// E9. `UsuarioCreado` = lo que devuelve crearUsuario, SIN escribirlo a mano.
export type UsuarioCreado = object;   // TODO: ReturnType<typeof crearUsuario>

// E10. `UsuarioTraido` = lo que hay DENTRO de la promesa de traerUsuario.
export type UsuarioTraido = object;   // TODO: Awaited<ReturnType<typeof traerUsuario>>

// E11. `TextoSeguro` = string sin null ni undefined.
export type TextoSeguro = string | null | undefined;   // TODO: NonNullable

// --- comprobaciones ---------------------------------------------------------
type _c9 = Comprobar<Igual<UsuarioCreado, { id: number; nombre: string; activo: boolean }>>;
type _c10 = Comprobar<Igual<UsuarioTraido, Usuario>>;
type _c11 = Comprobar<Igual<TextoSeguro, string>>;
export type _comprobaciones3 = [_c9, _c10, _c11];



/* ############################################################################
   34.4  LOS DE TEXTO Y LOS DE UNIÓN
   ############################################################################

     Uppercase<'ok'>        // 'OK'
     Lowercase<'OK'>        // 'ok'
     Capitalize<'ana'>      // 'Ana'

     Exclude<'a'|'b'|'c', 'b'>     // 'a' | 'c'      quita de una UNIÓN
     Extract<'a'|'b', 'b'|'z'>     // 'b'            se queda con lo común

   Ojo: Omit/Pick trabajan sobre OBJETOS; Exclude/Extract sobre UNIONES.

   Plantillas de texto (template literal types), que se ven en las props:

     type Evento = `on${Capitalize<'click' | 'focus'>}`;   // 'onClick' | 'onFocus'

   EJEMPLO --------------------------------------------------------------------
     type SinAlto = Exclude<Nivel, 'alto'>;        // 'bajo' | 'medio'
   -------------------------------------------------------------------------- */

// E12. `NivelesBajos` = Nivel sin 'alto'.
export type NivelesBajos = Nivel;   // TODO: usa Exclude

// E13. Devuelve el nivel en mayúsculas.
// enMayusculas('bajo') -> 'BAJO'
export function enMayusculas(n: Nivel): Uppercase<Nivel> {
  return falta();
}

// --- comprobación -----------------------------------------------------------
type _c12 = Comprobar<Igual<NivelesBajos, 'bajo' | 'medio'>>;
export type _comprobaciones4 = [_c12];


/* ============================================================================
   SOLUCIONES
   ----------------------------------------------------------------------------
   E1   export type NuevoUsuario = Omit<Usuario, 'id'>;
   E2   export type CambiosUsuario = Partial<Omit<Usuario, 'id'>>;
   E3   export type FilaTabla = Pick<Usuario, 'id' | 'nombre'>;
   E4   return { ...u, ...cambios };
   E5   return { id: u.id, nombre: u.nombre };
   E6   export type ColoresPorNivel = Record<Nivel, string>;
   E7   const colores: ColoresPorNivel = {
          bajo: 'verde', medio: 'amarillo', alto: 'rojo',
        };
        return colores[n];
   E8   return usuarios.reduce<Record<number, Usuario>>((acc, u) => {
          acc[u.id] = u;
          return acc;
        }, {});
   E9   export type UsuarioCreado = ReturnType<typeof crearUsuario>;
   E10  export type UsuarioTraido = Awaited<ReturnType<typeof traerUsuario>>;
   E11  export type TextoSeguro = NonNullable<string | null | undefined>;
   E12  export type NivelesBajos = Exclude<Nivel, 'alto'>;
   E13  return n.toUpperCase() as Uppercase<Nivel>;
   ============================================================================ */
