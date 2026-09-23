/* ============================================================================
   15 · OBJETOS A FONDO
   Nivel 3 · JavaScript a fondo
   ----------------------------------------------------------------------------
   Todo lo que llega de una API es un objeto o un array de objetos. Y el estado
   de Pinia, y las props de un componente.

   CÓMO ESTÁ ARMADO: pasos cortos. Cada paso enseña UNA cosa, trae su ejemplo
   y sus ejercicios de una línea, y abajo del bloque están SUS soluciones.
   No tienes que moverte del bloque en el que estás.

   Corrige con:   node verificar.js 15
   ============================================================================ */


/* ############################################################################
   15.1  LEER UN CAMPO: punto y corchetes
   ############################################################################
     const persona = { nombre: 'Ana', edad: 30 };

     persona.nombre       // 'Ana'   <- punto: escribes la clave a mano
     persona['nombre']    // 'Ana'   <- corchetes: la clave es un TEXTO

     const campo = 'nombre';
     persona[campo]       // 'Ana'         <- corchetes con VARIABLE
     persona.campo        // undefined     <- busca una clave llamada "campo"

   Regla: si la clave está guardada en una variable, corchetes. Si la escribes
   tú, punto.
############################################################################ */

// E1. Devuelve el nombre usando PUNTO.
// nombreDe({ nombre: 'Ana' }) -> 'Ana'
function nombreDe(persona) {
  // TODO
}

// E2. Devuelve el valor de esa clave usando CORCHETES.
// leerCampo({ a: 1, b: 2 }, 'b') -> 2
function leerCampo(obj, clave) {
  return obj[clave];
}

// E3. Devuelve los valores de esas claves, en ese orden.
// valoresDe({ id: 1, nombre: 'Ana' }, ['nombre', 'id']) -> ['Ana', 1]
function valoresDe(obj, claves) {
  return claves.map(c => obj[c]);
}

/* SOLUCIONES 15.1 ------------------------------------------------------------
   E1   return persona.nombre;
   E2   return obj[clave];
   E3   return claves.map(c => obj[c]);
-------------------------------------------------------------------------- */


/* ############################################################################
   15.2  ¿EXISTE LA CLAVE?  ->  el operador `in`
   ############################################################################
     const persona = { nombre: 'Ana' };

     'nombre' in persona     // true
     'email'  in persona     // false

   Ojo con la diferencia:
     const p = { edad: undefined };
     'edad' in p              // true   <- la clave SÍ existe
     p.edad !== undefined     // false  <- pero su valor es undefined
############################################################################ */

// E4. true si el objeto tiene esa clave (aunque valga undefined).
// tieneClave({ a: undefined }, 'a') -> true
function tieneClave(obj, clave) {
  return clave in obj;
}

// E5. Devuelve el valor de la clave, o el texto 'no hay' si no existe.
// oNoHay({ a: 1 }, 'a') -> 1 ;  oNoHay({ a: 1 }, 'z') -> 'no hay'
function oNoHay(obj, clave) {
  // TODO: usa `in` con un ternario
}

/* SOLUCIONES 15.2 ------------------------------------------------------------
   E4   return clave in obj;
   E5   return clave in obj ? obj[clave] : 'no hay';
-------------------------------------------------------------------------- */


/* ############################################################################
   15.3  COPIAR UN OBJETO SIN TOCAR EL ORIGINAL
   ############################################################################
   Paso a paso, que aquí está el 90% de lo que escribirás en Vue.

   a) copiar tal cual
        const copia = { ...original };

   b) copiar cambiando o agregando un campo
        const copia = { ...original, edad: 31 };     // pisa edad si existía

   c) copiar quitando un campo  ->  con delete sobre la COPIA
        const copia = { ...original };
        delete copia.edad;
        return copia;

   ⚠ `delete` NO devuelve el objeto: devuelve true o false. Por eso hay que
     hacerlo en dos líneas y devolver la copia después.

        return delete { ...obj }.edad;    // MAL: devuelve true
############################################################################ */

// E6. Devuelve una copia del objeto.
// copiar({ a: 1 }) -> { a: 1 }   (pero otro objeto distinto)
function copiar(obj) {
  // TODO
}

// E7. Devuelve una copia con la edad cambiada a 99.
// conEdad99({ nombre: 'Ana', edad: 30 }) -> { nombre: 'Ana', edad: 99 }
function conEdad99(persona) {
  // TODO
}

