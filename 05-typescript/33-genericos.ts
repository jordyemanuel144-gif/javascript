/* ============================================================================
   33 · GENÉRICOS
   Nivel 5 · TypeScript
   ----------------------------------------------------------------------------
   Los <corchetes angulares> que dan miedo la primera vez. Son solo un
   "parámetro de tipo": en vez de fijar el tipo, se lo pasas al usarlo.
   Ya los has usado sin saberlo: `Array<string>`, `Promise<Usuario>`, `ref<number>`.
   Corrige con:  npm run ts 33     ·    npm run tipos
   ============================================================================ */

import { falta } from '../lib/mini-test';
import type { Igual, Comprobar } from '../lib/tipos';


/* ############################################################################
   33.1  EL PROBLEMA QUE RESUELVEN
   ############################################################################
   Quieres una función que devuelva el primer elemento de un array:

     function primero(lista: any[]): any { return lista[0]; }
     const n = primero([1, 2]);        // n es `any` -> perdiste los tipos

   Con un genérico, el tipo ENTRA y SALE:

     function primero<T>(lista: T[]): T {
       return lista[0];
     }

     primero([1, 2]);            // number
     primero(['a']);             // string
     primero([{ id: 1 }]);       // { id: number }

   Cómo se lee:
     · `<T>` declara un hueco de tipo (T de "Type"; puede llamarse como sea)
     · `lista: T[]` dice "un array de eso"
     · `: T` dice "devuelvo eso mismo"

   TS lo deduce solo al llamarte. También puedes decirlo a mano:
     primero<string>(['a']);

   EJEMPLO --------------------------------------------------------------------
     function envolver<T>(valor: T): T[] { return [valor]; }
     envolver(5);          // number[]
     envolver('a');        // string[]
   -------------------------------------------------------------------------- */

// E1. Devuelve el primer elemento (o undefined si el array está vacío).
export function primero<T>(lista: T[]): T | undefined {
  return falta();
}

// E2. Devuelve el último elemento.
export function ultimo<T>(lista: T[]): T | undefined {
  return falta();
}

// E3. Envuelve el valor en un array de un solo elemento.
// envolver(5) -> [5]
export function envolver<T>(valor: T): T[] {
  return falta();
}

// E4. Devuelve una copia invertida del array (sin mutar el original).
export function invertir<T>(lista: T[]): T[] {
  return falta();
}



/* ############################################################################
   33.2  VARIOS PARÁMETROS DE TIPO
   ############################################################################

     function par<A, B>(a: A, b: B): [A, B] {
       return [a, b];
     }
     par('x', 1);            // [string, number]

   Nombres habituales (son convención, no obligación):
     T  un tipo cualquiera      ·  K  una clave (Key)
     V  un valor (Value)        ·  E  un elemento

   En un mapeo:
     function mapear<T, R>(lista: T[], fn: (item: T) => R): R[] {
       return lista.map(fn);
     }
     mapear([1, 2], n => `#${n}`);      // string[]

   Fíjate: T entra, R sale. Eso es exactamente `.map` de JS, tipado.

   EJEMPLO --------------------------------------------------------------------
     function intercambiar<A, B>(t: [A, B]): [B, A] {
       return [t[1], t[0]];
     }
   -------------------------------------------------------------------------- */

// E5. Devuelve una tupla con los dos valores.
// par('x', 1) -> ['x', 1]
export function par<A, B>(a: A, b: B): [A, B] {
  return falta();
}

// E6. Aplica fn a cada elemento y devuelve el array resultante.
// mapear([1,2], n => `#${n}`) -> ['#1','#2']
export function mapear<T, R>(lista: T[], fn: (item: T) => R): R[] {
  return falta();
}

// E7. Intercambia las posiciones de una tupla.
// intercambiar(['a', 1]) -> [1, 'a']
export function intercambiar<A, B>(t: [A, B]): [B, A] {
  return falta();
}



/* ############################################################################
   33.3  RESTRINGIR CON extends
   ############################################################################
   A veces el tipo no puede ser CUALQUIER cosa. `extends` pone condiciones:

     function largo<T extends { length: number }>(x: T): number {
       return x.length;               // ✓ TS sabe que tiene length
     }
     largo('abc');       // 3
     largo([1, 2]);      // 2
     largo(5);           // ✗ error: number no tiene length

   El caso más usado en proyectos: "objetos que tienen id".

     interface ConId { id: number }

     function buscarPorId<T extends ConId>(lista: T[], id: number): T | undefined {
       return lista.find(x => x.id === id);
     }

   Devuelve el tipo COMPLETO que le pasaste, no un `ConId` pelado. Por eso
   sigue autocompletando todos los campos.

   Valor por defecto del genérico:
     function crear<T = string>(): T[] { return []; }

   EJEMPLO --------------------------------------------------------------------
     interface Producto extends ConId { nombre: string }
     const p = buscarPorId<Producto>(productos, 1);
     p?.nombre;         // ✓ sigue sabiendo que hay nombre
   -------------------------------------------------------------------------- */

