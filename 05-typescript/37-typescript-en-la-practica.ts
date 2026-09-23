/* ============================================================================
   37 · TYPESCRIPT EN LA PRÁCTICA
   Nivel 5 · TypeScript
   ----------------------------------------------------------------------------
   Todo lo que no es sintaxis pero aparece el primer día en un proyecto real:
   el tsconfig, los `as`, los `!`, los archivos .d.ts y cómo tipar la API.
   Corrige con:  npm run ts 37     ·    npm run tipos
   ============================================================================ */

import { falta } from '../lib/mini-test';


/* ############################################################################
   37.1  EL tsconfig.json, EN CRISTIANO
   ############################################################################

     {
       "compilerOptions": {
         "target": "ES2022",        // a qué versión de JS compila
         "module": "esnext",        // qué sistema de módulos usa (import/export)
         "moduleResolution": "bundler",  // cómo busca los archivos (Vite = bundler)
         "strict": true,            // ← EL importante: activa todo lo bueno
         "noImplicitAny": true,     // prohíbe parámetros sin tipo
         "strictNullChecks": true,  // null y undefined hay que comprobarlos
         "esModuleInterop": true,   // deja mezclar import con librerías viejas
         "skipLibCheck": true,      // no revisa los tipos de node_modules (más rápido)
         "noEmit": true,            // no genera JS: de eso se encarga Vite
         "paths": {                 // los alias
           "@/*": ["./src/*"]
         }
       },
       "include": ["src/ ** / *.ts", "src/ ** / *.vue"]   <- sin los espacios
     }

   Las que te van a cambiar la vida:
     · strict: true                    -> déjalo siempre
     · noUncheckedIndexedAccess        -> hace que lista[0] sea `T | undefined`.
                                          Molesta al principio, salva bugs reales.
     · verbatimModuleSyntax            -> obliga a `import type` para los tipos

   ⚠ En un proyecto Vue hay DOS o TRES tsconfig: uno para la app, otro para
     node (vite.config.ts) y uno raíz que los referencia. Es normal.
   -------------------------------------------------------------------------- */


/* ############################################################################
   37.2  as, ! y cuándo NO usarlos
   ############################################################################

     const x = datos as Usuario;        // ASERCIÓN: "confía en mí, es un Usuario"
     const y = elemento!;               // NON-NULL: "confía, no es null"

   Los dos APAGAN a TypeScript. No convierten nada: solo le dicen que se calle.
   Si te equivocas, el error aparece en ejecución, que es justo lo que
   querías evitar.

   Cuándo SÍ son razonables:
     · `await r.json() as Usuario`   (json() devuelve any, no hay alternativa)
     · `document.getElementById('x') as HTMLInputElement`
     · después de un `if` que TS no puede seguir

   Cuándo NO:
     · para callar un error que no entiendes  -> ahí está el bug
     · `as any` para "arreglar" algo          -> lo estás escondiendo

   Alternativas mejores:
     comprobar con un if            (narrowing, tema 32)
     un type guard `x is Tipo`
     validar de verdad con zod

   ⚠ La doble aserción `x as unknown as Y` es la señal de alarma máxima: estás
     forzando dos tipos que no tienen nada que ver.

   EJEMPLO --------------------------------------------------------------------
     const input = document.querySelector('#buscar') as HTMLInputElement | null;
     input?.focus();                 // ✓ sigue comprobando el null
   -------------------------------------------------------------------------- */

export interface Usuario {
  id: number;
  nombre: string;
}

// E1. Convierte un valor `unknown` que SABES que es Usuario. Usa `as`.
export function comoUsuario(dato: unknown): Usuario {
  return falta();
}

// E2. Mejor que E1: comprueba de verdad y devuelve Usuario o null.
// esUsuario({id:1,nombre:'Ana'}) -> el objeto ;  esUsuario({}) -> null
export function aUsuarioSeguro(dato: unknown): Usuario | null {
  return falta();
}



/* ############################################################################
   37.3  TIPAR LO QUE VIENE DE LA API
   ############################################################################
   `response.json()` devuelve `any`. A partir de ahí TS no te protege más, así
   que ahí es donde hay que poner el tipo:

     async function traerUsuarios(): Promise<Usuario[]> {
       const r = await fetch('/api/usuarios');
       if (!r.ok) throw new Error(`HTTP ${r.status}`);
       return r.json() as Promise<Usuario[]>;      // o:  return await r.json();
     }

   Envoltorio genérico, que es lo que termina habiendo en todo proyecto:

     async function pedir<T>(url: string, opciones?: RequestInit): Promise<T> {
       const r = await fetch(url, opciones);
       if (!r.ok) throw new Error(`HTTP ${r.status}`);
       return r.json() as Promise<T>;
     }

     const usuarios = await pedir<Usuario[]>('/api/usuarios');

   ⚠ Recuerda: esto es una PROMESA, no una comprobación. Si el backend manda
     otra cosa, TS no se entera. Para garantizarlo de verdad hace falta
     validar en ejecución (zod, valibot). Lo normal en proyectos internos es
     confiar en el tipo y validar solo lo crítico.

   Tipos útiles que ya vienen:
     RequestInit    las opciones de fetch
     Response       lo que devuelve fetch
     HTMLInputElement, HTMLFormElement, Event, MouseEvent...
   -------------------------------------------------------------------------- */

// E3. Envoltorio genérico. Recibe la función que simula el fetch para poder
// probarlo. Si `ok` es false, lanza Error(`HTTP ${status}`).
export interface RespuestaFalsa {
  ok: boolean;
  status: number;
  json: () => Promise<unknown>;
}

export async function pedir<T>(fetchFn: () => Promise<RespuestaFalsa>): Promise<T> {
  return falta();
}



