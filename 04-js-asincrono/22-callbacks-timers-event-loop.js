/* ============================================================================
   22 · CALLBACKS, TIMERS Y EL EVENT LOOP
   Nivel 4 · JavaScript asíncrono
   ----------------------------------------------------------------------------
   "¿Por qué me sale undefined si el dato está ahí?" -> porque el código NO
   espera. Este archivo explica exactamente por qué.
   Corrige con:   node verificar.js 22
   ============================================================================ */


/* ############################################################################
   22.1  JAVASCRIPT TIENE UN SOLO HILO
   ############################################################################
   JS ejecuta UNA cosa a la vez, de arriba hacia abajo. Cuando algo tarda
   (pedir datos a un servidor, esperar 2 segundos, leer un archivo), no se
   queda trabado: lo deja "agendado" y sigue con la línea siguiente.

     console.log('1');
     setTimeout(() => console.log('2'), 0);    // agendado, aunque sea 0 ms
     console.log('3');

     // imprime:  1, 3, 2      <- el 2 SIEMPRE al final

   Por eso esto no funciona:

     let datos;
     pedirDatos(r => { datos = r; });     // esto termina DESPUÉS
     console.log(datos);                  // undefined: todavía no llegó

   La regla: todo lo que dependa del dato tiene que ir DENTRO del callback
   (o después de un await, tema 24). Nunca debajo.
   -------------------------------------------------------------------------- */

// E1. ¿En qué orden se imprime? Devuelve el array con los textos en el orden
// REAL de salida.
//   console.log('A');
//   setTimeout(() => console.log('B'), 0);
//   console.log('C');
// ordenSalida() -> ["A", "C", "B"]
function ordenSalida() {
  // TODO: devuelve el array en el orden correcto
}



/* ############################################################################
   22.2  setTimeout — hacer algo MÁS TARDE
   ############################################################################

     const id = setTimeout(() => { ... }, 1000);   // 1000 ms = 1 segundo
     clearTimeout(id);                             // cancelarlo antes de que ocurra

   · El primer argumento es una FUNCIÓN, no una llamada:
         setTimeout(hacer, 1000)      // ✓ se ejecutará en 1 s
         setTimeout(hacer(), 1000)    // ✗ se ejecuta YA, y agenda su resultado
   · El tiempo es un MÍNIMO, no una promesa exacta.
   · setTimeout(fn, 0) no es "ya": es "apenas termine todo el código actual".

   Para qué se usa en Vue: debounce de un buscador, cerrar un cartel a los
   3 segundos, reintentar una llamada.

   EJEMPLO --------------------------------------------------------------------
     const id = setTimeout(() => console.log('tarde'), 500);
     clearTimeout(id);          // nunca se imprime
   -------------------------------------------------------------------------- */

// E2. Llama al callback después de esos milisegundos.
// avisarLuego(10, () => ...) -> ejecuta el callback a los 10 ms
function avisarLuego(ms, fn) {
  // TODO
}

// E3. Igual, pero devuelve el id del timer para poder cancelarlo.
function avisarLuegoCancelable(ms, fn) {
  // TODO: devuelve lo que retorna setTimeout
}

// E4. Cancela un timer por su id.
function cancelar(id) {
  // TODO
}



/* ############################################################################
   22.3  setInterval — hacer algo CADA cierto tiempo
   ############################################################################

     const id = setInterval(() => { ... }, 1000);   // cada segundo, para siempre
     clearInterval(id);                             // ¡hay que cortarlo!

   ⚠ Un setInterval que no se cancela sigue corriendo aunque cambies de
     pantalla. En Vue SIEMPRE se cancela en onUnmounted (tema 46):

       let id;
       onMounted(()  => { id = setInterval(tic, 1000); });
       onUnmounted(() => clearInterval(id));

   Patrón "repetir n veces y parar":

     let veces = 0;
     const id = setInterval(() => {
       veces++;
       if (veces === 3) clearInterval(id);
     }, 100);
   -------------------------------------------------------------------------- */

// E5. Llama al callback `veces` veces, cada `ms` milisegundos, y después para.
// repetir(3, 5, fn) -> fn se llama 3 veces y el intervalo se cancela
function repetir(veces, ms, fn) {
  // TODO: setInterval + contador + clearInterval
}



