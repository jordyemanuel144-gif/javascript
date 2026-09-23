/* ============================================================================
   21 · MAP, SET Y EXPRESIONES REGULARES
   Nivel 3 · JavaScript a fondo
   ----------------------------------------------------------------------------
   Set y Map aparecen en cachés y en listas de seleccionados. Las regex, en
   toda validación de formulario. No hace falta dominarlas: hay que saber
   leerlas y tener a mano las cuatro de siempre.

   CÓMO ESTÁ ARMADO: pasos cortos, ejercicios cortos, soluciones por bloque.
   Corrige con:   node verificar.js 21
   ============================================================================ */


/* ############################################################################
   21.1  SET — una lista que no admite repetidos
   ############################################################################
     const s = new Set([1, 2, 2, 3]);     // {1, 2, 3}  el 2 repetido se cae

     s.add(4)          // agregar (si ya está, no hace nada)
     s.has(2)          // true / false
     s.delete(1)       // quitar
     s.size            // cuántos hay   ⚠ es `size`, no `length`
     [...s]            // volver a array

   El uso estrella, y el que más vas a escribir:
     const unicos = [...new Set(lista)];      // quitar duplicados en una línea
############################################################################ */

// E1. Cuántos valores DISTINTOS hay en el array.
// cuantosDistintos([1,1,2,3,3]) -> 3
function cuantosDistintos(lista) {
  // TODO: new Set(...) y su .size
}

// E2. Quita los repetidos manteniendo el orden.
// unicos([1,2,2,3,1]) -> [1,2,3]
function unicos(lista) {
  // TODO
}

/* SOLUCIONES 21.1 ------------------------------------------------------------
   E1   return new Set(lista).size;
   E2   return [...new Set(lista)];
-------------------------------------------------------------------------- */


/* ############################################################################
   21.2  SET PARA BUSCAR RÁPIDO Y PARA SELECCIONADOS
   ############################################################################
   `s.has(x)` es mucho más rápido que `array.includes(x)` en listas grandes,
   porque el Set no recorre: va directo.

     const permitidos = new Set(['admin', 'editor']);
     permitidos.has(rol);           // true / false

   Y el patrón de los checkboxes de una tabla:
     if (seleccionados.has(id)) seleccionados.delete(id);
     else                       seleccionados.add(id);
############################################################################ */

// E3. Devuelve los elementos que están en las DOS listas.
// comunes([1,2,3], [2,3,4]) -> [2,3]
function comunes(a, b) {
  // TODO: haz un Set con b, y filtra a preguntando si lo tiene
}

// E4. Agrega o quita el id del Set (lo que hace un checkbox). Devuelve el Set.
// const s = new Set([1]);  alternarId(s, 1) -> Set vacío
function alternarId(seleccionados, id) {
  // TODO: si ya está -> delete, si no -> add. Y devuelve seleccionados.
}

/* SOLUCIONES 21.2 ------------------------------------------------------------
   E3   const enB = new Set(b);
        return a.filter(x => enB.has(x));
   E4   if (seleccionados.has(id)) seleccionados.delete(id);
        else seleccionados.add(id);
        return seleccionados;
-------------------------------------------------------------------------- */


/* ############################################################################
   21.3  MAP — pares clave/valor, con cualquier tipo de clave
   ############################################################################
     const m = new Map();
     m.set('a', 1);
     m.get('a')        // 1          (undefined si no está)
     m.has('a')        // true
     m.delete('a')
     m.size

     new Map([[1, 'uno'], [2, 'dos']]);      // desde un array de pares

   Map vs objeto normal:
     · en un objeto TODAS las claves se vuelven texto; en un Map pueden ser
       números, objetos, lo que sea
     · el Map conserva el orden en que metiste las cosas
     · `size` directo, sin Object.keys(obj).length

   Cuándo usar cada uno:
     · datos que van y vienen de la API como JSON  -> objeto normal
       (un Map no se puede convertir a JSON)
     · una caché en memoria, claves numéricas      -> Map
############################################################################ */

// E5. Crea un Map a partir de un array de objetos, usando el id como clave.
// aMapa([{id:1,n:'a'}]) -> Map { 1 => {id:1,n:'a'} }
function aMapa(lista) {
  // TODO: new Map(lista.map(...)) — cada elemento tiene que quedar [clave, valor]
}

// E6. Devuelve el valor del Map por su clave, o null si no está.
// (get devuelve undefined; hay que convertirlo a null)
function buscarEnMapa(mapa, clave) {
  // TODO
}

/* SOLUCIONES 21.3 ------------------------------------------------------------
   E5   return new Map(lista.map(item => [item.id, item]));
   E6   return mapa.get(clave) ?? null;
-------------------------------------------------------------------------- */


/* ############################################################################
   21.4  CONTAR CON UN MAP
   ############################################################################
   Mismo patrón que contar con un objeto (tema 15.8e), pero con set/get:

     const cuenta = new Map();
     for (const palabra of palabras) {
       cuenta.set(palabra, (cuenta.get(palabra) || 0) + 1);
       //                   ^ si no estaba, get da undefined -> `|| 0` lo pone en 0
     }
############################################################################ */

// E7. Cuenta cuántas veces aparece cada palabra. Devuelve un Map.
// contarPalabras(['a','b','a']) -> Map { 'a' => 2, 'b' => 1 }
function contarPalabras(palabras) {
  // TODO
}