export interface ConId {
  id: number;
}

// E8. Busca por id en cualquier lista de objetos con id.
export function buscarPorId<T extends ConId>(lista: T[], id: number): T | undefined {
  return falta();
}

// E9. Devuelve los ids de la lista.
// ids([{id:1},{id:2}]) -> [1,2]
export function ids<T extends ConId>(lista: T[]): number[] {
  return falta();
}

// E10. Quita de la lista el elemento con ese id (sin mutar).
export function quitarPorId<T extends ConId>(lista: T[], id: number): T[] {
  return falta();
}



/* ############################################################################
   33.4  GENÉRICOS EN TIPOS E INTERFACES
   ############################################################################
   No son solo para funciones. La respuesta de una API es el caso típico:

     interface Respuesta<T> {
       datos: T;
       total: number;
       pagina: number;
     }

     type RespuestaUsuarios = Respuesta<Usuario[]>;
     //    datos: Usuario[]  ·  total: number  ·  pagina: number

   Así tipas UNA vez el sobre y lo reutilizas con cualquier contenido:

     const r: Respuesta<Producto[]> = await pedir('/api/productos');
     r.datos[0].nombre;             // ✓ autocompleta Producto

   Lo mismo con un resultado:

     type Resultado<T> =
       | { ok: true; valor: T }
       | { ok: false; error: string };

   EJEMPLO --------------------------------------------------------------------
     interface Caja<T> { contenido: T }
     const c: Caja<number> = { contenido: 5 };
   -------------------------------------------------------------------------- */

// E11. Declara la interfaz genérica `Respuesta<T>` con:
//   datos: T · total: number
export interface Respuesta<T> {
  // TODO
  datos: T;
}

// E12. Declara el tipo genérico `Resultado<T>`:
//   { ok: true, valor: T }  |  { ok: false, error: string }
export type Resultado<T> = { ok: true; valor: T };   // TODO: agrega la otra rama

// E13. Envuelve los datos en una Respuesta con el total calculado.
// empaquetar([1,2]) -> { datos: [1,2], total: 2 }
export function empaquetar<T>(datos: T[]): Respuesta<T[]> {
  return falta();
}

// E14. Ejecuta la función; devuelve { ok:true, valor } o { ok:false, error }.
// intentar(() => 5) -> { ok: true, valor: 5 }
export function intentar<T>(fn: () => T): Resultado<T> {
  return falta();
}

// --- comprobaciones ---------------------------------------------------------
type _c11 = Comprobar<Igual<Respuesta<string>, { datos: string; total: number }>>;
type _c12 = Comprobar<
  Igual<Resultado<number>, { ok: true; valor: number } | { ok: false; error: string }>
>;
export type _comprobaciones = [_c11, _c12];



/* ############################################################################
   33.5  DÓNDE LOS VAS A VER EN VUE
   ############################################################################

     const contador = ref<number>(0);            // Ref<number>
     const usuario = ref<Usuario | null>(null);  // el más común de todos
     const lista = ref<Producto[]>([]);

     const props = defineProps<{ items: Producto[] }>();
     const emit = defineEmits<{ guardar: [id: number] }>();

     computed<string>(() => ...)
     useRoute() / useRouter()                     // ya vienen tipados

   La regla práctica: cuando el valor inicial NO alcanza para deducir el tipo
   (null, [], {}), pon el genérico a mano. Si el valor inicial ya dice todo
   (0, 'texto'), no hace falta.

        ref(0)                    // Ref<number>            ✓ no hace falta
        ref(null)                 // Ref<null>              ✗ te va a molestar
        ref<Usuario | null>(null) // Ref<Usuario | null>    ✓ así
   -------------------------------------------------------------------------- */

// E15. Simula un `ref`: devuelve un objeto { value } tipado.
// const r = crearRef<number>(0);  r.value -> 0
export function crearRef<T>(inicial: T): { value: T } {
  return falta();
}


/* ============================================================================
   SOLUCIONES
   ----------------------------------------------------------------------------
   E1   return lista[0];
   E2   return lista[lista.length - 1];
   E3   return [valor];
   E4   return [...lista].reverse();
   E5   return [a, b];
   E6   return lista.map(fn);
   E7   return [t[1], t[0]];
   E8   return lista.find(x => x.id === id);
   E9   return lista.map(x => x.id);
   E10  return lista.filter(x => x.id !== id);
   E11  export interface Respuesta<T> { datos: T; total: number }
   E12  export type Resultado<T> =
          | { ok: true; valor: T }
          | { ok: false; error: string };
   E13  return { datos, total: datos.length };
   E14  try {
          return { ok: true, valor: fn() };
        } catch (e) {
          return { ok: false, error: e instanceof Error ? e.message : 'error' };
        }
   E15  return { value: inicial };
   ============================================================================ */
