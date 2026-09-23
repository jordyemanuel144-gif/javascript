/* ============================================================================
   23 · PROMESAS
   Nivel 4 · JavaScript asíncrono
   ----------------------------------------------------------------------------
   Una promesa es "un valor que todavía no está, pero va a estar". Todo lo que
   toca la red en un proyecto Vue devuelve una promesa.
   Corrige con:   node verificar.js 23
   ============================================================================ */


/* ############################################################################
   23.1  QUÉ ES UNA PROMESA
   ############################################################################
   Un objeto con TRES estados posibles:

     pending    (pendiente)  -> todavía trabajando
     fulfilled  (cumplida)   -> salió bien, tiene un VALOR
     rejected   (rechazada)  -> salió mal, tiene un ERROR

   Pasa de pending a uno de los otros dos UNA sola vez y queda así para
   siempre. No se puede "des-resolver".

     const p = fetch('/api/usuarios');   // ya está corriendo
     p;            // Promise { <pending> }   <- todavía no hay datos

   ⚠ Imprimir la promesa no imprime el dato. Para ver el dato hay que
     "abrirla" con .then o con await.
   -------------------------------------------------------------------------- */


/* ############################################################################
   23.2  CREAR UNA PROMESA
   ############################################################################

     const p = new Promise((resolver, rechazar) => {
       // aquí adentro va el trabajo que tarda
       setTimeout(() => resolver('listo'), 1000);
       // si sale mal:  rechazar(new Error('falló'));
     });

   · Los dos parámetros son funciones: la llamas con el resultado.
   · El nombre habitual es (resolve, reject); aquí en español para que se lea.
   · Rechaza SIEMPRE con `new Error(...)`, no con un texto suelto.

   Atajos:
     Promise.resolve(5)                   // promesa ya cumplida con 5
     Promise.reject(new Error('x'))       // promesa ya rechazada

   El "sleep" que vas a copiar toda la vida:
     const dormir = (ms) => new Promise(r => setTimeout(r, ms));

   EJEMPLO --------------------------------------------------------------------
     const tarda = new Promise(res => setTimeout(() => res('ok'), 100));
     tarda.then(v => console.log(v));      // "ok" a los 100 ms
   -------------------------------------------------------------------------- */

// E1. Devuelve una promesa que se resuelve (sin valor) después de `ms`.
// await dormir(50)  -> sigue a los 50 ms
function dormir(ms) {
  // TODO
}

// E2. Devuelve una promesa ya cumplida con ese valor.
// ya(5) -> Promise que resuelve 5
function ya(valor) {
  // TODO: Promise.resolve
}

// E3. Devuelve una promesa que resuelve el valor a los 10 ms, o que rechaza
// con Error("sin valor") si el valor es falsy.
function tardeOTemprano(valor) {
  // TODO: new Promise((resolver, rechazar) => ...)
}



/* ############################################################################
   23.3  CONSUMIR: .then / .catch / .finally
   ############################################################################

     pedirDatos()
       .then(datos  => { ... })      // si salió bien
       .catch(error => { ... })      // si salió mal (o si un .then lanzó)
       .finally(()  => { ... });     // siempre, haya salido como haya salido

   · `.then` recibe el valor que se resolvió.
   · `.catch` atrapa el rechazo Y cualquier error lanzado en los .then de
     arriba. Por eso va al final.
   · `.finally` no recibe nada; sirve para apagar el spinner.

   EJEMPLO --------------------------------------------------------------------
     let cargando = true;
     traerUsuario()
       .then(u => console.log(u.nombre))
       .catch(e => console.error('Falló:', e.message))
       .finally(() => { cargando = false; });
   -------------------------------------------------------------------------- */

// E4. Devuelve el valor de la promesa en MAYÚSCULAS, usando .then.
// enMayusculas(Promise.resolve("hola")) -> Promise que resuelve "HOLA"
function enMayusculas(promesa) {
  // TODO: return promesa.then(...)
}

// E5. Si la promesa falla, devuelve el texto "error" en vez de romper.
// aSalvo(Promise.reject(new Error("x"))) -> Promise que resuelve "error"
// aSalvo(Promise.resolve("ok"))          -> Promise que resuelve "ok"
function aSalvo(promesa) {
  // TODO: .catch(() => 'error')
}



/* ############################################################################
   23.4  ENCADENAR — cada .then devuelve una promesa nueva
   ############################################################################

     Promise.resolve(2)
       .then(n => n * 10)          // devuelve 20
       .then(n => n + 1)           // recibe 20, devuelve 21
       .then(n => console.log(n)); // 21

   · Lo que devuelves en un .then llega al siguiente.
   · Si devuelves una PROMESA, el siguiente .then espera a que termine:

        traerUsuario()
          .then(u => traerPedidos(u.id))     // devuelve otra promesa
          .then(pedidos => console.log(pedidos));   // ya son los pedidos

   ⚠ El error #1: olvidarse el `return` dentro del .then.
        .then(u => { traerPedidos(u.id); })   // ✗ el siguiente recibe undefined
        .then(u => { return traerPedidos(u.id); })   // ✓

   EJEMPLO --------------------------------------------------------------------
     Promise.resolve(' ana ')
       .then(t => t.trim())
       .then(t => t.toUpperCase());     // resuelve "ANA"
   -------------------------------------------------------------------------- */

