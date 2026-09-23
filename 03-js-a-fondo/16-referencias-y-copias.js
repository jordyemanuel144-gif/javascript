/* ============================================================================
   16 · REFERENCIAS, COPIAS E INMUTABILIDAD
   Nivel 3 · JavaScript a fondo
   ----------------------------------------------------------------------------
   Este es EL tema que explica "Vue no me actualiza la pantalla" y "cambié una
   cosa y se cambió otra sola". Si lo entiendes aquí, te ahorras horas después.

   CÓMO ESTÁ ARMADO: pasos cortos, ejercicios de una línea, y las soluciones
   de cada bloque justo debajo de sus ejercicios.

   Corrige con:   node verificar.js 16
   ============================================================================ */


/* ############################################################################
   16.1  VALOR vs REFERENCIA
   ############################################################################

   a) los tipos simples (número, texto, boolean) se COPIAN:
        let a = 1;
        let b = a;
        b = 2;
        a;              // 1    <- intacto

   b) los objetos y arrays NO se copian: las dos variables apuntan al MISMO:
        const uno = { n: 1 };
        const dos = uno;        // NO es una copia
        dos.n = 99;
        uno.n;          // 99   <- cambió "solo"

   c) lo mismo al pasar a una función: recibe la referencia, no una copia:
        function ponerCero(lista) { lista.push(0); }
        const nums = [1, 2];
        ponerCero(nums);
        nums;           // [1, 2, 0]   <- el de afuera cambió
############################################################################ */

// E1. true si las dos variables apuntan al MISMO objeto.
// const x = {a:1};  mismoObjeto(x, x) -> true ;  mismoObjeto({a:1},{a:1}) -> false
function mismoObjeto(a, b) {
  // TODO: === sobre objetos compara la referencia, no el contenido
}

// E2. Agrega el item MUTANDO la lista que recibes. No devuelvas nada.
// (Es el ejemplo de lo que NO conviene, pero hay que saber escribirlo.)
function agregarMutando(lista, item) {
  // TODO
}

/* SOLUCIONES 16.1 ------------------------------------------------------------
   E1   return a === b;
   E2   lista.push(item);
-------------------------------------------------------------------------- */


/* ############################################################################
   16.2  COPIAR CON SPREAD  ( ... )
   ############################################################################

   a) copiar un array
        const copia = [...lista];

   b) copiar un objeto
        const copia = { ...persona };

   c) copiar cambiando o agregando un campo
        const copia = { ...persona, edad: 31 };
        //                          ^ si ya existía edad, la pisa

   d) mezclar dos objetos: el de la DERECHA gana
        const config = { ...porDefecto, ...delUsuario };

   e) si la clave está en una variable, corchetes:
        const copia = { ...persona, [campo]: valor };
############################################################################ */

// E3. Devuelve una copia del array.
// copiarLista([1,2]) -> [1,2]   (pero otro array)
function copiarLista(lista) {
  // TODO
}

// E4. Devuelve una copia del objeto.
function copiar(obj) {
  // TODO
}

// E5. Mezcla: los valores de `cambios` pisan a los de `base`.
// mezclar({a:1, b:2}, {b:9}) -> { a: 1, b: 9 }
function mezclar(base, cambios) {
  // TODO
}

// E6. Copia del objeto con ESE campo cambiado (la clave llega en variable).
// conCampo({a:1, b:2}, 'b', 99) -> { a: 1, b: 99 }
function conCampo(obj, clave, valor) {
  // TODO
}

/* SOLUCIONES 16.2 ------------------------------------------------------------
   E3   return [...lista];
   E4   return { ...obj };
   E5   return { ...base, ...cambios };
   E6   return { ...obj, [clave]: valor };
-------------------------------------------------------------------------- */


/* ############################################################################
   16.3  LA COPIA CON ... ES SUPERFICIAL
   ############################################################################
   Copia solo el primer nivel. Lo que esté anidado SIGUE COMPARTIDO:

     const original = { nombre: 'Ana', dir: { ciudad: 'Lima' } };
     const copia = { ...original };

     copia.nombre = 'Eva';         // original.nombre sigue 'Ana'    ✓ separado
     copia.dir.ciudad = 'Cusco';   // original.dir.ciudad AHORA es 'Cusco'  ✗

   Para separar también lo de adentro:
     const copia = structuredClone(original);

   Regla práctica: usa `{ ...obj }` casi siempre. structuredClone solo cuando
   de verdad vayas a editar niveles anidados.
############################################################################ */

// E7. Devuelve una copia profunda de verdad (lo anidado también separado).
function copiarProfundo(obj) {
  // TODO: structuredClone
}

/* SOLUCIONES 16.3 ------------------------------------------------------------
   E7   return structuredClone(obj);
-------------------------------------------------------------------------- */


