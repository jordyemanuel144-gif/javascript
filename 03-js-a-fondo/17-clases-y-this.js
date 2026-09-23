/* ============================================================================
   17 · CLASES Y `this`
   Nivel 3 · JavaScript a fondo
   ----------------------------------------------------------------------------
   En Vue 3 casi no vas a escribir clases, pero SÍ las vas a leer: servicios
   de API, modelos, errores propios, librerías. Y `this` aparece igual.

   CÓMO ESTÁ ARMADO: pasos cortos, ejercicios cortos, soluciones por bloque.
   Corrige con:   node verificar.js 17
   ============================================================================ */


/* ############################################################################
   17.1  `this` ES "EL OBJETO DE LA IZQUIERDA DEL PUNTO"
   ############################################################################
     const persona = {
       nombre: 'Ana',
       saludar() {                      // forma corta de  saludar: function()
         return `Hola ${this.nombre}`;  // this = persona
       },
     };
     persona.saludar();       // 'Hola Ana'
     //     ^ lo que está a la izquierda del punto ES el this

   `this` no depende de dónde escribiste la función, sino de CÓMO la llamas.
############################################################################ */

// E1. Completa el método para que devuelva 'Hola, soy <nombre>'.
// crearPersona('Ana').presentarse() -> 'Hola, soy Ana'
function crearPersona(nombre) {
  return {
    nombre,
    presentarse() {
      // TODO: usa this.nombre
    },
  };
}

// E2. Método que suma 1 a su propio campo `n` y devuelve el nuevo valor.
// const c = crearContador();  c.subir() -> 1 ;  c.subir() -> 2
function crearContador() {
  return {
    n: 0,
    subir() {
      // TODO: this.n = this.n + 1, y devuelve this.n
    },
  };
}

/* SOLUCIONES 17.1 ------------------------------------------------------------
   E1   presentarse() { return `Hola, soy ${this.nombre}`; }
   E2   subir() { this.n = this.n + 1; return this.n; }
-------------------------------------------------------------------------- */


/* ############################################################################
   17.2  EL `this` SE PIERDE SI SACAS EL MÉTODO DEL OBJETO
   ############################################################################
     const persona = { nombre: 'Ana', saludar() { return `Hola ${this.nombre}`; } };

     persona.saludar();            // 'Hola Ana'        ✓ hay punto
     const f = persona.saludar;
     f();                          // 'Hola undefined'  ✗ ya no hay objeto

   Pasa siempre que pasas el método como callback:
     boton.onclick = persona.saludar;     // se desprende

   Las dos soluciones:
     persona.saludar.bind(persona)    // lo ata para siempre
     () => persona.saludar()          // lo envuelves en una flecha (lo más usado)
############################################################################ */

// E3. Devuelve el método ya atado al objeto, para que funcione suelto.
// const f = atado(crearPersona('Ana'));  f() -> 'Hola, soy Ana'
function atado(persona) {
  // TODO: .bind(persona) sobre persona.presentarse
}

/* SOLUCIONES 17.2 ------------------------------------------------------------
   E3   return persona.presentarse.bind(persona);
-------------------------------------------------------------------------- */


/* ############################################################################
   17.3  LAS FLECHAS NO TIENEN `this` PROPIO
   ############################################################################
   Una flecha usa el `this` del lugar donde fue ESCRITA, y ya no cambia.

     const obj = {
       nombre: 'Ana',
       malo:  () => `Hola ${this.nombre}`,        // ✗ this NO es obj
       bueno() { return `Hola ${this.nombre}`; }, // ✓
     };

   Pero DENTRO de un método, la flecha es justo lo que quieres, porque
   conserva el this:

     listar() {
       return this.miembros.map(m => `${m} (${this.nombre})`);
       //                            ^ flecha: this sigue siendo el objeto
     }

   Regla: método del objeto -> función normal. Callback dentro del método ->
   flecha.
############################################################################ */

// E4. Devuelve los miembros con el nombre del equipo entre paréntesis.
// crearEquipo('Rojo', ['Ana']).listar() -> ['Ana (Rojo)']
function crearEquipo(nombre, miembros) {
  return {
    nombre,
    miembros,
    listar() {
      // TODO: map con FLECHA para no perder el this
    },
  };
}

/* SOLUCIONES 17.3 ------------------------------------------------------------
   E4   listar() { return this.miembros.map(m => `${m} (${this.nombre})`); }
-------------------------------------------------------------------------- */


/* ############################################################################
   17.4  class — la plantilla de un objeto (por partes)
   ############################################################################

   a) una clase con un campo y su valor inicial
        class Contador {
          n = 0;
        }
        const c = new Contador();     // `new` crea el objeto
        c.n;                          // 0

   b) un método (sin `function` y sin coma entre ellos)
        class Contador {
          n = 0;
          subir() { this.n++; return this.n; }
        }

   c) un constructor: se ejecuta al hacer `new`, y recibe los argumentos
        class Producto {
          constructor(nombre, precio) {
            this.nombre = nombre;
            this.precio = precio;
          }
        }
        new Producto('Mouse', 80);

   ⚠ Olvidarse el `new` da TypeError.
############################################################################ */

// E5. Clase Rectangulo: constructor(ancho, alto) y método area().
// new Rectangulo(3, 4).area() -> 12
class Rectangulo {
  // TODO
  area() {
    // TODO
  }
}

// E6. Clase Carrito: campo items = [], método agregar(precio) que apila,
// y método total() que suma.
// const c = new Carrito(); c.agregar(10); c.agregar(5); c.total() -> 15
class Carrito {
  // TODO
}

