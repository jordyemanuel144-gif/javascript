/* ============================================================================
   14 · MÉTODOS DE ARRAY — los que usarás todos los días
   Nivel 3 · JavaScript a fondo
   ----------------------------------------------------------------------------
   El 90% del trabajo en una pantalla de Vue es: traer una lista, filtrarla,
   ordenarla y pintarla. Todo eso son estos métodos.

   CÓMO ESTÁ ARMADO: pasos cortos. Cada paso enseña UNA cosa, trae su ejemplo
   y sus ejercicios, y abajo del bloque están SUS soluciones.

   Corrige con:   node verificar.js 14
   ============================================================================ */

// Datos que se usan más abajo (imagina que vienen de una API)
const PRODUCTOS = [
  { id: 1, nombre: 'Teclado',  precio: 120, stock: 10, categoria: 'perifericos' },
  { id: 2, nombre: 'Mouse',    precio: 80,  stock: 0,  categoria: 'perifericos' },
  { id: 3, nombre: 'Monitor',  precio: 900, stock: 4,  categoria: 'pantallas'   },
  { id: 4, nombre: 'Notebook', precio: 3500, stock: 2, categoria: 'computos'    },
];


/* ############################################################################
   14.1  map — transformar CADA elemento
   ############################################################################
     [1, 2, 3].map(n => n * 2);           // [2, 4, 6]

   Devuelve un array NUEVO, del mismo largo. El original no se toca.

   Con objetos, entras a los campos con punto:
     const gente = [{ nombre: 'Ana' }, { nombre: 'Luis' }];
     gente.map(p => p.nombre);            // ['Ana', 'Luis']

   El callback recibe también el índice, si lo pides:
     ['a', 'b'].map((letra, i) => `${i}: ${letra}`);    // ['0: a', '1: b']
     //                     ^ el índice empieza en 0
############################################################################ */

// E1. Devuelve los números al cuadrado.
// cuadrados([1,2,3]) -> [1,4,9]
function cuadrados(numeros) {
  // TODO
}

// E2. Devuelve los nombres de los productos en MAYÚSCULAS.
// nombresMayus(PRODUCTOS) -> ['TECLADO', 'MOUSE', 'MONITOR', 'NOTEBOOK']
function nombresMayus(productos) {
  return productos.map(n => n.nombre.toUpperCase());
}

// E3. Recibe un array de TEXTOS y los numera empezando en 1.
// numerados(['Teclado', 'Mouse']) -> ['1. Teclado', '2. Mouse']
function numerados(nombres) {
  return nombres.map((elemento, indice) => `${indice+1}. ${elemento.nombre}`)
}

/* SOLUCIONES 14.1 ------------------------------------------------------------
   E1   return numeros.map(n => n * n);
   E2   return productos.map(p => p.nombre.toUpperCase());
   E3   return nombres.map((nombre, i) => `${i + 1}. ${nombre}`);
        (ojo: aquí llegan TEXTOS sueltos, no objetos: no lleva .nombre)
-------------------------------------------------------------------------- */


/* ############################################################################
   14.2  forEach — recorrer sin devolver nada
   ############################################################################
     [1, 2].forEach(n => console.log(n));     // imprime 1 y 2
     const x = [1, 2].forEach(n => n * 2);    // x es undefined

   forEach NO devuelve nada. Sirve solo para hacer algo con cada elemento
   (imprimir, guardar, llamar a una función).

   Si quieres un array de vuelta, es map. Confundirlos es error de todos
   los días.
############################################################################ */

// E4. Usa forEach para meter cada nombre en el array `destino` que recibes.
// No devuelvas nada.
// const salida = []; llenar(['a','b'], salida);  salida -> ['a','b']
function llenar(nombres, destino) {
  // TODO
}

/* SOLUCIONES 14.2 ------------------------------------------------------------
   E4   nombres.forEach(nombre => destino.push(nombre));
-------------------------------------------------------------------------- */


/* ############################################################################
   14.3  filter — quedarse con los que cumplen
   ############################################################################
     [1, 2, 3, 4].filter(n => n > 2);     // [3, 4]

   Devuelve un array NUEVO con los que dieron true. Puede quedar vacío.

     PRODUCTOS.filter(p => p.stock > 0);          // los que tienen stock
     PRODUCTOS.filter(p => p.precio < 500);       // los baratos
############################################################################ */

// E5. Devuelve solo los números pares.  (par = n % 2 === 0)
// pares([1,2,3,4]) -> [2,4]
function pares(numeros) {
  // TODO
}

