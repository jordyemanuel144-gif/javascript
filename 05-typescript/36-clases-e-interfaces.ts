/* ============================================================================
   36 · CLASES E INTERFACES EN TYPESCRIPT
   Nivel 5 · TypeScript
   ----------------------------------------------------------------------------
   Lo mismo del tema 17, ahora tipado. En Vue 3 con Composition API escribirás
   pocas clases, pero las vas a leer en servicios, modelos y errores.
   Corrige con:  npm run ts 36     ·    npm run tipos
   ============================================================================ */

import { falta } from '../lib/mini-test';


/* ############################################################################
   36.1  CLASE TIPADA
   ############################################################################

     class Producto {
       id: number;                       // hay que DECLARAR los campos
       nombre: string;
       descuento = 0;                    // con valor inicial, se infiere number

       constructor(id: number, nombre: string) {
         this.id = id;
         this.nombre = nombre;
       }
     }

   Atajo: si pones un modificador en el parámetro del constructor, TS declara
   y asigna el campo solo. Esto es lo que más vas a ver:

     class Producto {
       constructor(
         public id: number,
         public nombre: string,
         private costo: number = 0,
       ) {}
     }
     // equivale a declarar los tres campos y hacer this.x = x

   Modificadores de acceso:
     public      (por defecto) se ve desde todos lados
     private     solo dentro de la clase
     protected   dentro de la clase y de las que la extienden
     readonly    no se puede reasignar después del constructor

   ⚠ `private` es solo de TypeScript: al compilar desaparece. El `#campo` de
     JavaScript sí es privado de verdad en ejecución.

   EJEMPLO --------------------------------------------------------------------
     class Contador {
       constructor(private n = 0) {}
       subir(): number { return ++this.n; }
     }
   -------------------------------------------------------------------------- */

// E1. Clase Rectangulo con ancho y alto públicos (usa el atajo del
// constructor) y un método area(): number.
export class Rectangulo {
  // TODO
  area(): number {
    return falta();
  }
}

// E2. Clase Contador con un campo PRIVADO `n` que empieza en 0,
// un método subir(): number y un getter `valor`.
export class Contador {
  // TODO
  subir(): number {
    return falta();
  }
  get valor(): number {
    return falta();
  }
}



/* ############################################################################
   36.2  implements — la clase cumple un contrato
   ############################################################################

     interface Repositorio<T> {
       listar(): Promise<T[]>;
       traer(id: number): Promise<T | null>;
     }

     class RepoUsuarios implements Repositorio<Usuario> {
       async listar(): Promise<Usuario[]> { ... }
       async traer(id: number): Promise<Usuario | null> { ... }
     }

   Si te olvidas un método o le cambias la firma, TS te avisa en la línea del
   `implements`. Es la forma de garantizar que dos implementaciones (la real
   y la de mentira para los tests) sean intercambiables.

   Diferencia con `extends`:
     extends     hereda CÓDIGO de otra clase (solo una)
     implements  promete cumplir una FORMA (se pueden varias)

   EJEMPLO --------------------------------------------------------------------
     interface Saludador { saludar(): string }
     class Es implements Saludador { saludar() { return 'Hola'; } }
     class En implements Saludador { saludar() { return 'Hello'; } }
   -------------------------------------------------------------------------- */

export interface Figura {
  area(): number;
  nombre(): string;
}

// E3. Clase Circulo que IMPLEMENTE Figura.
// new Circulo(2).area() -> 12.57 (redondeado a 2 decimales)
// new Circulo(2).nombre() -> 'círculo'
export class Circulo implements Figura {
  // TODO: constructor(public radio: number) y los dos métodos
  area(): number {
    return falta();
  }
  nombre(): string {
    return falta();
  }
}

// E4. Devuelve el área total de una lista de figuras (de cualquier clase).
export function areaTotal(figuras: Figura[]): number {
  return falta();
}



/* ############################################################################
   36.3  HERENCIA TIPADA
   ############################################################################

     abstract class Base {
       constructor(public id: number) {}
       abstract describir(): string;        // obliga a las hijas a definirlo
       comun(): string { return `#${this.id}`; }
     }

     class Hija extends Base {
       constructor(id: number, public nombre: string) {
         super(id);                         // obligatorio, y antes de this
       }
       describir(): string { return `${this.comun()} ${this.nombre}`; }
     }

   · `abstract class` no se puede instanciar: es solo para heredar.
   · `abstract metodo()` no tiene cuerpo: la hija está obligada a escribirlo.
   · `super(...)` llama al constructor del padre.
   · `super.metodo()` llama al método del padre.

   EJEMPLO --------------------------------------------------------------------
     new Hija(1, 'Ana').describir();       // "#1 Ana"
   -------------------------------------------------------------------------- */