// E6. Encadena: recorta espacios, pasa a mayúsculas y agrega "!".
// procesar(Promise.resolve("  ana ")) -> Promise que resuelve "ANA!"
function procesar(promesa) {
  // TODO: tres .then encadenados
}

// E7. Recibe un id, "busca" el usuario con dormir(5) y devuelve su nombre.
// Usa .then y devuelve la promesa (sin await todavía).
// const usuarios = { 1: 'Ana' }
// buscarNombre(1) -> Promise que resuelve "Ana"
const USUARIOS = { 1: 'Ana', 2: 'Luis' };
function buscarNombre(id) {
  // TODO: return dormir(5).then(() => USUARIOS[id]);
  // (usa la función dormir que escribiste en E1)
}



/* ############################################################################
   23.5  VARIAS PROMESAS A LA VEZ
   ############################################################################

     Promise.all([a, b, c])
       -> UNA promesa con un ARRAY de los 3 resultados, en el mismo orden.
       -> si UNA falla, falla todo inmediatamente.

     Promise.allSettled([a, b, c])
       -> nunca falla. Devuelve
          [{ status:'fulfilled', value: ... }, { status:'rejected', reason: ... }]

     Promise.race([a, b])
       -> la PRIMERA que termine, sea bien o mal. Se usa para timeouts.

     Promise.any([a, b])
       -> la primera que salga BIEN; solo falla si fallan todas.

   ⚠ Diferencia clave de velocidad:

        // EN PARALELO (rápido: todas arrancan juntas)
        const [u, p] = await Promise.all([traerUsuario(), traerPedidos()]);

        // EN SERIE (lento: una espera a la otra sin necesidad)
        const u = await traerUsuario();
        const p = await traerPedidos();

     Si las dos llamadas no dependen entre sí, Promise.all es lo correcto.

   EJEMPLO --------------------------------------------------------------------
     await Promise.all([dormir(100), dormir(100)]);   // tarda 100 ms, no 200
   -------------------------------------------------------------------------- */

// E8. Espera las dos promesas EN PARALELO y devuelve el array con sus valores.
// ambas(Promise.resolve(1), Promise.resolve(2)) -> Promise que resuelve [1, 2]
function ambas(a, b) {
  // TODO: Promise.all
}

// E9. Devuelve cuántas de las promesas salieron bien (ninguna debe romper).
// cuantasOk([Promise.resolve(1), Promise.reject(new Error('x'))]) -> 1
function cuantasOk(promesas) {
  // TODO: Promise.allSettled + filtrar por status === 'fulfilled' + .length
}

// E10. Devuelve la primera que termine.
// laPrimera([dormir(50).then(()=>'lenta'), dormir(5).then(()=>'rapida')])
//   -> Promise que resuelve "rapida"
function laPrimera(promesas) {
  // TODO: Promise.race
}

// E11. Timeout: resuelve la promesa, pero si tarda más de `ms` rechaza con
// Error("timeout"). Usa Promise.race.
// conTimeout(dormir(100), 10) -> rechaza con "timeout"
function conTimeout(promesa, ms) {
  // TODO
}



/* ############################################################################
   23.6  ERRORES QUE NO SE VEN
   ############################################################################
   Si una promesa se rechaza y nadie la atrapa, el navegador escupe:

     Uncaught (in promise) Error: ...

   Significa: falta un .catch (o un try/catch alrededor del await).

   ⚠ Otro clásico: llamar a una función async y no esperarla.

        guardar();                 // arranca y sigue: no sabes si terminó
        await guardar();           // ✓ espera de verdad

     En Vue esto se ve como "guardé y la tabla no se actualizó": la
     recarga corrió antes de que el guardado terminara.
   -------------------------------------------------------------------------- */

// E12. Devuelve { ok: true, valor } o { ok: false, error: mensaje }.
// Nunca debe rechazar. (Es el patrón de un service de verdad.)
// aResultado(Promise.resolve(5)) -> { ok: true, valor: 5 }
function aResultado(promesa) {
  // TODO: .then(...).catch(...)
}


module.exports = {
  dormir, ya, tardeOTemprano, enMayusculas, aSalvo, procesar,
  USUARIOS, buscarNombre, ambas, cuantasOk, laPrimera, conTimeout, aResultado,
};


/* ============================================================================
   SOLUCIONES
   ----------------------------------------------------------------------------
   E1   return new Promise(resolver => setTimeout(resolver, ms));
   E2   return Promise.resolve(valor);
   E3   return new Promise((resolver, rechazar) => {
          setTimeout(() => {
            if (!valor) rechazar(new Error('sin valor'));
            else resolver(valor);
          }, 10);
        });
   E4   return promesa.then(t => t.toUpperCase());
   E5   return promesa.catch(() => 'error');
   E6   return promesa.then(t => t.trim()).then(t => t.toUpperCase()).then(t => `${t}!`);
   E7   return dormir(5).then(() => USUARIOS[id]);
   E8   return Promise.all([a, b]);
   E9   return Promise.allSettled(promesas)
          .then(rs => rs.filter(r => r.status === 'fulfilled').length);
   E10  return Promise.race(promesas);
   E11  const reloj = new Promise((_, rechazar) =>
          setTimeout(() => rechazar(new Error('timeout')), ms)
        );
        return Promise.race([promesa, reloj]);
   E12  return promesa
          .then(valor => ({ ok: true, valor }))
          .catch(e => ({ ok: false, error: e.message }));
   ============================================================================ */
