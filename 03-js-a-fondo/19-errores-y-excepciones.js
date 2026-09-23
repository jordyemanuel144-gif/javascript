/* ============================================================================
   19 · ERRORES Y EXCEPCIONES
   Nivel 3 · JavaScript a fondo
   ----------------------------------------------------------------------------
   En un proyecto real, la mitad del código es "qué pasa si sale mal": la API
   devuelve 500, el campo viene null, el usuario escribe cualquier cosa.

   CÓMO ESTÁ ARMADO: pasos cortos, ejercicios cortos, soluciones por bloque.
   Corrige con:   node verificar.js 19
   ============================================================================ */


/* ############################################################################
   19.1  try / catch
   ############################################################################
     try {
       // código que puede fallar
     } catch (error) {
       // se ejecuta SOLO si algo de arriba reventó
     }

   Si algo dentro del try falla, se salta el RESTO del try y cae al catch.

     try {
       const datos = JSON.parse('esto no es json');   // revienta aquí
       console.log('nunca llego');                    // no se ejecuta
     } catch (error) {
       console.log('salió mal');
     }

   El parámetro se puede omitir si no lo usas:  catch { ... }
############################################################################ */

// E1. Devuelve el objeto del JSON, o null si el texto es inválido.
// parsearSeguro('{"a":1}') -> { a: 1 } ;  parsearSeguro('roto') -> null
function parsearSeguro(texto) {
  // TODO: try con JSON.parse, catch que devuelve null
}

// E2. Ejecuta el callback y devuelve su resultado. Si lanza, devuelve
// `respaldo`.
// intentar(() => 1 + 1, 0) -> 2 ;  intentar(() => { throw new Error() }, 0) -> 0
function intentar(fn, respaldo) {
  // TODO
}

/* SOLUCIONES 19.1 ------------------------------------------------------------
   E1   try { return JSON.parse(texto); } catch { return null; }
   E2   try { return fn(); } catch { return respaldo; }
-------------------------------------------------------------------------- */


/* ############################################################################
   19.2  finally — el que se ejecuta siempre
   ############################################################################
     try {
       ...
     } catch (error) {
       ...
     } finally {
       // pase lo que pase: haya fallado o no
     }

   Para qué sirve de verdad: apagar el spinner.

     cargando = true;
     try {
       datos = await traer();
     } catch (e) {
       error = e.message;
     } finally {
       cargando = false;      // si esto estuviera dentro del try, un error
     }                        // dejaría el spinner girando para siempre
############################################################################ */

// E3. Devuelve un array con el orden REAL de ejecución.
// La idea: metes 'try' dentro del try (antes de lanzar), 'catch' en el catch
// y 'finally' en el finally.
// ordenDeEjecucion() -> ['try', 'catch', 'finally']
function ordenDeEjecucion() {
  const pasos = [];
  // TODO:
  // try { pasos.push('try'); throw new Error('x'); }
  // catch { ... }
  // finally { ... }
  return pasos;
}

/* SOLUCIONES 19.2 ------------------------------------------------------------
   E3   try {
          pasos.push('try');
          throw new Error('x');
        } catch {
          pasos.push('catch');
        } finally {
          pasos.push('finally');
        }
        return pasos;
-------------------------------------------------------------------------- */


/* ############################################################################
   19.3  throw — lanzar un error a propósito
   ############################################################################
     throw new Error('El precio no puede ser negativo');

   Un Error trae tres cosas:
     error.message    // el texto que le pasaste
     error.name       // 'Error', 'TypeError', 'RangeError'...
     error.stack      // dónde se rompió

   ⚠ Se puede lanzar cualquier cosa (`throw 'texto'`), pero NO lo hagas:
     pierdes el stack. Siempre `new Error(...)`.
############################################################################ */

// E4. Si el divisor es 0, lanza Error('División por cero'). Si no, divide.
// dividir(10, 2) -> 5 ;  dividir(1, 0) -> lanza
function dividir(a, b) {
  // TODO
}

// E5. Devuelve el MENSAJE del error si la función lanza, o null si no lanza.
// mensajeDeError(() => { throw new Error('uy') }) -> 'uy'
// mensajeDeError(() => 1) -> null
function mensajeDeError(fn) {
  // TODO: llama a fn() dentro del try; si llega al final, devuelve null
}

/* SOLUCIONES 19.3 ------------------------------------------------------------
   E4   if (b === 0) throw new Error('División por cero');
        return a / b;
   E5   try {
          fn();
          return null;
        } catch (e) {
          return e.message;
        }
-------------------------------------------------------------------------- */


/* ############################################################################
   19.4  ERRORES PROPIOS
   ############################################################################
   Una clase que extiende Error (tema 17.7). Sirve para distinguir QUÉ falló:

     class ErrorValidacion extends Error {
       constructor(campo) {
         super(`El campo ${campo} es obligatorio`);   // el mensaje
         this.name = 'ErrorValidacion';
         this.campo = campo;                          // dato extra propio
       }
     }

     try {
       throw new ErrorValidacion('email');
     } catch (e) {
       e instanceof ErrorValidacion;   // true
       e.campo;                        // 'email'
       e.message;                      // 'El campo email es obligatorio'
     }
############################################################################ */

// E6. Error propio con el campo que falló.
// const e = new ErrorValidacion('email');
// e.message -> 'El campo email es obligatorio' ; e.campo -> 'email'
class ErrorValidacion extends Error {
  // TODO
}

/* SOLUCIONES 19.4 ------------------------------------------------------------
   E6   class ErrorValidacion extends Error {
          constructor(campo) {
            super(`El campo ${campo} es obligatorio`);
            this.name = 'ErrorValidacion';
            this.campo = campo;
          }
        }
-------------------------------------------------------------------------- */