// E8. Devuelve una copia con ESE campo cambiado (la clave llega en variable).
// conCampo({ a: 1, b: 2 }, 'b', 99) -> { a: 1, b: 99 }
function conCampo(obj, clave, valor) {
  // TODO: { ...obj, [clave]: valor }   <- corchetes también al ESCRIBIR
}

// E9. Devuelve una COPIA sin esa clave. No mutes el original.
// sinClave({ a: 1, b: 2 }, 'b') -> { a: 1 }
function sinClave(obj, clave) {
  return delete {... obj}[clave];
}

/* SOLUCIONES 15.3 ------------------------------------------------------------
   E6   return { ...obj };
   E7   return { ...persona, edad: 99 };
   E8   return { ...obj, [clave]: valor };
   E9   const copia = { ...obj };
        delete copia[clave];
        return copia;
-------------------------------------------------------------------------- */


/* ############################################################################
   15.4  ESCRIBIR CLAVES: forma corta y clave calculada
   ############################################################################
     const nombre = 'Ana';
     { nombre }              // igual que  { nombre: nombre }

     const campo = 'edad';
     { [campo]: 30 }         // { edad: 30 }    <- clave CALCULADA
     { campo: 30 }           // { campo: 30 }   <- clave literal, otra cosa
############################################################################ */

// E10. Arma el objeto con la forma corta (sin repetir  nombre: nombre).
// armar('Ana', 30) -> { nombre: 'Ana', edad: 30 }
function armar(nombre, edad) {
  // TODO
}

// E11. Arma un objeto de un solo par, con la clave que llega en variable.
// filtroDe('estado', 'activo') -> { estado: 'activo' }
function filtroDe(clave, valor) {
  // TODO
}

/* SOLUCIONES 15.4 ------------------------------------------------------------
   E10  return { nombre, edad };
   E11  return { [clave]: valor };
-------------------------------------------------------------------------- */


/* ############################################################################
   15.5  LAS CUATRO FUNCIONES DE Object
   ############################################################################
     const persona = { nombre: 'Ana', edad: 30 };

     Object.keys(persona)      // ['nombre', 'edad']          las CLAVES
     Object.values(persona)    // ['Ana', 30]                 los VALORES
     Object.entries(persona)   // [['nombre','Ana'], ['edad',30]]   los PARES

     Object.fromEntries([['a', 1], ['b', 2]])    // { a: 1, b: 2 }
     ^ el inverso de entries: de array de pares vuelve a objeto
############################################################################ */

// E12. Devuelve las claves del objeto.
// claves({ a: 1, b: 2 }) -> ['a', 'b']
function claves(obj) {
  return Object.keys(obj);
}

// E13. Devuelve los valores del objeto.
// soloValores({ a: 1, b: 2 }) -> [1, 2]
function soloValores(obj) {
  // TODO
}

// E14. Suma todos los valores. (values te da un array normal: usa reduce.)
// sumarValores({ a: 1, b: 2, c: 3 }) -> 6
function sumarValores(obj) {
  return Object.values(obj).reduce((acumulado , valor) => acumulado + valor, 0);
}

// E15. Devuelve el PRIMER par [clave, valor] del objeto.
// primerPar({ a: 1, b: 2 }) -> ['a', 1]
function primerPar(obj) {
  // TODO: entries y te quedas con la posición 0
}

// E16. Convierte un array de pares en objeto.
// aObjeto([['a', 1], ['b', 2]]) -> { a: 1, b: 2 }
function aObjeto(pares) {
  // TODO
}

/* SOLUCIONES 15.5 ------------------------------------------------------------
   E12  return Object.keys(obj);
   E13  return Object.values(obj);
   E14  return Object.values(obj).reduce((total, valor) => total + valor, 0);
   E15  return Object.entries(obj)[0];
   E16  return Object.fromEntries(pares);
-------------------------------------------------------------------------- */


/* ############################################################################
   15.6  EL COMBO: entries -> map/filter -> fromEntries
   ############################################################################
   Con los tres juntos puedes usar map y filter SOBRE UN OBJETO: lo conviertes
   en array de pares, lo trabajas, y lo vuelves a armar.

     const precios = { pan: 100, leche: 200 };

     // 1) a pares
     Object.entries(precios)              // [['pan',100], ['leche',200]]

     // 2) transformo cada par  (fíjate en  ([clave, valor])  con paréntesis:
     //    es desestructuración de array dentro del parámetro)
        .map(([clave, valor]) => [clave, valor * 2])

     // 3) y vuelvo a objeto
     Object.fromEntries(...)              // { pan: 200, leche: 400 }
############################################################################ */