/* SOLUCIONES 17.4 ------------------------------------------------------------
   E5   class Rectangulo {
          constructor(ancho, alto) {
            this.ancho = ancho;
            this.alto = alto;
          }
          area() { return this.ancho * this.alto; }
        }
   E6   class Carrito {
          items = [];
          agregar(precio) { this.items.push(precio); }
          total() { return this.items.reduce((t, p) => t + p, 0); }
        }
-------------------------------------------------------------------------- */


/* ############################################################################
   17.5  GETTER — se lee como si fuera un dato, sin paréntesis
   ############################################################################
     class Temperatura {
       constructor(c) { this.c = c; }
       get fahrenheit() { return this.c * 9 / 5 + 32; }
     }
     new Temperatura(100).fahrenheit;     // 212   <- SIN ()

   Es la misma idea que un `computed` de Vue: un valor calculado que se lee
   como si fuera una propiedad.
############################################################################ */

// E7. Clase Circulo con radio y un GETTER `diametro` (radio * 2).
// new Circulo(5).diametro -> 10
class Circulo {
  // TODO
}

/* SOLUCIONES 17.5 ------------------------------------------------------------
   E7   class Circulo {
          constructor(radio) { this.radio = radio; }
          get diametro() { return this.radio * 2; }
        }
-------------------------------------------------------------------------- */


/* ############################################################################
   17.6  HEREDAR: extends y super
   ############################################################################
     class Animal {
       constructor(nombre) { this.nombre = nombre; }
       hablar() { return `${this.nombre} hace ruido`; }
     }

     class Perro extends Animal {
       constructor(nombre, raza) {
         super(nombre);        // llama al constructor del padre. OBLIGATORIO
         this.raza = raza;     // y va SIEMPRE después de super()
       }
       hablar() { return `${this.nombre} ladra`; }   // pisa el del padre
     }

   · Si la hija no escribe constructor, hereda el del padre tal cual.
   · `super.metodo()` llama al método del padre desde la hija.
############################################################################ */

class Vehiculo {
  constructor(marca) {
    this.marca = marca;
  }
  describir() {
    return `Vehículo ${this.marca}`;
  }
}

// E8. Moto extiende Vehiculo, agrega `cilindrada` y pisa describir() para
// devolver 'Moto <marca> de <cilindrada>cc'.
// new Moto('Honda', 250).describir() -> 'Moto Honda de 250cc'
class Moto extends Vehiculo {
  // TODO: constructor con super(marca), y describir()
}

/* SOLUCIONES 17.6 ------------------------------------------------------------
   E8   class Moto extends Vehiculo {
          constructor(marca, cilindrada) {
            super(marca);
            this.cilindrada = cilindrada;
          }
          describir() { return `Moto ${this.marca} de ${this.cilindrada}cc`; }
        }
-------------------------------------------------------------------------- */


/* ############################################################################
   17.7  instanceof Y ERRORES PROPIOS
   ############################################################################
     new Moto('Honda', 250) instanceof Vehiculo;    // true

   Un error propio es una clase que extiende Error. Se usa para distinguir
   qué falló dentro de un catch:

     class ErrorHttp extends Error {
       constructor(mensaje, codigo) {
         super(mensaje);          // Error ya guarda el mensaje
         this.name = 'ErrorHttp'; // si no, en consola sale 'Error' a secas
         this.codigo = codigo;
       }
     }

     try { ... } catch (e) {
       if (e instanceof ErrorHttp && e.codigo === 404) mostrarNoEncontrado();
     }
############################################################################ */

// E9. true si el objeto es una instancia de Vehiculo.
// esVehiculo(new Moto('Honda', 250)) -> true ;  esVehiculo({}) -> false
function esVehiculo(obj) {
  // TODO
}

// E10. Error propio con un código numérico.
// const e = new ErrorHttp('No existe', 404);
// e.message -> 'No existe' ; e.codigo -> 404 ; e instanceof Error -> true
class ErrorHttp extends Error {
  // TODO: constructor(mensaje, codigo) con super(mensaje)
}

/* SOLUCIONES 17.7 ------------------------------------------------------------
   E9   return obj instanceof Vehiculo;
   E10  class ErrorHttp extends Error {
          constructor(mensaje, codigo) {
            super(mensaje);
            this.name = 'ErrorHttp';
            this.codigo = codigo;
          }
        }
-------------------------------------------------------------------------- */


/* ############################################################################
   17.8  UNA CLASE DE SERVICIO (lo que sí verás en el proyecto)
   ############################################################################
     class ApiCliente {
       constructor(base) { this.base = base; }
       url(ruta) { return `${this.base}${ruta}`; }
     }

     export const api = new ApiCliente('https://mi-api.com');
     api.url('/usuarios');       // 'https://mi-api.com/usuarios'

   Se crea UNA vez y se exporta ya configurada. El resto de la app solo la usa.
############################################################################ */

// E11. Clase ApiCliente: guarda la base y arma urls.
// new ApiCliente('https://x.com').url('/users') -> 'https://x.com/users'
class ApiCliente {
  // TODO
}

/* SOLUCIONES 17.8 ------------------------------------------------------------
   E11  class ApiCliente {
          constructor(base) { this.base = base; }
          url(ruta) { return `${this.base}${ruta}`; }
        }
-------------------------------------------------------------------------- */


module.exports = {
  crearPersona, crearContador, atado, crearEquipo,
  Rectangulo, Carrito, Circulo,
  Vehiculo, Moto, esVehiculo, ErrorHttp, ApiCliente,
};
