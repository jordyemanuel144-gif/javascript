/* ============================================================================
   26 · PATRONES ASÍNCRONOS DE LA VIDA REAL
   Nivel 4 · JavaScript asíncrono
   ----------------------------------------------------------------------------
   Debounce, cancelar peticiones, evitar que llegue una respuesta vieja,
   cachear. Son cinco patrones y aparecen en TODOS los proyectos.
   Corrige con:   node verificar.js 26
   ============================================================================ */

const dormir = (ms) => new Promise(r => setTimeout(r, ms));


/* ############################################################################
   26.1  DEBOUNCE — esperar a que deje de escribir
   ############################################################################
   Problema: el usuario escribe "monitor" en un buscador y disparas 7
   peticiones, una por letra.
   Solución: esperar a que pase X tiempo SIN teclas y recién ahí llamar.

     function debounce(fn, ms) {
       let id;
       return (...args) => {
         clearTimeout(id);                       // cancela el anterior
         id = setTimeout(() => fn(...args), ms); // agenda uno nuevo
       };
     }

     const buscarDebounced = debounce(buscar, 300);
     // en el template:  @input="buscarDebounced"

   La clave: la variable `id` vive en el closure (tema 13.5) y se comparte
   entre todas las llamadas.

   EJEMPLO --------------------------------------------------------------------
     const f = debounce(() => console.log('va'), 300);
     f(); f(); f();          // solo imprime UNA vez, 300 ms después de la última
   -------------------------------------------------------------------------- */

// E1. Implementa debounce.
// const f = debounce(fn, 20);  f(); f(); f();  -> fn se llama 1 sola vez
function debounce(fn, ms) {
  // TODO
}

// E2. Igual pero pasando los argumentos de la última llamada.
// const f = debounceArgs(fn, 20);  f('a'); f('b');  -> fn recibe 'b'
function debounceArgs(fn, ms) {
  // TODO: usa (...args) y fn(...args)
}



/* ############################################################################
   26.2  THROTTLE — como mucho una vez cada X
   ############################################################################
   Debounce espera a que pare. Throttle deja pasar una y bloquea el resto
   durante un rato. Se usa en scroll, resize y botones de "guardar".

     function throttle(fn, ms) {
       let libre = true;
       return (...args) => {
         if (!libre) return;
         libre = false;
         fn(...args);
         setTimeout(() => { libre = true; }, ms);
       };
     }

   Cuál usar:
     · buscador mientras escribe  -> debounce
     · scroll / resize / mousemove -> throttle
     · doble clic en "Guardar"     -> throttle (o deshabilitar el botón)
   -------------------------------------------------------------------------- */

// E3. Implementa throttle.
// const f = throttle(fn, 50);  f(); f(); f();  -> fn se llama 1 vez (la primera)
function throttle(fn, ms) {
  // TODO
}



/* ############################################################################
   26.3  CANCELAR UNA PETICIÓN: AbortController
   ############################################################################
   Si el usuario se va de la pantalla, la petición sigue viva y al volver
   pisa datos nuevos con datos viejos. Se corta así:

     const controlador = new AbortController();

     fetch('/api/usuarios', { signal: controlador.signal })
       .catch(e => {
         if (e.name === 'AbortError') return;    // cancelado a propósito
         throw e;
       });

     controlador.abort();                 // cancela

   En Vue:
     let ctrl;
     async function buscar(q) {
       ctrl?.abort();                     // corta la búsqueda anterior
       ctrl = new AbortController();
       const r = await fetch(`/api/buscar?q=${q}`, { signal: ctrl.signal });
       ...
     }
     onUnmounted(() => ctrl?.abort());

   `controlador.signal.aborted` es true una vez cancelado.

   EJEMPLO --------------------------------------------------------------------
     const c = new AbortController();
     c.signal.aborted;      // false
     c.abort();
     c.signal.aborted;      // true
   -------------------------------------------------------------------------- */

// E4. Crea un AbortController, cancélalo y devuelve si quedó cancelado.
// probarAbort() -> true
function probarAbort() {
  // TODO
}

// E5. Devuelve una función `cancelar` y una promesa que se rechaza con
// Error("cancelado") si se llama a cancelar antes de que pasen los ms.
// const { promesa, cancelar } = tareaCancelable(50);
// cancelar();  -> promesa rechaza con "cancelado"
function tareaCancelable(ms) {
  // TODO:
  // let rechazo;
  // const promesa = new Promise((resolver, rechazar) => {
  //   rechazo = rechazar;
  //   setTimeout(() => resolver('listo'), ms);
  // });
  // return { promesa, cancelar: () => rechazo(new Error('cancelado')) };
}