// E6. Devuelve solo los productos con stock mayor a 0.
function conStock(productos) {
  return productos.filter(p => p.stock > 0);
}

/* SOLUCIONES 14.3 ------------------------------------------------------------
   E5   return numeros.filter(n => n % 2 === 0);
   E6   return productos.filter(p => p.stock > 0);
-------------------------------------------------------------------------- */


/* ############################################################################
   14.4  find y findIndex — buscar UNO
   ############################################################################
     [1, 2, 3].find(n => n > 1);          // 2     el PRIMERO que cumple
     [1, 2, 3].findIndex(n => n > 1);     // 1     su POSICIÓN

   Si no encuentra nada:
     find      -> undefined
     findIndex -> -1

   ⚠ filter devuelve un ARRAY, find devuelve UN ELEMENTO. Si escribes
     `.filter(...)[0]`, lo que querías era `.find(...)`.
############################################################################ */

// E7. Devuelve el producto con ese id, o undefined si no existe.
function porId(productos, id) {
  return productos.find(u => u.id === id);
}

// E8. Devuelve la POSICIÓN del producto con ese nombre, o -1.
// posicionDe(PRODUCTOS, 'Monitor') -> 2
function posicionDe(productos, nombre) {
  return productos.findIndex(p => p.nombre === nombre);
}

/* SOLUCIONES 14.4 ------------------------------------------------------------
   E7   return productos.find(p => p.id === id);
   E8   return productos.findIndex(p => p.nombre === nombre);
-------------------------------------------------------------------------- */


/* ############################################################################
   14.5  includes — ¿está este valor?
   ############################################################################
     ['a', 'b'].includes('b');      // true
     ['a', 'b'].includes('B');      // false   <- distingue mayúsculas
     [1, 2].includes(3);            // false

   Solo sirve para valores simples (textos, números). Para objetos usa
   `some` (viene ahora).
############################################################################ */

// E9. true si el array de roles contiene 'admin' (en minúsculas).
// esAdmin(['user','admin']) -> true ;  esAdmin(['user']) -> false
function esAdmin(roles) {
  return roles.includes('Admin');
}

/* SOLUCIONES 14.5 ------------------------------------------------------------
   E9   return roles.includes('admin');
        (con 'Admin' da false: includes distingue mayúsculas)
-------------------------------------------------------------------------- */


/* ############################################################################
   14.6  some y every — preguntar por toda la lista
   ############################################################################
     [1, 2, 3].some(n => n > 2);      // true    ¿hay AL MENOS uno?
     [1, 2, 3].every(n => n > 2);     // false   ¿cumplen TODOS?

   Devuelven true o false, no elementos. Son los que usas para habilitar o
   deshabilitar un botón.

   Sobre un array vacío:  some -> false  ·  every -> true  (sí, true).
############################################################################ */

// E10. true si hay algún producto agotado (stock === 0).
function hayAgotados(productos) {
  return productos.some(p => p.stock === 0);
}

// E11. true si TODOS los productos cuestan menos de 5000.
function todosBaratos(productos) {
  return productos.every(p => p.precio < 5000);
}

/* SOLUCIONES 14.6 ------------------------------------------------------------
   E10  return productos.some(p => p.stock === 0);
   E11  return productos.every(p => p.precio < 5000);
-------------------------------------------------------------------------- */


/* ############################################################################
   14.7  sort — ordenar (aquí hay cuatro cosas, una por una)
   ############################################################################

   a) sin comparador, ordena como TEXTO. Con números queda mal:
        [10, 9, 100].sort();                 // [10, 100, 9]

   b) con comparador, ordena bien. La regla es siempre la misma:
        [10, 9, 100].sort((a, b) => a - b);  // [9, 10, 100]   de menor a mayor
        [10, 9, 100].sort((a, b) => b - a);  // [100, 10, 9]   de mayor a menor
        //                          ^ a - b sube, b - a baja

   c) ⚠ sort MUTA el array original. Copia primero, SIEMPRE:
        const ordenado = [...lista].sort((a, b) => a - b);
        //               ^^^^^^^^^ esto es lo que salva

   d) para ordenar por un campo, restas ese campo:
        [...PRODUCTOS].sort((a, b) => a.precio - b.precio);

   e) para TEXTOS no sirve la resta. Se usa localeCompare:
        [...nombres].sort((a, b) => a.localeCompare(b));
############################################################################ */

// E12. Copia ordenada de MENOR a mayor.
// ordenarAsc([3,1,2]) -> [1,2,3]
function ordenarAsc(numeros) {
  // TODO
}

