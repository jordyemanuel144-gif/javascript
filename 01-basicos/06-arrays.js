/* ============================================================
   TEMA 06 - Arrays (listas)
   ------------------------------------------------------------
     const lista = [1, 2, 3];
     lista.length            -> cuantos elementos
     lista.push(4)           -> agrega al final
     lista.map(n => n * 2)   -> transforma cada elemento
     lista.filter(n => n > 1)-> se queda con los que cumplen
     lista.reduce((acumulado, n) => acumulado + n, 0)  -> reduce a un solo valor
   Puedes resolverlos con bucles for si prefieres empezar por ahi.
   ============================================================ */

// EJERCICIO 1
// Devuelve un NUEVO array con cada numero multiplicado por 2.
// Ej: duplicarTodos([1, 2, 3]) -> [2, 4, 6]
function duplicarTodos(numeros) {
  const arrayNuevo = numeros.map((n) => n * 2);
  return arrayNuevo;
}

// EJERCICIO 2
// Devuelve solo los numeros pares.
// Ej: soloPares([1, 2, 3, 4]) -> [2, 4]
function soloPares(numeros) {
  const arrayNuevo = numeros.filter((n) => n % 2 === 0);
  return arrayNuevo;
}

// EJERCICIO 3
// Suma todos los numeros del array. Si esta vacio, devuelve 0.
// Ej: sumarTodos([1, 2, 3]) -> 6
function sumarTodos(numeros) {
  let sumatoria = 0;
  for (let i = 0; i < numeros.length; i++) {
    sumatoria = sumatoria + numeros[i];
  }
  return sumatoria;
}

// EJERCICIO 4
// Devuelve el numero mas grande del array. Si esta vacio, devuelve null.
// Ej: maximo([3, 9, 4]) -> 9
function maximo(numeros) {
  let numeroMayor = numeros[0];
  for (let i = 1; i < numeros.length; i++) {
    if (numeroMayor < numeros[i]) {
      numeroMayor = numeros[i];
    }
  }
  return numeroMayor;
}

// EJERCICIO 5
// Cuenta cuantas palabras tiene una frase (separadas por espacios).
// Ej: contarPalabras("hola mundo cruel") -> 3
function contarPalabras(frase) {
  let cantidadPalabras = 0;
  //considerando que no tiene espacios iniciales, finales y que solo se separan por un espacio
  for (let i = 0; i < frase.length; i++) {
    if (" ".includes(frase.charAt(i))) {
      cantidadPalabras++;
    }
  }
  return cantidadPalabras;
}

module.exports = {
  duplicarTodos,
  soloPares,
  sumarTodos,
  maximo,
  contarPalabras,
};
