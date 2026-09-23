/* ============================================================
   TEMA 10 - Spread y rest  (los tres puntos ...)
   ------------------------------------------------------------
   Los mismos tres puntos hacen DOS cosas segun donde esten:

   SPREAD = desparramar, sacar el contenido
     const a = [1, 2];
     const b = [...a, 3];              // [1, 2, 3]
     const o = { ...persona, edad: 31 } // copia persona y pisa edad

   REST = recoger lo que sobra en un array
     function sumarTodos(...numeros) { }   // numeros llega como array
     const [primero, ...resto] = [1, 2, 3]; // resto = [2, 3]

   Regla para distinguir: si esta a la IZQUIERDA del = o en los
   parametros, es rest (recoge). Si esta a la DERECHA o dentro de
   un array/objeto que estas creando, es spread (desparrama).

   Esto es la base de React: nunca modificas el objeto original,
   creas uno NUEVO con los cambios.
   ============================================================ */

// EJERCICIO 1
// Devuelve una COPIA del array (no el mismo array).
// copiar([1, 2]) -> [1, 2]  pero es otro array distinto
const copiar = (array) => [...array]; // TODO: hazlo como funcion flecha corta

// EJERCICIO 2
// Devuelve un array nuevo con el elemento agregado al final,
// SIN usar push y sin modificar el original.
// agregar([1, 2], 3) -> [1, 2, 3]
function agregar(lista, elemento) {
  return [...lista, elemento];
}

// EJERCICIO 3
// Une dos arrays en uno nuevo.
// unir([1, 2], [3, 4]) -> [1, 2, 3, 4]
function unir(a, b) {
  return [...a, ...b];
}

// EJERCICIO 4
// Devuelve una copia del objeto con la edad cambiada,
// sin modificar el original. (Asi se actualiza estado en React.)
// cumplirAnios({ nombre: "Ana", edad: 30 }) -> { nombre: "Ana", edad: 31 }
function cumplirAnios(persona) {
  return {...persona, edad: (persona.edad + 1)};
}

// EJERCICIO 5
// Combina dos objetos. Si una propiedad esta en los dos,
// gana la del segundo.
// combinar({ a: 1, b: 2 }, { b: 9 }) -> { a: 1, b: 9 }
function combinar(base, cambios) {
  return {...base, ...cambios};
}

// EJERCICIO 6
// REST en parametros: recibe cualquier cantidad de numeros y
// devuelve cuantos llegaron.
// cuantos(1, 2, 3) -> 3   |   cuantos() -> 0
function cuantos(...parametros) {
  return parametros.length;
}

module.exports = { copiar, agregar, unir, cumplirAnios, combinar, cuantos };