// E13. Copia ordenada de MAYOR a menor.
// ordenarDesc([1,5,3]) -> [5,3,1]
function ordenarDesc(numeros) {
  return [...numeros].sort((a, b) => a - b);
}

// E14. Copia de los productos ordenada por precio, del más barato al más caro.
function porPrecio(productos) {
   return [...productos].sort((a, b) => a.precio - b.precio);
}

// E15. Recibe un array de TEXTOS y devuelve una copia ordenada alfabéticamente.
// alfabetico(['Mouse','Teclado','Monitor']) -> ['Monitor','Mouse','Teclado']
function alfabetico(nombres) {
  return nombres.sort((a, b) => a.nombre.localeCompare(b.nombre));
}

/* SOLUCIONES 14.7 ------------------------------------------------------------
   E12  return [...numeros].sort((a, b) => a - b);
   E13  return [...numeros].sort((a, b) => b - a);
   E14  return [...productos].sort((a, b) => a.precio - b.precio);
   E15  return [...nombres].sort((a, b) => a.localeCompare(b));
        (aquí llegan TEXTOS, no objetos: no lleva .nombre. Y el [...] es
         obligatorio para no mutar el array que te pasaron.)
-------------------------------------------------------------------------- */


/* ############################################################################
   14.8  reduce — convertir toda la lista en UN valor
   ############################################################################
   Este es el que más cuesta. Va por partes.

   a) sumar números
        [1, 2, 3].reduce((total, n) => total + n, 0);
        //                                        ^ valor inicial
        //  vuelta 1:  total=0, n=1  ->  devuelvo 1
        //  vuelta 2:  total=1, n=2  ->  devuelvo 3
        //  vuelta 3:  total=3, n=3  ->  devuelvo 6
        // resultado: 6

      Lo que devuelves en cada vuelta es el `total` de la siguiente.

   b) el valor inicial decide QUÉ estás construyendo. No tiene que ser número:
        ['h', 'o', 'la'].reduce((texto, t) => texto + t, '');    // 'hola'
        //                                               ^ empiezo con texto vacío

   c) sumar un CAMPO de una lista de objetos: igual, pero entras con punto
        const compras = [{ precio: 10 }, { precio: 20 }];
        compras.reduce((total, item) => total + item.precio, 0);    // 30

   d) el valor inicial puede ser un OBJETO, y lo vas llenando:
        const salida = compras.reduce((acumulado, item) => {
          acumulado[item.tipo] = (acumulado[item.tipo] || 0) + 1;
          //         ^ clave dinámica     ^ si no existía, era undefined -> 0
          return acumulado;      // ⚠ sin este return, la vuelta siguiente
        }, {});                  //   recibe undefined y todo se rompe

      (Esta forma está explicada paso a paso en el tema 15.8, si te marea.)

   ⚠ Pon SIEMPRE el valor inicial. Sin él, un array vacío lanza error.
############################################################################ */

// E16. Suma un array de números. Con array vacío devuelve 0.
// sumar([1,2,3]) -> 6 ;  sumar([]) -> 0
function sumar(numeros) {
  return numeros.reduce((sumaTotal, numero) => sumaTotal + numero, 0);
}

// E17. Junta todos los textos en uno solo, usando reduce.
// juntar(['ho','la']) -> 'hola' ;  juntar([]) -> ''
function juntar(textos) {
  // TODO: el valor inicial es el texto vacío
}

// E18. Valor total del inventario: suma de precio * stock de cada producto.
// totalInventario(PRODUCTOS) -> 120*10 + 80*0 + 900*4 + 3500*2 = 11800
function totalInventario(productos) {
  return productos.reduce((sumaDeInventario, producto) => {
     sumaDeInventario = sumaDeInventario + (producto.precio * producto.stock);
     return sumaDeInventario;
  }, 0 );
}

// E19. Cuenta cuántos productos hay por categoría.
// contarPorCategoria(PRODUCTOS) -> { perifericos: 2, pantallas: 1, computos: 1 }
function contarPorCategoria(productos) {
  return productos.reduce((mapa, p) => {
    mapa[p.categoria] = (mapa[p.categoria] ?? 0) + 1;
    return mapa;
  }, {})
}

/* SOLUCIONES 14.8 ------------------------------------------------------------
   E16  return numeros.reduce((total, n) => total + n, 0);
   E17  return textos.reduce((texto, t) => texto + t, '');
   E18  return productos.reduce((total, p) => total + p.precio * p.stock, 0);
   E19  return productos.reduce((salida, p) => {
          salida[p.categoria] = (salida[p.categoria] || 0) + 1;
          return salida;
        }, {});
-------------------------------------------------------------------------- */