/* ############################################################################
   26.4  RACE CONDITION — la respuesta vieja que llega tarde
   ############################################################################
   El usuario escribe "a" y después "ab". Si la respuesta de "a" tarda más,
   llega DESPUÉS y pisa los resultados de "ab". La pantalla muestra lo que no
   corresponde.

   Solución sin cancelar nada: numerar las peticiones y descartar las viejas.

     let ultima = 0;

     async function buscar(q) {
       const mia = ++ultima;                    // me quedo con mi número
       const datos = await pedir(q);
       if (mia !== ultima) return;              // llegó tarde: la descarto
       resultados.value = datos;
     }

   Es dos líneas y resuelve el 90% de los bugs raros de buscadores.

   EJEMPLO --------------------------------------------------------------------
     buscar('a');    // tarda 100 ms
     buscar('ab');   // tarda 10 ms  -> gana esta, la otra se descarta
   -------------------------------------------------------------------------- */

// E6. Devuelve un buscador que SOLO acepta el resultado de la última llamada.
// El buscador recibe (texto, ms) y guarda el resultado llamando a `guardar`.
// const buscar = crearBuscador(guardar);
// buscar('a', 40); buscar('ab', 5);  -> guardar recibe solo 'ab'
function crearBuscador(guardar) {
  // TODO:
  // let ultima = 0;
  // return async (texto, ms) => {
  //   const mia = ++ultima;
  //   await dormir(ms);
  //   if (mia !== ultima) return;
  //   guardar(texto);
  // };
}



/* ############################################################################
   26.5  CACHÉ EN MEMORIA
   ############################################################################
   Si ya pediste el usuario 5, no lo vuelvas a pedir:

     const cache = new Map();

     async function traerUsuario(id) {
       if (cache.has(id)) return cache.get(id);      // ya lo tengo
       const datos = await pedir(`/api/usuarios/${id}`);
       cache.set(id, datos);
       return datos;
     }

   Versión mejor: guardar la PROMESA, no el resultado. Así, si piden el mismo
   id dos veces al mismo tiempo, sale una sola petición:

     if (!cache.has(id)) cache.set(id, pedir(url));
     return cache.get(id);

   (Esto es, en pequeño, lo que hacen TanStack Query / Pinia Colada.)
   -------------------------------------------------------------------------- */

// E7. Envuelve la función para que cada clave se calcule UNA sola vez.
// const traer = conCache(async id => { llamadas++; return id * 2; });
// await traer(1); await traer(1);  -> llamadas === 1
function conCache(fn) {
  // TODO: un Map por fuera, guardando la promesa
}



/* ############################################################################
   26.6  LÍMITE DE CONCURRENCIA (en serie, por tandas)
   ############################################################################
   Mandar 500 peticiones juntas tumba al servidor. Se procesa por tandas:

     async function porTandas(items, tamano, fn) {
       const salida = [];
       for (let i = 0; i < items.length; i += tamano) {
         const tanda = items.slice(i, i + tamano);
         salida.push(...await Promise.all(tanda.map(fn)));
       }
       return salida;
     }

   `slice(i, i + tamano)` corta de a pedazos; cada tanda va en paralelo, pero
   una tanda espera a la anterior.
   -------------------------------------------------------------------------- */

// E8. Procesa en tandas de `tamano`, devolviendo todos los resultados en orden.
// porTandas([1,2,3,4,5], 2, async n => n * 10) -> [10,20,30,40,50]
async function porTandas(items, tamano, fn) {
  // TODO
}


module.exports = {
  dormir, debounce, debounceArgs, throttle, probarAbort, tareaCancelable,
  crearBuscador, conCache, porTandas,
};


/* ============================================================================
   SOLUCIONES
   ----------------------------------------------------------------------------
   E1   let id;
        return () => {
          clearTimeout(id);
          id = setTimeout(() => fn(), ms);
        };
   E2   let id;
        return (...args) => {
          clearTimeout(id);
          id = setTimeout(() => fn(...args), ms);
        };
   E3   let libre = true;
        return (...args) => {
          if (!libre) return;
          libre = false;
          fn(...args);
          setTimeout(() => { libre = true; }, ms);
        };
   E4   const c = new AbortController();
        c.abort();
        return c.signal.aborted;
   E5   let rechazo;
        const promesa = new Promise((resolver, rechazar) => {
          rechazo = rechazar;
          setTimeout(() => resolver('listo'), ms);
        });
        return { promesa, cancelar: () => rechazo(new Error('cancelado')) };
   E6   let ultima = 0;
        return async (texto, ms) => {
          const mia = ++ultima;
          await dormir(ms);
          if (mia !== ultima) return;
          guardar(texto);
        };
   E7   const cache = new Map();
        return (clave) => {
          if (!cache.has(clave)) cache.set(clave, fn(clave));
          return cache.get(clave);
        };
   E8   const salida = [];
        for (let i = 0; i < items.length; i += tamano) {
          const tanda = items.slice(i, i + tamano);
          salida.push(...await Promise.all(tanda.map(fn)));
        }
        return salida;
   ============================================================================ */