// E17. Devuelve un objeto nuevo con todos los valores multiplicados por 2.
// duplicarValores({ a: 1, b: 2 }) -> { a: 2, b: 4 }
function duplicarValores(obj) {
  return Object.fromEntries(
      Object.entries(obj).map(([clave, valor]) => [clave, valor*2])
  );
}

// E18. Devuelve un objeto nuevo con las CLAVES en mayúsculas.
// clavesMayus({ a: 1 }) -> { A: 1 }
function clavesMayus(obj) {
  // TODO: igual que E17, pero cambiando la posición 0 del par
}

// E19. Devuelve un objeto solo con las claves cuyo valor NO sea null ni
// undefined. (Aquí es filter en vez de map.)
// limpiar({ a: 1, b: null, c: undefined, d: 0 }) -> { a: 1, d: 0 }
function limpiar(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(([k, v]) => v !== null && v !== undefined)
  );

}

/* SOLUCIONES 15.6 ------------------------------------------------------------
   E17  return Object.fromEntries(
          Object.entries(obj).map(([clave, valor]) => [clave, valor * 2])
        );
   E18  return Object.fromEntries(
          Object.entries(obj).map(([clave, valor]) => [clave.toUpperCase(), valor])
        );
   E19  return Object.fromEntries(
          Object.entries(obj).filter(([clave, valor]) =>
            valor !== null && valor !== undefined)
        );
-------------------------------------------------------------------------- */


/* ############################################################################
   15.7  RECORRER UN OBJETO
   ############################################################################
     const persona = { nombre: 'Ana', edad: 30 };

     for (const [clave, valor] of Object.entries(persona)) {
       console.log(clave, valor);       // nombre Ana  /  edad 30
     }

   ⚠ No confundir:
        for (const x of [10, 20])   ->  x vale 10, luego 20   (VALOR, array)
        for (const i in { a: 1 })   ->  i vale 'a'            (CLAVE, objeto)
############################################################################ */

// E20. Devuelve un array de textos "clave=valor".
// describir({ a: 1, b: 2 }) -> ['a=1', 'b=2']
function describir(obj) {
  let arreglo = [];
  for (const [k, v] of Object.entries(obj)) arreglo.push(`${k}=${v}`);
  return arreglo
}

// E21. Lo mismo pero con map en vez de for. (Una sola línea.)
// describirCorto({ a: 1, b: 2 }) -> ['a=1', 'b=2']
function describirCorto(obj) {
  // TODO
}

/* SOLUCIONES 15.7 ------------------------------------------------------------
   E20  const salida = [];
        for (const [clave, valor] of Object.entries(obj)) {
          salida.push(`${clave}=${valor}`);
        }
        return salida;
   E21  return Object.entries(obj).map(([clave, valor]) => `${clave}=${valor}`);
-------------------------------------------------------------------------- */


/* ############################################################################
   15.8  CONSTRUIR UN OBJETO DESDE CERO  (aquí se va subiendo la escalera)
   ############################################################################
   Vas a necesitar esto para agrupar, contar e indexar. Se llega por pasos.

   a) objeto vacío y le metes una clave fija
        const salida = {};
        salida.total = 5;               // { total: 5 }

   b) la clave sale de un dato  ->  corchetes al ASIGNAR
        const salida = {};
        const clave = 'pan';
        salida[clave] = 100;            // { pan: 100 }

   c) recorres una lista y vas llenando
        const salida = {};
        for (const p of personas) {
          salida[p.id] = p;
        }

   d) lo mismo con reduce. El acumulador es el objeto que vas llenando, y
      HAY QUE DEVOLVERLO en cada vuelta:
        lista.reduce((salida, p) => {
          salida[p.id] = p;
          return salida;                // <- sin esto, la vuelta siguiente
        }, {});                         //    recibe undefined

   e) si la clave puede repetirse, primero miras qué había:
        salida[clave] = (salida[clave] || 0) + 1;
        //              ^ si no existía era undefined, y `|| 0` lo vuelve 0
############################################################################ */