/* ############################################################################
   19.5  A VECES NO HACE FALTA try/catch
   ############################################################################
   Si el problema es que falta un dato, no hay que atrapar nada: se evita.

     usuario.perfil.nombre          // revienta si no hay perfil
     usuario?.perfil?.nombre        // undefined, sin error
     usuario?.perfil?.nombre ?? 'anónimo'

   Regla: try/catch es para lo que NO puedes prever (la red, un JSON roto).
   Para datos que pueden faltar, `?.` y `??`.
############################################################################ */

// E7. Devuelve el nombre del usuario, o 'anónimo' si falta cualquier nivel.
// nombreSeguro({perfil:{nombre:'Ana'}}) -> 'Ana' ;  nombreSeguro(null) -> 'anónimo'
function nombreSeguro(usuario) {
  // TODO: ?. encadenado + ??  (sin try/catch)
}

/* SOLUCIONES 19.5 ------------------------------------------------------------
   E7   return usuario?.perfil?.nombre ?? 'anónimo';
-------------------------------------------------------------------------- */


/* ############################################################################
   19.6  VALIDAR TEMPRANO (guard clauses)
   ############################################################################
   En vez de anidar ifs, cortas al principio y sigues con el camino feliz:

     function crearUsuario(datos) {
       if (!datos)         throw new Error('Faltan los datos');
       if (!datos.email)   throw new Error('Falta el email');
       if (datos.edad < 0) throw new Error('Edad inválida');

       return { ...datos, creado: true };     // sin anidar nada
     }

   Se lee mucho mejor que un if gigante, y es lo que verás en las actions de
   Pinia y en los services.
############################################################################ */

// E8. Valida con guard clauses y devuelve el objeto con `valido: true`.
//   sin nombre   -> lanza Error('Falta el nombre')
//   precio < 0   -> lanza Error('Precio inválido')
// validarProducto({nombre:'a', precio:1}) -> { nombre:'a', precio:1, valido:true }
function validarProducto(p) {
  // TODO
}

/* SOLUCIONES 19.6 ------------------------------------------------------------
   E8   if (!p.nombre) throw new Error('Falta el nombre');
        if (p.precio < 0) throw new Error('Precio inválido');
        return { ...p, valido: true };
-------------------------------------------------------------------------- */


/* ############################################################################
   19.7  QUÉ HACER EN EL catch
   ############################################################################

     try { hacerAlgo(); } catch (e) { }        // ✗ el peor código posible:
                                               //   falla en silencio

   Tienes tres opciones razonables:

   a) devolver algo por defecto (ya lo hiciste en E1 y E2)

   b) agregar contexto y relanzar
        catch (e) {
          throw new Error(`Falló al guardar el pedido: ${e.message}`);
        }

   c) devolver un resultado que diga si salió bien
        try {
          return { ok: true, valor: fn() };
        } catch (e) {
          return { ok: false, error: e.message };
        }

   La (c) es el patrón de los services: quien llama no necesita try/catch.

   Regla: atrapa el error solo si vas a HACER algo con él. Si no, déjalo subir.
############################################################################ */

// E9. Ejecuta la función; si lanza, relanza un Error nuevo con el mensaje
// 'Falló <contexto>: <mensaje original>'.
// conContexto(() => { throw new Error('timeout') }, 'la carga')
//   -> lanza Error('Falló la carga: timeout')
function conContexto(fn, contexto) {
  // TODO
}

// E10. Devuelve { ok: true, valor } si funciona, o { ok: false, error } si no.
// Nunca debe lanzar.
// aResultado(() => 5) -> { ok: true, valor: 5 }
// aResultado(() => { throw new Error('x') }) -> { ok: false, error: 'x' }
function aResultado(fn) {
  // TODO
}

/* SOLUCIONES 19.7 ------------------------------------------------------------
   E9   try {
          return fn();
        } catch (e) {
          throw new Error(`Falló ${contexto}: ${e.message}`);
        }
   E10  try {
          return { ok: true, valor: fn() };
        } catch (e) {
          return { ok: false, error: e.message };
        }
-------------------------------------------------------------------------- */


/* ############################################################################
   19.8  LOS ERRORES QUE VAS A VER EN LA CONSOLA
   ############################################################################
   ┌───────────────────────────────────────────┬────────────────────────────────┐
   │ Mensaje                                   │ Qué pasó de verdad             │
   ├───────────────────────────────────────────┼────────────────────────────────┤
   │ Cannot read properties of undefined       │ entraste con . a algo que no   │
   │   (reading 'nombre')                      │ existe -> usa ?.               │
   │ x is not a function                       │ x no es lo que creías (típico: │
   │                                           │ importaste mal, con/sin llaves)│
   │ x is not defined                          │ no la declaraste, o hay typo   │
   │ Unexpected token < in JSON                │ esperabas JSON y llegó HTML    │
   │                                           │ (normalmente una página 404)   │
   │ Assignment to constant variable           │ reasignaste una const          │
   │ Maximum call stack size exceeded          │ recursión infinita             │
   │ Unexpected end of input                   │ falta una llave o un paréntesis│
   └───────────────────────────────────────────┴────────────────────────────────┘

   El truco: leer el mensaje COMPLETO, incluido lo del paréntesis. Ahí está
   exactamente la propiedad que falló.
############################################################################ */


module.exports = {
  parsearSeguro, intentar, ordenDeEjecucion,
  dividir, mensajeDeError, ErrorValidacion,
  nombreSeguro, validarProducto,
  conContexto, aResultado,
};
