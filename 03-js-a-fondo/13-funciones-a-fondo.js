/* ============================================================================
   13 · FUNCIONES A FONDO
   Nivel 3 · JavaScript a fondo
   ----------------------------------------------------------------------------
   En Vue casi todo lo que escribes es una función: un composable, un handler
   de evento, un computed, una action de Pinia.

   CÓMO ESTÁ ARMADO: pasos cortos. Cada paso enseña UNA cosa, trae su ejemplo
   y sus ejercicios de una línea, y abajo del bloque están SUS soluciones.

   Corrige con:   node verificar.js 13
   Para probar algo: selecciona las líneas y Ctrl+Shift+E.
   ============================================================================ */


/* ############################################################################
   13.1  LAS TRES FORMAS DE ESCRIBIR UNA FUNCIÓN
   ############################################################################
     // 1) DECLARACIÓN
     function sumar(a, b) { return a + b; }

     // 2) EXPRESIÓN (se guarda en una variable)
     const sumar = function (a, b) { return a + b; };

     // 3) FLECHA (la que más vas a ver en Vue)
     const sumar = (a, b) => a + b;

   Las tres hacen lo mismo. La única diferencia práctica:
     · la DECLARACIÓN se puede llamar antes de escribirla (sube sola)
     · las otras dos no: si las llamas antes, error
############################################################################ */

// E1. "doble" como DECLARACIÓN.  doble(4) -> 8
function doble(n) {
  return 2*n;
}

// E2. "triple" como EXPRESIÓN.  triple(3) -> 9
const triple = function (n) {return 3*n};

// E3. "cuadruple" como FLECHA en una línea.  cuadruple(2) -> 8
const cuadruple = (n) => 4*n;

/* SOLUCIONES 13.1 ------------------------------------------------------------
   E1   function doble(n) { return n * 2; }
   E2   const triple = function (n) { return n * 3; };
   E3   const cuadruple = (n) => n * 4;
-------------------------------------------------------------------------- */


/* ############################################################################
   13.2  LA FLECHA: con llaves y sin llaves
   ############################################################################
     const doble = (n) => n * 2;              // SIN llaves: devuelve solo
     const doble = (n) => { return n * 2; };  // CON llaves: hay que poner return

   Si pones llaves y te olvidas el return, la función devuelve undefined.
   Es el despiste más común.

   Atajos que verás:
     n => n * 2          // un solo parámetro: los paréntesis son opcionales
     () => 'hola'        // sin parámetros: los paréntesis van vacíos
############################################################################ */

// E4. Flecha SIN llaves que devuelve la mitad.  mitad(10) -> 5
const mitad = (n) => {
  // TODO: reescribe esta flecha sin llaves y sin return
};

// E5. La misma, pero CON llaves y con return.  mitadLarga(10) -> 5
const mitadLarga = (n) => {
  // TODO
};

// E6. Flecha SIN parámetros que devuelve el texto 'hola'.
const saludo = () => {
  // TODO
};

/* SOLUCIONES 13.2 ------------------------------------------------------------
   E4   const mitad = (n) => n / 2;
   E5   const mitadLarga = (n) => { return n / 2; };
   E6   const saludo = () => 'hola';
-------------------------------------------------------------------------- */


/* ############################################################################
   13.3  DEVOLVER UN OBJETO DESDE UNA FLECHA  ->  hay que envolverlo
   ############################################################################
   La llave de un objeto se confunde con la llave del cuerpo de la función:

     const f = (n) => { id: n };      // MAL: devuelve undefined
     const f = (n) => ({ id: n });    // BIEN: los paréntesis avisan que es objeto

   Y recuerda la forma corta:  { id, nombre }  es  { id: id, nombre: nombre }
############################################################################ */

// E7. Devuelve el objeto { id, nombre }.
// aObjeto(1, 'Ana') -> { id: 1, nombre: 'Ana' }
const aObjeto = (id, nombre) => ({id,nombre});

// E8. Recibe textos y devuelve objetos { texto, largo }.
// conLargo(['ab', 'c']) -> [{ texto: 'ab', largo: 2 }, { texto: 'c', largo: 1 }]
function conLargo(lista) {
    return lista.map(n => ({texto: n, largo: n.length}));
}