// E22. Devuelve un objeto con esa clave y ese valor, empezando de {} vacío.
// (Hazlo en tres líneas: crear, asignar con corchetes, devolver.)
// unPar('pan', 100) -> { pan: 100 }
function unPar(clave, valor) {
  // TODO
}

// E23. Recorre la lista con un FOR y devuelve un objeto indexado por id.
// indexarConFor([{id:1,n:'a'},{id:2,n:'b'}]) -> { 1: {id:1,n:'a'}, 2: {id:2,n:'b'} }
function indexarConFor(lista) {
  // TODO: const salida = {}; for (...) { salida[...] = ...; } return salida;
}

// E24. Lo mismo, pero con reduce.
// indexarPorId([{id:1,n:'a'}]) -> { 1: {id:1,n:'a'} }
function indexarPorId(lista) {
  return lista.reduce( (objetoIndexado, obj) => {
    objetoIndexado[obj.id] = obj;
    return objetoIndexado;
  },{}
  );
}

// E25. Cuenta cuántas veces aparece cada texto. (Aquí entra el `|| 0`.)
// contar(['a', 'b', 'a']) -> { a: 2, b: 1 }
function contar(textos) {
  // TODO
}

// E26. Agrupa la lista por el valor de esa clave. Cada grupo es un ARRAY,
// así que en vez de `|| 0` usas `|| []` y haces push.
// agrupar([{t:'a',v:1},{t:'b',v:2},{t:'a',v:3}], 't')
//   -> { a: [{t:'a',v:1},{t:'a',v:3}], b: [{t:'b',v:2}] }
function agrupar(lista, clave) {
  // TODO
}

/* SOLUCIONES 15.8 ------------------------------------------------------------
   E22  const salida = {};
        salida[clave] = valor;
        return salida;
   E23  const salida = {};
        for (const item of lista) {
          salida[item.id] = item;
        }
        return salida;
   E24  return lista.reduce((salida, item) => {
          salida[item.id] = item;
          return salida;
        }, {});
   E25  return textos.reduce((salida, texto) => {
          salida[texto] = (salida[texto] || 0) + 1;
          return salida;
        }, {});
   E26  return lista.reduce((salida, item) => {
          const grupo = item[clave];
          salida[grupo] = salida[grupo] || [];
          salida[grupo].push(item);
          return salida;
        }, {});
-------------------------------------------------------------------------- */


/* ############################################################################
   15.9  OBJETOS DENTRO DE OBJETOS
   ############################################################################
     const pedido = {
       id: 7,
       cliente: { nombre: 'Ana', direccion: { ciudad: 'Lima' } },
       items: [{ sku: 'A1' }],
     };

     pedido.cliente.direccion.ciudad      // 'Lima'
     pedido.items[0].sku                  // 'A1'

   Si algún nivel puede faltar, revienta. Con `?.` no:
     pedido.cliente?.direccion?.ciudad    // undefined en vez de error
     pedido.items?.[0]?.sku               // para índices:  ?.[
############################################################################ */

// E27. Devuelve la ciudad del cliente, o 'desconocida' si falta algún nivel.
// ciudadPedido({ cliente: { direccion: { ciudad: 'Lima' } } }) -> 'Lima'
// ciudadPedido({}) -> 'desconocida'
function ciudadPedido(pedido) {
  // TODO: ?. encadenado y ?? al final
}

// E28. Devuelve el sku del primer item, o null si no hay items.
// primerSku({ items: [{ sku: 'A1' }] }) -> 'A1'
// primerSku({ items: [] }) -> null
function primerSku(pedido) {
  // TODO
}

/* SOLUCIONES 15.9 ------------------------------------------------------------
   E27  return pedido.cliente?.direccion?.ciudad ?? 'desconocida';
   E28  return pedido.items?.[0]?.sku ?? null;
-------------------------------------------------------------------------- */


module.exports = {
  nombreDe, leerCampo, valoresDe,
  tieneClave, oNoHay,
  copiar, conEdad99, conCampo, sinClave,
  armar, filtroDe,
  claves, soloValores, sumarValores, primerPar, aObjeto,
  duplicarValores, clavesMayus, limpiar,
  describir, describirCorto,
  unPar, indexarConFor, indexarPorId, contar, agrupar,
  ciudadPedido, primerSku,
};