export abstract class Vehiculo {
  constructor(public marca: string) {}
  abstract ruedas(): number;
  describir(): string {
    return `${this.marca} (${this.ruedas()} ruedas)`;
  }
}

// E5. Moto extiende Vehiculo y tiene 2 ruedas.
// new Moto('Honda').describir() -> 'Honda (2 ruedas)'
export class Moto extends Vehiculo {
  // TODO
  ruedas(): number {
    return falta();
  }
}

// E6. Auto extiende Vehiculo, tiene 4 ruedas y agrega `puertas`.
// new Auto('Toyota', 5).describir() -> 'Toyota (4 ruedas)'
export class Auto extends Vehiculo {
  // TODO: constructor(marca: string, public puertas: number) con super(marca)
  ruedas(): number {
    return falta();
  }
}



/* ############################################################################
   36.4  ERRORES PROPIOS TIPADOS
   ############################################################################

     export class ErrorHttp extends Error {
       constructor(
         mensaje: string,
         public readonly codigo: number,
         public readonly url?: string,
       ) {
         super(mensaje);
         this.name = 'ErrorHttp';
       }
     }

     try {
       ...
     } catch (e) {
       if (e instanceof ErrorHttp && e.codigo === 401) irALogin();
       else if (e instanceof Error) mostrar(e.message);
     }

   ⚠ En TS, lo que atrapa un `catch` es de tipo `unknown` (con strict). Por
     eso SIEMPRE hay que comprobar con instanceof antes de usar `.message`.

   ⚠ Al extender Error hay que poner `this.name`, si no todos los errores se
     llaman "Error" en la consola.
   -------------------------------------------------------------------------- */

// E7. ErrorHttp con mensaje y código.
export class ErrorHttp extends Error {
  // TODO: constructor(mensaje: string, public codigo: number)
}

// E8. Devuelve el texto adecuado según el error:
//   ErrorHttp con 404 -> 'No encontrado'
//   otro ErrorHttp    -> `Error ${codigo}`
//   Error normal      -> su mensaje
//   cualquier otra cosa -> 'Error desconocido'
export function textoDeError(e: unknown): string {
  return falta();
}



/* ############################################################################
   36.5  UNA CLASE DE SERVICIO (como la verás en el proyecto)
   ############################################################################

     export class ApiCliente {
       constructor(private readonly base: string) {}

       private url(ruta: string): string {
         return `${this.base}${ruta}`;
       }

       async traer<T>(ruta: string): Promise<T> {
         const r = await fetch(this.url(ruta));
         if (!r.ok) throw new ErrorHttp(`HTTP ${r.status}`, r.status);
         return r.json() as Promise<T>;
       }
     }

     export const api = new ApiCliente('/api');
     const usuarios = await api.traer<Usuario[]>('/usuarios');

   Fíjate en el genérico del método: quien llama decide qué tipo espera.
   -------------------------------------------------------------------------- */

// E9. Clase ApiCliente: guarda la base (privada) y arma urls con un método
// público `url(ruta)`.
// new ApiCliente('/api').url('/usuarios') -> '/api/usuarios'
export class ApiCliente {
  // TODO
  url(ruta: string): string {
    return falta();
  }
}


/* ============================================================================
   SOLUCIONES
   ----------------------------------------------------------------------------
   E1   export class Rectangulo {
          constructor(public ancho: number, public alto: number) {}
          area(): number { return this.ancho * this.alto; }
        }
   E2   export class Contador {
          private n = 0;
          subir(): number { this.n++; return this.n; }
          get valor(): number { return this.n; }
        }
   E3   export class Circulo implements Figura {
          constructor(public radio: number) {}
          area(): number { return Number((Math.PI * this.radio ** 2).toFixed(2)); }
          nombre(): string { return 'círculo'; }
        }
   E4   return figuras.reduce((t, f) => t + f.area(), 0);
   E5   export class Moto extends Vehiculo {
          ruedas(): number { return 2; }
        }
   E6   export class Auto extends Vehiculo {
          constructor(marca: string, public puertas: number) { super(marca); }
          ruedas(): number { return 4; }
        }
   E7   export class ErrorHttp extends Error {
          constructor(mensaje: string, public codigo: number) {
            super(mensaje);
            this.name = 'ErrorHttp';
          }
        }
   E8   if (e instanceof ErrorHttp) {
          return e.codigo === 404 ? 'No encontrado' : `Error ${e.codigo}`;
        }
        if (e instanceof Error) return e.message;
        return 'Error desconocido';
   E9   export class ApiCliente {
          constructor(private readonly base: string) {}
          url(ruta: string): string { return `${this.base}${ruta}`; }
        }
   ============================================================================ */