/* ############################################################################
   22.4  EL EVENT LOOP EN 6 LÍNEAS
   ############################################################################
   1. JS ejecuta todo el código normal ("la pila").
   2. Lo que tarda (timers, red, eventos) queda a cargo del navegador/Node.
   3. Cuando eso termina, su callback va a una COLA de espera.
   4. Recién cuando la pila queda vacía, el event loop toma el primero de la
      cola y lo ejecuta.
   5. Las promesas (tema 23) van a una cola PRIORITARIA: se atienden antes
      que los setTimeout.
   6. Por eso el orden real es: código normal -> promesas -> timers.

     console.log('1');
     setTimeout(() => console.log('2'), 0);
     Promise.resolve().then(() => console.log('3'));
     console.log('4');

     // 1, 4, 3, 2
     //       ^promesa antes que el timeout, aunque esté escrita después

   No hay que memorizarlo: alcanza con saber que lo asíncrono va al final.
   -------------------------------------------------------------------------- */

// E6. Mismo ejercicio que E1 pero con promesa de por medio.
//   console.log('1');
//   setTimeout(() => console.log('2'), 0);
//   Promise.resolve().then(() => console.log('3'));
//   console.log('4');
// ordenConPromesa() -> ["1", "4", "3", "2"]
function ordenConPromesa() {
  // TODO
}



/* ############################################################################
   22.5  EL ESTILO CALLBACK (y por qué se inventaron las promesas)
   ############################################################################
   Antes de las promesas, lo asíncrono se resolvía pasando un callback con el
   error primero ("error-first callback", el estilo clásico de Node):

     function buscarUsuario(id, callback) {
       setTimeout(() => {
         if (!id) return callback(new Error('Falta el id'), null);
         callback(null, { id, nombre: 'Ana' });
       }, 10);
     }

     buscarUsuario(1, (error, usuario) => {
       if (error) { console.error(error); return; }
       console.log(usuario.nombre);
     });

   El problema aparece al encadenar: la famosa "pirámide de la perdición".

     buscarUsuario(1, (e, u) => {
       buscarPedidos(u.id, (e, pedidos) => {
         buscarDetalle(pedidos[0].id, (e, detalle) => {
           //  ...y así hasta el infinito, con un `if (e)` en cada nivel
         });
       });
     });

   Las promesas (tema 23) y async/await (tema 24) existen para aplanar esto.
   Hoy lo vas a LEER en librerías viejas, no a escribirlo.
   -------------------------------------------------------------------------- */

// E7. Estilo error-first: si el id es falsy, llama callback(Error, null).
// Si no, callback(null, { id, nombre: "Ana" }). Usa setTimeout de 5 ms.
function buscarUsuario(id, callback) {
  // TODO
}

// E8. Convierte ese estilo a promesa (esto se llama "promisificar").
// buscarUsuarioPromesa(1) -> Promise que resuelve { id: 1, nombre: "Ana" }
// buscarUsuarioPromesa(0) -> Promise rechazada
function buscarUsuarioPromesa(id) {
  // TODO:
  // return new Promise((resolver, rechazar) => {
  //   buscarUsuario(id, (error, usuario) => {
  //     if (error) rechazar(error); else resolver(usuario);
  //   });
  // });
}


module.exports = {
  ordenSalida, avisarLuego, avisarLuegoCancelable, cancelar, repetir,
  ordenConPromesa, buscarUsuario, buscarUsuarioPromesa,
};


/* ============================================================================
   SOLUCIONES
   ----------------------------------------------------------------------------
   E1   return ['A', 'C', 'B'];
   E2   setTimeout(fn, ms);
   E3   return setTimeout(fn, ms);
   E4   clearTimeout(id);
   E5   let n = 0;
        const id = setInterval(() => {
          n++;
          fn();
          if (n >= veces) clearInterval(id);
        }, ms);
   E6   return ['1', '4', '3', '2'];
   E7   setTimeout(() => {
          if (!id) return callback(new Error('Falta el id'), null);
          callback(null, { id, nombre: 'Ana' });
        }, 5);
   E8   return new Promise((resolver, rechazar) => {
          buscarUsuario(id, (error, usuario) => {
            if (error) rechazar(error);
            else resolver(usuario);
          });
        });
   ============================================================================ */
