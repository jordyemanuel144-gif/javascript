# Chuleta de TypeScript

---

## Tipos básicos

```ts
let a: string;      let b: number;      let c: boolean;
let d: string[];    let e: Array<number>;
let f: [string, number];          // tupla
let g: string | null;             // unión
let h: 'sm' | 'md' | 'lg';        // unión de literales
let i: unknown;                   // no sé qué es (hay que comprobar)
let j: any;                       // apaga TS (evítalo)
function k(): void { }            // no devuelve nada
function l(): never { throw 1; }  // nunca termina bien
```

## Objetos

```ts
interface Usuario {
  id: number;
  nombre: string;
  email: string | null;      // puede ser null
  telefono?: string;         // puede no venir
  readonly creado: string;   // no se reasigna
}

type Usuario = { id: number };              // equivalente para objetos

interface Admin extends Usuario { permisos: string[] }
type Admin = Usuario & { permisos: string[] };   // intersección

type Diccionario = Record<string, number>;
interface Indexado { [clave: string]: number }
```

**interface** → objetos y props · **type** → uniones, tuplas, alias, funciones

## Funciones

```ts
function f(a: number, b: string = 'x', c?: boolean): string { return b; }
const g = (a: number): number => a * 2;
function h(...nums: number[]): number { return 0; }

type Handler = (e: Event) => void;             // tipo función
type Validador = (v: string) => boolean;

async function t(): Promise<Usuario[]> { return []; }
```

## Narrowing (estrechar)

```ts
if (typeof x === 'string') { }        // primitivos
if (x) { }                            // descarta null/undefined
if (x === 'ok') { }                   // literales
if ('campo' in obj) { }               // objetos distintos
if (e instanceof Error) { }           // clases, Error, Date
if (Array.isArray(x)) { }             // array vs no array

function esTexto(v: unknown): v is string { return typeof v === 'string'; }
lista.filter((x): x is string => x !== null);     // quitar nulos
```

## Unión discriminada

```ts
type Peticion =
  | { estado: 'cargando' }
  | { estado: 'ok'; datos: string[] }
  | { estado: 'error'; mensaje: string };

switch (p.estado) {
  case 'ok': p.datos; break;          // TS sabe que aquí hay datos
  case 'error': p.mensaje; break;
}
```

## Genéricos

```ts
function primero<T>(lista: T[]): T | undefined { return lista[0]; }
function mapear<T, R>(l: T[], fn: (x: T) => R): R[] { return l.map(fn); }
function porId<T extends { id: number }>(l: T[], id: number) {
  return l.find(x => x.id === id);
}

interface Respuesta<T> { datos: T; total: number }
type Resultado<T> = { ok: true; valor: T } | { ok: false; error: string };
```

## Utility types

```ts
Partial<T>              // todo opcional
Required<T>             // todo obligatorio
Readonly<T>             // todo de solo lectura
Pick<T, 'a' | 'b'>      // solo esos campos
Omit<T, 'id'>           // sin esos campos
Record<K, V>            // objeto con claves K y valores V
ReturnType<typeof fn>   // lo que devuelve la función
Parameters<typeof fn>   // sus parámetros, como tupla
Awaited<T>              // lo de adentro de una Promise
NonNullable<T>          // sin null ni undefined
Exclude<U, 'a'>         // quita miembros de una UNIÓN
Extract<U, 'a'>         // se queda con los comunes
Uppercase<'ok'>         // 'OK'

type NuevoUsuario = Omit<Usuario, 'id'>;
type Cambios = Partial<Omit<Usuario, 'id'>>;
type Fila = Pick<Usuario, 'id' | 'nombre'>;
```

## keyof, typeof e índices

```ts
type Claves = keyof Usuario;              // 'id' | 'nombre' | ...
type T = typeof miObjeto;                 // el tipo de un VALOR
type Nombre = Usuario['nombre'];          // string
type Item = Pedido['items'][number];      // el tipo de un elemento

const ROLES = ['admin', 'lector'] as const;
type Rol = typeof ROLES[number];          // 'admin' | 'lector'

function leer<T, K extends keyof T>(o: T, k: K): T[K] { return o[k]; }
```

## Tipos mapeados

```ts
type Errores<T> = { [K in keyof T]?: string };
type Banderas<T> = { [K in keyof T]: boolean };
type SoloLectura<T> = { readonly [K in keyof T]: T[K] };
```

## as const y satisfies

```ts
const cfg = { url: '/api' } as const;                       // literales + readonly
const temas = { claro: '#fff' } satisfies Record<string, string>;   // valida sin ampliar
const temas = { claro: '#fff' } as const satisfies Record<string, string>;
```

## Clases

```ts
class Producto extends Base implements Vendible {
  constructor(
    public id: number,
    private costo: number,
    readonly creado: string = '',
  ) { super(); }

  get precio(): number { return this.costo * 2; }
}

abstract class Figura {
  abstract area(): number;
}

class ErrorHttp extends Error {
  constructor(msg: string, public codigo: number) {
    super(msg);
    this.name = 'ErrorHttp';
  }
}
```

## Aserciones (con cuidado)

```ts
const x = dato as Usuario;      // "confía, es un Usuario"
const y = el!;                  // "confía, no es null"
const z = dato as unknown as Y; // 🚩 señal de que algo está mal
```

## Errores frecuentes y su traducción

| Error | Significa |
|---|---|
| `Object is possibly 'null'` | puede ser null: comprueba antes |
| `Type 'X' is not assignable to type 'Y'` | le diste X donde pedía Y |
| `Property 'x' does not exist on type 'Y'` | typo, o el tipo está mal |
| `Parameter 'x' implicitly has an 'any' type` | falta anotar el parámetro |
| `Argument of type 'X' is not assignable...` | el argumento no encaja |
| `Type 'false' does not satisfy the constraint 'true'` | (en este curso) el tipo que escribiste no es el pedido |
| `Cannot find module './X.vue'` | falta `env.d.ts` o `vue-tsc` |

## En un proyecto Vue

```ts
import type { Ref, ComputedRef } from 'vue';

const n = ref(0);                        // Ref<number>, se infiere
const u = ref<Usuario | null>(null);     // hace falta el genérico
const lista = ref<Producto[]>([]);       // también

defineProps<{ titulo: string; items?: Item[] }>();
withDefaults(defineProps<Props>(), { items: () => [] });
defineEmits<{ guardar: [id: number]; cerrar: [] }>();
defineModel<string>();

vue-tsc --noEmit        // revisar tipos (tsc solo NO lee los .vue)
```