/* SOLUCIONES 13.3 ------------------------------------------------------------
   E7   const aObjeto = (id, nombre) => ({ id, nombre });
   E8   return lista.map(texto => ({ texto, largo: texto.length }));
-------------------------------------------------------------------------- */


/* ############################################################################
   13.4  CALLBACK: una función que le pasas a otra
   ############################################################################
   Una función es un valor: se puede guardar en una variable y pasarla como
   argumento. La que recibe la llama cuando quiere.

     function aplicar(valor, fn) {
       return fn(valor);          // aquí la llama
     }
     aplicar(5, n => n + 1);      // 6

   ⚠ Se pasa `fn`, SIN paréntesis. Con paréntesis la estás llamando ya.
        aplicar(5, doble)      // BIEN: le paso la función
        aplicar(5, doble())    // MAL: la ejecuto ahora y le paso el resultado

   Esto es exactamente lo que hacen .map() y .filter(): les pasas una función
   y ellos la llaman por ti.
############################################################################ */

// E9. Llama al callback con el valor y devuelve el resultado.
// ejecutar(10, n => n / 2) -> 5
function ejecutar(valor, fn) {
  return  fn(valor);
}

// E10. Llama al callback DOS veces seguidas (la segunda con el resultado
// de la primera).
// dosVeces(3, n => n * 10) -> 300
function dosVeces(valor, fn) {
  // TODO
}

// E11. Llama al callback solo si la condición es true. Si no, devuelve null.
// Fíjate: este callback no recibe nada, se llama con fn()
// siAcaso(true, () => 'hola') -> 'hola' ;  siAcaso(false, ...) -> null
function siAcaso(condicion, fn) {
  return condicion ? fn() : null;
}

// E12. Aplica el callback a cada elemento SIN usar .map (usa un for).
// Es para ver lo que map hace por dentro.
// mapearAMano([1,2,3], n => n + 1) -> [2,3,4]
function mapearAMano(lista, fn) {
  const listaAmano = [];
  for(i = 0; i < lista.length; i++){
    listaAmano.push(fn(lista[i]));
  }
  return listaAmano;
}

/* SOLUCIONES 13.4 ------------------------------------------------------------
   E9   return fn(valor);
   E10  return fn(fn(valor));
   E11  return condicion ? fn() : null;
   E12  const salida = [];
        for (const item of lista) {
          salida.push(fn(item));
        }
        return salida;
-------------------------------------------------------------------------- */


/* ############################################################################
   13.5  UNA FUNCIÓN QUE DEVUELVE OTRA FUNCIÓN
   ############################################################################
   Paso a paso, que aquí está el salto.

   a) devolver una función fija
        function crearSaludo() {
          return () => 'hola';
        }
        const f = crearSaludo();     // f es una FUNCIÓN, todavía no dice nada
        f();                         // 'hola'   <- ahora sí

   b) la función devuelta usa el parámetro de afuera
        function multiplicador(n) {
          return (x) => x * n;       // esta flecha se acuerda de n
        }
        const porTres = multiplicador(3);
        porTres(10);                 // 30

   ⚠ Fíjate en la flecha: va  =>  , no  =  .
        return (x) = x + n;     // MAL: eso es una asignación
        return (x) => x + n;    // BIEN

   Se lee: "multiplicador(3) me devuelve una función nueva que ya sabe que
   hay que multiplicar por 3". Es la idea de los composables de Vue.
############################################################################ */

// E13. Devuelve una función que siempre devuelve el texto 'hola'.
// const f = crearSaludo();  f() -> 'hola'
function crearSaludo() {
  // TODO
}

// E14. Devuelve una función que le suma n a lo que reciba.
// const sumar5 = sumador(5);  sumar5(2) -> 7
function sumador(n) {
  return (x) = x + n;
}

// E15. Devuelve una función que envuelve un texto entre esa marca.
// const negrita = envolver('**');  negrita('hola') -> '**hola**'
function envolver(marca) {
  return  (texto) => `${marca}${texto}${marca}`;
}

/* SOLUCIONES 13.5 ------------------------------------------------------------
   E13  return () => 'hola';
   E14  return (x) => x + n;
   E15  return (texto) => `${marca}${texto}${marca}`;
-------------------------------------------------------------------------- */