/* ############################################################################
   16.4  LOS CUATRO PATRONES DE LISTA  (los que escribirás en Vue)
   ############################################################################
   Ninguno toca el array original: todos devuelven uno nuevo.

   a) AGREGAR al final
        [...lista, nuevo]

   b) AGREGAR al principio
        [nuevo, ...lista]

   c) QUITAR por id
        lista.filter(x => x.id !== id)

   d) EDITAR uno solo, dejando los demás igual
        lista.map(x => x.id === id ? { ...x, nombre: 'Nuevo' } : x)
        //            ^ si coincide, devuelvo una COPIA con el cambio
        //                                          ^ si no, lo devuelvo tal cual

   El patrón (d) es el que más cuesta. Se lee: "recorro todos; al que coincide
   le doy un objeto nuevo con el campo cambiado; a los otros los dejo".
############################################################################ */

// E8. Agrega al final devolviendo un array nuevo.
// agregar([{id:1}], {id:2}) -> [{id:1},{id:2}]
function agregar(lista, item) {
  // TODO
}

// E9. Quita el elemento con ese id.
// quitar([{id:1},{id:2}], 1) -> [{id:2}]
function quitar(lista, id) {
  // TODO
}

// E10. Cambia el campo `nombre` del elemento con ese id, sin mutar nada.
// renombrar([{id:1,nombre:'a'},{id:2,nombre:'b'}], 2, 'z')
//   -> [{id:1,nombre:'a'},{id:2,nombre:'z'}]
function renombrar(lista, id, nombre) {
  // TODO
}

// E11. Invierte el booleano `hecha` del elemento con ese id.
// alternar([{id:1,hecha:false}], 1) -> [{id:1,hecha:true}]
function alternar(lista, id) {
  // TODO: igual que E10, pero el valor nuevo es  !x.hecha
}

/* SOLUCIONES 16.4 ------------------------------------------------------------
   E8   return [...lista, item];
   E9   return lista.filter(x => x.id !== id);
   E10  return lista.map(x => x.id === id ? { ...x, nombre } : x);
   E11  return lista.map(x => x.id === id ? { ...x, hecha: !x.hecha } : x);
-------------------------------------------------------------------------- */


/* ############################################################################
   16.5  `const` NO significa "no se puede cambiar"
   ############################################################################
     const lista = [1, 2];
     lista.push(3);       // ✓ permitido: es el mismo array, cambió por dentro
     lista = [9];         // ✗ TypeError: eso sí es reasignar la variable

   `const` protege la VARIABLE, no el contenido.

   Para congelar el contenido:
     const cfg = Object.freeze({ url: 'http://x' });
     cfg.url = 'otra';    // no hace nada
     Object.isFrozen(cfg) // true

   (freeze también es superficial: lo anidado sigue editable.)
############################################################################ */

// E12. Devuelve el objeto congelado.
function congelar(obj) {
  // TODO
}

// E13. true si el objeto está congelado.
function estaCongelado(obj) {
  // TODO: Object.isFrozen
}

/* SOLUCIONES 16.5 ------------------------------------------------------------
   E12  return Object.freeze(obj);
   E13  return Object.isFrozen(obj);
-------------------------------------------------------------------------- */


/* ############################################################################
   16.6  COMPARAR: === mira la referencia, no el contenido
   ############################################################################
     'ab' === 'ab'             // true    los simples se comparan por valor
     { a: 1 } === { a: 1 }     // false   son dos objetos distintos
     [1, 2] === [1, 2]         // false

   Para comparar CONTENIDO, el truco rápido:
     JSON.stringify(a) === JSON.stringify(b)
     (sirve si las claves están en el mismo orden; no es infalible)

   Esto explica por qué en Vue un `watch` sobre un objeto no se dispara si lo
   mutas por dentro: la referencia no cambió. Por eso a veces se reemplaza el
   objeto entero en vez de editarlo.
############################################################################ */

// E14. Compara el CONTENIDO de dos objetos planos.
// igualContenido({a:1},{a:1}) -> true ;  igualContenido({a:1},{a:2}) -> false
function igualContenido(a, b) {
  // TODO
}

// E15. Devuelve un objeto NUEVO con el mismo contenido (para forzar que Vue
// detecte el cambio).
// const b = forzarNuevo(a);  b !== a, pero mismo contenido
function forzarNuevo(obj) {
  // TODO
}

/* SOLUCIONES 16.6 ------------------------------------------------------------
   E14  return JSON.stringify(a) === JSON.stringify(b);
   E15  return { ...obj };
-------------------------------------------------------------------------- */


module.exports = {
  mismoObjeto, agregarMutando,
  copiarLista, copiar, mezclar, conCampo,
  copiarProfundo,
  agregar, quitar, renombrar, alternar,
  congelar, estaCongelado,
  igualContenido, forzarNuevo,
};