/* SOLUCIONES 21.4 ------------------------------------------------------------
   E7   const cuenta = new Map();
        for (const palabra of palabras) {
          cuenta.set(palabra, (cuenta.get(palabra) || 0) + 1);
        }
        return cuenta;
-------------------------------------------------------------------------- */


/* ############################################################################
   21.5  REGEX: qué es y cómo se lee
   ############################################################################
   Una expresión regular es un PATRÓN de texto. Va entre barras:

     /hola/         <- busca el texto "hola"
     /^\d+$/        <- "de principio a fin, solo dígitos"

   El alfabeto mínimo, que es todo lo que necesitas reconocer:

     ^      el principio            $      el final
     \d     un dígito               \D     algo que NO es dígito
     \s     un espacio              \w     letra, número o _
     .      cualquier carácter      \.     un punto de verdad (escapado)
     +      uno o más               *      cero o más
     ?      cero o uno              {2,4}  entre 2 y 4 veces
     [abc]  una de esas             [^a]   cualquiera menos a
     (a|b)  a o b

   Se leen de izquierda a derecha, como una frase:
     /^\d{8}$/   =   "empieza, 8 dígitos, termina"  ->  un DNI
############################################################################ */


/* ############################################################################
   21.6  USAR UNA REGEX: .test()
   ############################################################################
     /\d/.test('abc123');      // true    ¿aparece algún dígito?
     /^\d+$/.test('abc123');   // false   ¿son SOLO dígitos de punta a punta?

   `.test()` devuelve true o false. Es el 80% de lo que vas a usar.

   ⚠ La diferencia entre poner o no poner  ^  y  $  lo cambia todo:
        /\d+/.test('12a')      // true   (hay dígitos en algún lado)
        /^\d+$/.test('12a')    // false  (tiene que ser TODO dígitos)
############################################################################ */

// E8. true si el texto tiene SOLO dígitos (y al menos uno).
// soloDigitos('123') -> true ;  soloDigitos('12a') -> false ;  soloDigitos('') -> false
function soloDigitos(texto) {
  // TODO: /^\d+$/
}

// E9. true si parece un email.
// esEmail('a@b.com') -> true ;  esEmail('a@b') -> false
// Patrón:  /^[^\s@]+@[^\s@]+\.[^\s@]+$/
//          "algo sin espacios ni @, una @, otro algo, un punto, otro algo"
function esEmail(texto) {
  // TODO
}

/* SOLUCIONES 21.6 ------------------------------------------------------------
   E8   return /^\d+$/.test(texto);
   E9   return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(texto);
-------------------------------------------------------------------------- */


/* ############################################################################
   21.7  USAR UNA REGEX: .replace()
   ############################################################################
     'a-b-c'.replace('-', '_');        // 'a_b_c'?  NO: 'a_b-c'  (solo el primero)
     'a-b-c'.replace(/-/g, '_');       // 'a_b_c'   ✓ con la bandera g

   La `g` (global) va después de la última barra y significa "todas las veces".

   Las dos que vas a copiar siempre:
     texto.replace(/\D/g, '')              // deja solo dígitos
     texto.replace(/\s+/g, ' ').trim()     // un solo espacio entre palabras
############################################################################ */

// E10. Reemplaza todos los guiones por barras.
// aBarras('2026-03-15') -> '2026/03/15'
function aBarras(texto) {
  // TODO: acuérdate de la g
}

// E11. Quita todo lo que no sea dígito.
// soloNumeros('(511) 999-888') -> '511999888'
function soloNumeros(texto) {
  // TODO: /\D/g
}

// E12. Deja un solo espacio entre palabras y sin espacios en las puntas.
// normalizar('  hola   mundo  ') -> 'hola mundo'
function normalizar(texto) {
  // TODO
}

/* SOLUCIONES 21.7 ------------------------------------------------------------
   E10  return texto.replace(/-/g, '/');
   E11  return texto.replace(/\D/g, '');
   E12  return texto.replace(/\s+/g, ' ').trim();
-------------------------------------------------------------------------- */


/* ############################################################################
   21.8  Y A VECES NO HACE FALTA REGEX
   ############################################################################
   Antes de escribir un patrón, mira si hay un método que ya lo hace:

     texto.includes('hola')                         en vez de  /hola/.test(texto)
     texto.startsWith('http')                       en vez de  /^http/
     texto.endsWith('.pdf')                         en vez de  /\.pdf$/
     texto.toLowerCase().includes(x.toLowerCase())  para buscar sin mayúsculas

   Más corto, más legible, y no hay que descifrarlo después.
############################################################################ */

// E13. true si el texto contiene esa palabra, sin importar mayúsculas.
// contiene('Hola Mundo', 'mundo') -> true
function contiene(texto, palabra) {
  // TODO: sin regex, con toLowerCase e includes
}

/* SOLUCIONES 21.8 ------------------------------------------------------------
   E13  return texto.toLowerCase().includes(palabra.toLowerCase());
-------------------------------------------------------------------------- */


module.exports = {
  cuantosDistintos, unicos, comunes, alternarId,
  aMapa, buscarEnMapa, contarPalabras,
  soloDigitos, esEmail,
  aBarras, soloNumeros, normalizar,
  contiene,
};