/* ############################################################################
   37.4  ARCHIVOS .d.ts Y `declare`
   ############################################################################
   Un `.d.ts` solo tiene TIPOS, no código. Sirve para:

   1) Decirle a TS cómo es una librería sin tipos:

        // tipos/mi-libreria.d.ts
        declare module 'mi-libreria' {
          export function hacerAlgo(x: string): number;
        }

   2) Declarar las variables de entorno (esto está en TODO proyecto Vue):

        // src/env.d.ts
        /// <reference types="vite/client" />

        interface ImportMetaEnv {
          readonly VITE_API_URL: string;
          readonly VITE_MODO: 'dev' | 'prod';
        }
        interface ImportMeta {
          readonly env: ImportMetaEnv;
        }

      Con eso, `import.meta.env.VITE_API_URL` autocompleta y es string.

   3) Decirle a TS que los .vue son componentes:

        declare module '*.vue' {
          import type { DefineComponent } from 'vue';
          const componente: DefineComponent<{}, {}, any>;
          export default componente;
        }

      Si ves el error "Cannot find module './Algo.vue' or its corresponding
      type declarations", casi siempre falta este archivo (o `vue-tsc`).

   4) Extender tipos globales:

        declare global {
          interface Window { miApp: { version: string } }
        }
        export {};        // ← necesario para que el archivo sea un módulo
   -------------------------------------------------------------------------- */


/* ############################################################################
   37.5  LOS TIPOS DE VUE QUE VAS A VER
   ############################################################################

     import type { Ref, ComputedRef, PropType } from 'vue';

     const n: Ref<number> = ref(0);
     const doble: ComputedRef<number> = computed(() => n.value * 2);

     // en un composable, lo normal es NO anotar y dejar que infiera:
     export function useContador(inicial = 0) {
       const n = ref(inicial);                    // Ref<number>
       const doble = computed(() => n.value * 2); // ComputedRef<number>
       return { n, doble };
     }

   Otros que aparecen:
     MaybeRef<T>        = T | Ref<T>        (acepta las dos cosas)
     UnwrapRef<T>       lo de adentro de un ref
     PropType<T>        solo en la API por objeto (defineComponent), no en
                        `<script setup>` con defineProps<...>()

   ⚠ La regla práctica: en Vue casi nunca hace falta anotar. Anota solo
     cuando el valor inicial no alcance:
        ref<Usuario | null>(null)
        ref<Producto[]>([])
   -------------------------------------------------------------------------- */

// E4. Simula un composable tipado: devuelve { valor, doble, subir }.
// El tipo se INFIERE solo, no hace falta anotarlo.
export function useContador(inicial: number = 0) {
  return falta() as { valor: number; doble: number; subir: () => number };
}



/* ############################################################################
   37.6  LOS ERRORES DE TS QUE MÁS VAS A VER (y qué hacer)
   ############################################################################

   ┌──────────────────────────────────────────────┬──────────────────────────────┐
   │ Error                                        │ Qué hacer                    │
   ├──────────────────────────────────────────────┼──────────────────────────────┤
   │ Object is possibly 'null' or 'undefined'     │ comprueba con if / ?. / ??   │
   │ Type 'X' is not assignable to type 'Y'       │ mira qué campo sobra o falta │
   │ Property 'x' does not exist on type 'Y'      │ typo, o el tipo está mal     │
   │ Parameter 'x' implicitly has an 'any' type   │ anota el parámetro           │
   │ Argument of type 'X' is not assignable...    │ el argumento no encaja       │
   │ Cannot find module './X.vue'                 │ falta env.d.ts o vue-tsc     │
   │ Type 'string' is not assignable to           │ usa la unión exacta, no      │
   │   type "'a' | 'b'"                           │   string suelto              │
   │ 'x' is declared but its value is never read  │ borra el import de más       │
   │ Property 'value' does not exist on type...   │ te falta el .value de un ref │
   └──────────────────────────────────────────────┴──────────────────────────────┘

   Consejos que ahorran horas:
     · Pasa el mouse sobre la variable: el editor te dice el tipo REAL.
     · `Ctrl+clic` en un tipo te lleva a su definición.
     · Si el error es largo, léelo de abajo hacia arriba: la última línea
       suele ser la causa concreta.
     · En Vue, revisa tipos con `vue-tsc --noEmit` (tsc solo no lee los .vue).
   -------------------------------------------------------------------------- */

// E5. Cierre del nivel: recibe una respuesta de la API que puede traer campos
// faltantes y devuelve un Usuario completo con valores por defecto.
// normalizar({ id: 1 })                  -> { id: 1, nombre: 'sin nombre' }
// normalizar({ id: 2, nombre: 'Ana' })   -> { id: 2, nombre: 'Ana' }
// normalizar({})                         -> { id: 0, nombre: 'sin nombre' }
export function normalizar(dato: Partial<Usuario>): Usuario {
  return falta();
}


/* ============================================================================
   SOLUCIONES
   ----------------------------------------------------------------------------
   E1   return dato as Usuario;
   E2   if (
          typeof dato === 'object' && dato !== null &&
          typeof (dato as any).id === 'number' &&
          typeof (dato as any).nombre === 'string'
        ) {
          return dato as Usuario;
        }
        return null;
   E3   const r = await fetchFn();
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return await r.json() as T;
   E4   let valor = inicial;
        return {
          valor,
          doble: valor * 2,
          subir: () => ++valor,
        };
        (en Vue de verdad esto se hace con ref y computed: tema 40)
   E5   return {
          id: dato.id ?? 0,
          nombre: dato.nombre ?? 'sin nombre',
        };
   ============================================================================ */