/* ############################################################################
   13.6  CLOSURE: la función se acuerda entre llamada y llamada
   ############################################################################
   Es lo mismo de 13.5, pero ahora la variable de afuera CAMBIA.

   a) la función de adentro lee una variable de afuera
        function crearLector() {
          const n = 7;
          return () => n;          // lee n
        }

   b) la función de adentro la MODIFICA, y el cambio se queda guardado
        function contador() {
          let n = 0;               // vive mientras viva la función devuelta
          return () => {
            n = n + 1;
            return n;
          };
        }
        const c = contador();
        c();     // 1
        c();     // 2      <- se acordó del 1

   c) cada llamada a contador() crea su propio n, independiente
        const a = contador();
        const b = contador();
        a(); a();    // 2
        b();         // 1    <- no comparten nada

   A eso se le llama closure. Es la misma idea que `ref()` de Vue: un valor
   privado que sobrevive entre llamadas.

   ⚠ Tiene que ser `let`, no `const`: la vas a reasignar.
############################################################################ */

// E16. Devuelve una función que siempre devuelve 7.
// const f = crearSiete();  f() -> 7
function crearSiete() {
  // TODO: const n = 7 adentro, y devuelve una flecha que lo lee
}

// E17. Contador: devuelve 1, 2, 3... en cada llamada.
// const c = crearContador();  c() -> 1 ;  c() -> 2
function crearContador() {
  let n = 0;
  return () => {
    n = n + 1;
    return n;
  }
}

// E18. Acumulador: guarda un total y le va sumando lo que reciba.
// const a = crearAcumulador();  a(10) -> 10 ;  a(5) -> 15
function crearAcumulador() {
  let Acumulado = 0;
  return (n) => {
    Acumulado = Acumulado + n;
    return Acumulado;
  }
}

/* SOLUCIONES 13.6 ------------------------------------------------------------
   E16  const n = 7;
        return () => n;
   E17  let n = 0;
        return () => {
          n = n + 1;
          return n;
        };
   E18  let total = 0;
        return (n) => {
          total = total + n;
          return total;
        };
-------------------------------------------------------------------------- */


/* ############################################################################
   13.7  FUNCIÓN PURA vs FUNCIÓN CON EFECTO
   ############################################################################
     PURA:       solo mira lo que recibe y devuelve algo nuevo.
     CON EFECTO: cambia algo de afuera (el array que le pasaron, una variable
                 global, el DOM, la base de datos).

        const conEfecto = (lista, x) => { lista.push(x); };   // toca el original
        const pura      = (lista, x) => [...lista, x];        // devuelve otro

   Los métodos de array se dividen igual:
     MUTAN:   push · pop · splice · sort · reverse
     COPIAN:  map · filter · slice · concat · [...lista]

   Por eso, para ordenar sin romper nada:
     [...lista].sort((a, b) => a - b)     // copio primero, después ordeno

   En Vue esto importa mucho: si mutas el array original en vez de reemplazarlo,
   la pantalla a veces no se entera. Lo ves a fondo en el tema 16.
############################################################################ */

// E19. Devuelve un array NUEVO con el elemento agregado al final.
// agregarPuro([1,2], 3) -> [1,2,3]   y la lista original sigue siendo [1,2]
function agregarPuro(lista, item) {
  return [...lista, item];
}

// E20. Devuelve un array NUEVO sin el elemento que valga `item`.
// quitarPuro([1,2,3], 2) -> [1,3]
function quitarPuro(lista, item) {
  // TODO: filter
}

// E21. Devuelve una COPIA ordenada de menor a mayor, sin mutar la original.
// ordenarPuro([3,1,2]) -> [1,2,3]
function ordenarPuro(lista) {
  return [...lista].sort((a, b) => a - b);
}

/* SOLUCIONES 13.7 ------------------------------------------------------------
   E19  return [...lista, item];
   E20  return lista.filter(x => x !== item);
   E21  return [...lista].sort((a, b) => a - b);
-------------------------------------------------------------------------- */


module.exports = {
  doble: typeof doble === 'function' ? doble : undefined,
  triple: typeof triple !== 'undefined' ? triple : undefined,
  cuadruple: typeof cuadruple !== 'undefined' ? cuadruple : undefined,
  mitad, mitadLarga, saludo,
  aObjeto, conLargo,
  ejecutar, dosVeces, siAcaso, mapearAMano,
  crearSaludo, sumador, envolver,
  crearSiete, crearContador, crearAcumulador,
  agregarPuro, quitarPuro, ordenarPuro,
};
