/* ============================================================================
   24 · async / await
   Nivel 4 · JavaScript asíncrono
   ----------------------------------------------------------------------------
   Es la forma en que vas a escribir TODO lo asíncrono en el proyecto. Son las
   mismas promesas del tema 23, pero escritas como si fueran código normal.
   Corrige con:   node verificar.js 24
   ============================================================================ */

const dormir = (ms) => new Promise(r => setTimeout(r, ms));


/* ############################################################################
   24.1  LAS DOS REGLAS
   ############################################################################
   1. `await` espera a que una promesa termine y te da el VALOR de adentro.
   2. `await` solo se puede usar dentro de una función marcada con `async`.

     // con .then
     function cargar() {
       return traerUsuario().then(u => u.nombre);
     }

     // con async/await  -> lo mismo, se lee de arriba hacia abajo
     async function cargar() {
       const u = await traerUsuario();
       return u.nombre;
     }

   Las tres formas de marcar async:
     async function f() {}
     const f = async () => {};
     const obj = { async f() {} };

   ⚠ Toda función `async` DEVUELVE UNA PROMESA, aunque hagas `return 5`.
        async function f() { return 5; }
        f();            // Promise { 5 }   <- no es 5
        await f();      // 5

   ⚠ Olvidarse el await es el bug más común de todos:
        const u = traerUsuario();      // u es una Promise, no el usuario
        u.nombre;                      // undefined

   EJEMPLO --------------------------------------------------------------------
     async function saludar() {
       await dormir(100);
       return 'hola';
     }
     saludar();          // Promise { <pending> }
     await saludar();    // "hola"
   -------------------------------------------------------------------------- */

// E1. Función async que espera 10 ms y devuelve "listo".
async function tarea() {
  // TODO
}

// E2. Espera la promesa y devuelve su valor en mayúsculas (con await, no .then).
// gritar(Promise.resolve("hola")) -> Promise que resuelve "HOLA"
async function gritar(promesa) {
  // TODO
}

// E3. Devuelve true si el valor recibido es una promesa.
// (Truco: una promesa tiene un método .then)
// esPromesa(Promise.resolve(1)) -> true ;  esPromesa(5) -> false
function esPromesa(valor) {
  // TODO: typeof valor?.then === 'function'
}



/* ############################################################################
   24.2  ERRORES: try / catch alrededor del await
   ############################################################################

     async function cargar() {
       try {
         const u = await traerUsuario();      // si esto rechaza...
         return u.nombre;
       } catch (error) {                      // ...cae acá
         console.error(error.message);
         return null;
       } finally {
         cargando.value = false;              // siempre
       }
     }

   · `await` sobre una promesa rechazada se comporta como un `throw`.
   · Sin try/catch, el error sube al que llamó (y si nadie lo atrapa:
     "Uncaught (in promise)").

   Patrón real de una pantalla Vue:

     const datos = ref(null);
     const error = ref(null);
     const cargando = ref(false);

     async function cargar() {
       cargando.value = true;
       error.value = null;
       try {
         datos.value = await api.traer();
       } catch (e) {
         error.value = e.message;
       } finally {
         cargando.value = false;
       }
     }

   EJEMPLO --------------------------------------------------------------------
     try { await Promise.reject(new Error('uy')); }
     catch (e) { e.message; }        // "uy"
   -------------------------------------------------------------------------- */

// E4. Devuelve el valor de la promesa, o `respaldo` si la promesa falla.
// conRespaldo(Promise.reject(new Error("x")), 0) -> 0
async function conRespaldo(promesa, respaldo) {
  // TODO: try/catch con await
}

// E5. Devuelve un array con los pasos ejecutados, en orden.
// La promesa falla, así que debe ser ["inicio", "error", "fin"].
async function pasosConError() {
  const pasos = [];
  // TODO:
  // pasos.push('inicio');
  // try { await Promise.reject(new Error('x')); }
  // catch { pasos.push('error'); }
  // finally { pasos.push('fin'); }
  return pasos;
}

// E6. Patrón de pantalla: devuelve { datos, error, cargando } al terminar.
// Si la promesa resuelve: { datos: valor, error: null, cargando: false }
// Si rechaza:             { datos: null, error: mensaje, cargando: false }
async function cargarEstado(promesa) {
  // TODO
}



/* ############################################################################
   24.3  await EN BUCLES — el error que todos cometen
   ############################################################################

     // ✗ NO FUNCIONA: forEach ignora las funciones async
     ids.forEach(async (id) => { await guardar(id); });
     console.log('terminé');      // miente: se imprime antes de guardar nada

     // ✓ EN SERIE (uno después del otro)
     for (const id of ids) {
       await guardar(id);
     }

     // ✓ EN PARALELO (todos a la vez, mucho más rápido)
     await Promise.all(ids.map(id => guardar(id)));

   Cómo elegir:
     · En SERIE si cada paso depende del anterior, o si el servidor se queja
       cuando le mandas 200 pedidos juntos.
     · En PARALELO si son independientes (lo normal).

   ⚠ Ojo con `.map(async ...)`: devuelve un array de PROMESAS, no de valores.
     Siempre lleva `await Promise.all(...)` delante.

   EJEMPLO --------------------------------------------------------------------
     const nombres = await Promise.all(ids.map(id => traerNombre(id)));
     // nombres ya es un array de textos
   -------------------------------------------------------------------------- */