/* ############################################################################
   14.9  CORTAR, UNIR Y QUITAR DUPLICADOS
   ############################################################################
     [1,2,3,4].slice(0, 2);       // [1, 2]    copia del 0 al 1 (el 2 no entra)
     [1,2,3,4].slice(-2);         // [3, 4]    los últimos dos
     ['a','b'].join(' - ');       // 'a - b'   array -> texto
     [...new Set([1,1,2])];       // [1, 2]    sin duplicados

   ⚠ slice COPIA (seguro) · splice MUTA (corta dentro del original). Se
     parecen en el nombre y hacen cosas muy distintas.
############################################################################ */

// E20. Devuelve los primeros 3 elementos (una copia).
function primeros3(lista) {
  return lista.slice(0 , 3);
}

// E21. Une los nombres de los productos con ' · ' en medio.
// listarNombres(PRODUCTOS) -> 'Teclado · Mouse · Monitor · Notebook'
function listarNombres(productos) {
  return productos.map(p => p.nombre).join(" . ");
}

// E22. Quita los valores repetidos manteniendo el orden.
// sinRepetidos([1,2,2,3,1]) -> [1,2,3]
function sinRepetidos(lista) {
  return [... new Set(lista)];
}

/* SOLUCIONES 14.9 ------------------------------------------------------------
   E20  return lista.slice(0, 3);
   E21  return productos.map(p => p.nombre).join(' · ');
        (el separador es punto medio ' · ', no punto normal)
   E22  return [...new Set(lista)];
-------------------------------------------------------------------------- */


/* ############################################################################
   14.10  ENCADENAR — el patrón real de una pantalla
   ############################################################################
   Como filter y map devuelven arrays, se pueden pegar uno detrás de otro.
   Paso a paso:

     // 1) primero filtro
     PRODUCTOS.filter(p => p.stock > 0)

     // 2) al resultado le aplico map
     PRODUCTOS.filter(p => p.stock > 0)
              .map(p => p.nombre)

     // 3) y al resultado, sort
     PRODUCTOS.filter(p => p.stock > 0)
              .map(p => p.nombre)
              .sort((a, b) => a.localeCompare(b))

   Cada eslabón recibe lo que devolvió el anterior. Ojo con el orden: después
   del `.map(p => p.nombre)` ya NO tienes objetos, tienes textos, así que a
   partir de ahí no puedes usar `p.precio`.

   Esto es literalmente lo que va dentro de un `computed` de Vue.
############################################################################ */

// E23. Nombres de los productos que cuestan más de 500.
// nombresCaros(PRODUCTOS) -> ['Monitor', 'Notebook']
function nombresCaros(productos) {
  // TODO: filter y después map
}

// E24. Nombres de los productos con stock, ordenados alfabéticamente.
// disponiblesOrdenados(PRODUCTOS) -> ['Monitor', 'Notebook', 'Teclado']
function disponiblesOrdenados(productos) {
  return [...productos].map(p => p.stock > 0).map(p => p.name).sort();
}

// E25. Productos de esa categoría, cada uno con un campo nuevo `caro`
// (true si precio > 500). Devuelve objetos nuevos, no mutes los originales.
// deCategoria(PRODUCTOS, 'pantallas')
//   -> [{ id:3, nombre:'Monitor', precio:900, stock:4, categoria:'pantallas', caro:true }]
function deCategoria(productos, categoria) {
  return productos.filter( p => p.categoria === categoria).map(p => ({...p, caro: p.precio > 500 ? true : false}));
}

/* SOLUCIONES 14.10 -----------------------------------------------------------
   E23  return productos.filter(p => p.precio > 500).map(p => p.nombre);
   E24  return productos.filter(p => p.stock > 0)
                        .map(p => p.nombre)
                        .sort((a, b) => a.localeCompare(b));
        (el fallo típico: usar .map para filtrar. map devuelve true/false,
         no quita elementos. Y el campo es `nombre`, no `name`.)
   E25  return productos.filter(p => p.categoria === categoria)
                        .map(p => ({ ...p, caro: p.precio > 500 }));
-------------------------------------------------------------------------- */


module.exports = {
  PRODUCTOS,
  cuadrados, nombresMayus, numerados,
  llenar,
  pares, conStock,
  porId, posicionDe,
  esAdmin,
  hayAgotados, todosBaratos,
  ordenarAsc, ordenarDesc, porPrecio, alfabetico,
  sumar, juntar, totalInventario, contarPorCategoria,
  primeros3, listarNombres, sinRepetidos,
  nombresCaros, disponiblesOrdenados, deCategoria,
};