// E7. Recorre los ids EN SERIE y devuelve un array con los resultados.
// Usa for...of con await.
// enSerie([1,2], async id => id * 10) -> [10, 20]
async function enSerie(ids, fn) {
  // TODO
}

// E8. Lo mismo pero EN PARALELO, con Promise.all.
// enParalelo([1,2], async id => id * 10) -> [10, 20]
async function enParalelo(ids, fn) {
  // TODO
}

// E9. Suma el resultado de aplicar fn a cada id (en paralelo).
// sumarTodo([1,2,3], async n => n) -> 6
async function sumarTodo(ids, fn) {
  // TODO: await Promise.all + reduce
}



/* ############################################################################
   24.4  SERIE vs PARALELO CON await SUELTO
   ############################################################################

     // LENTO: 200 ms. La segunda ni empieza hasta que la primera termina.
     const a = await dormir(100);
     const b = await dormir(100);

     // RÁPIDO: 100 ms. Las dos arrancan y después se esperan.
     const pa = dormir(100);           // sin await: ya está corriendo
     const pb = dormir(100);
     const a = await pa;
     const b = await pb;

     // Lo mismo, más legible:
     const [a, b] = await Promise.all([dormir(100), dormir(100)]);

   Regla: si la llamada B no necesita el resultado de A, van en paralelo.

   EJEMPLO --------------------------------------------------------------------
     const [usuario, roles] = await Promise.all([
       api.traerUsuario(id),
       api.traerRoles(id),
     ]);
   -------------------------------------------------------------------------- */

// E10. Espera las dos tareas EN PARALELO y devuelve la suma de sus valores.
// (Tiene que tardar ~lo que la más lenta, no la suma de las dos.)
// sumarEnParalelo(dormir(50).then(()=>1), dormir(50).then(()=>2)) -> 3
async function sumarEnParalelo(a, b) {
  // TODO
}

// E11. Aquí SÍ hay dependencia: primero busca el id del usuario y después,
// con ese id, busca su nombre. Tienen que ir en serie.
// buscarId("ana") resuelve 1 ;  buscarNombrePorId(1) resuelve "Ana"
async function buscarId(usuario) {
  await dormir(5);
  return usuario === 'ana' ? 1 : 0;
}
async function buscarNombrePorId(id) {
  await dormir(5);
  return id === 1 ? 'Ana' : 'desconocido';
}

// nombreDeUsuario("ana") -> "Ana"
async function nombreDeUsuario(usuario) {
  // TODO: dos await encadenados
}



/* ############################################################################
   24.5  DETALLES QUE CONVIENE SABER
   ############################################################################
   · `await` sobre algo que NO es promesa funciona igual (lo envuelve):
        await 5;        // 5

   · En un archivo .mjs o dentro de <script setup> se puede usar `await` en
     el nivel superior ("top-level await"), sin función async alrededor.

   · `return await p` dentro de un try/catch SÍ tiene sentido (deja que el
     catch atrape el error). Fuera de un try, `return p` alcanza.

   · Un `await` dentro de un `if` o un `for` está permitido; lo que no se
     puede es usarlo en una función no-async.

   · Estas dos son idénticas:
        async function f() { return 5; }
        function f() { return Promise.resolve(5); }
   -------------------------------------------------------------------------- */

// E12. Reintenta la función hasta `intentos` veces. Si todas fallan, relanza
// el último error. Entre intento e intento espera 5 ms.
// reintentar(fnQueFallaUnaVez, 3) -> resuelve al segundo intento
async function reintentar(fn, intentos) {
  // TODO:
  // let ultimo;
  // for (let i = 0; i < intentos; i++) {
  //   try { return await fn(); }
  //   catch (e) { ultimo = e; await dormir(5); }
  // }
  // throw ultimo;
}


module.exports = {
  dormir, tarea, gritar, esPromesa, conRespaldo, pasosConError, cargarEstado,
  enSerie, enParalelo, sumarTodo, sumarEnParalelo,
  buscarId, buscarNombrePorId, nombreDeUsuario, reintentar,
};


/* ============================================================================
   SOLUCIONES
   ----------------------------------------------------------------------------
   E1   await dormir(10); return 'listo';
   E2   const t = await promesa; return t.toUpperCase();
   E3   return typeof valor?.then === 'function';
   E4   try { return await promesa; } catch { return respaldo; }
   E5   pasos.push('inicio');
        try { await Promise.reject(new Error('x')); }
        catch { pasos.push('error'); }
        finally { pasos.push('fin'); }
   E6   try {
          const datos = await promesa;
          return { datos, error: null, cargando: false };
        } catch (e) {
          return { datos: null, error: e.message, cargando: false };
        }
   E7   const salida = [];
        for (const id of ids) salida.push(await fn(id));
        return salida;
   E8   return Promise.all(ids.map(id => fn(id)));
   E9   const valores = await Promise.all(ids.map(id => fn(id)));
        return valores.reduce((t, v) => t + v, 0);
   E10  const [x, y] = await Promise.all([a, b]);
        return x + y;
   E11  const id = await buscarId(usuario);
        return await buscarNombrePorId(id);
   E12  let ultimo;
        for (let i = 0; i < intentos; i++) {
          try { return await fn(); }
          catch (e) { ultimo = e; await dormir(5); }
        }
        throw ultimo;
   ============================================================================ */
