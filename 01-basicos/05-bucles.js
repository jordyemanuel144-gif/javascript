/* ============================================================
   TEMA 05 - Bucles
   ------------------------------------------------------------
     for (let i = 0; i < 10; i++) { ... }
     while (condicion) { ... }
     Para acumular:  let total = 0;  total += i;
     Para ir llenando una lista:  const lista = [];  lista.push(valor);
   ============================================================ */

// EJERCICIO 1
// Suma todos los numeros del 1 hasta n (incluido).
// Ej: sumarHasta(5) -> 15   (1+2+3+4+5)
function sumarHasta(n) {
  let suma = 0;
  for (let i = 1; i <= n; i++) {
    suma = suma + i;
  }
  return suma;
}

// EJERCICIO 2
// Devuelve un array con la tabla de multiplicar de n, del 1 al 10.
// Ej: tablaDeMultiplicar(3) -> [3, 6, 9, 12, 15, 18, 21, 24, 27, 30]
function tablaDeMultiplicar(n) {
  const lista = [];
  for (let i = 1; i <= 10; i++) {
    lista.push(i * n);
  }
  return lista;
}

// EJERCICIO 3
// Cuenta cuantas vocales (a, e, i, o, u) hay en el texto. Todo llega en minusculas.
// Ej: contarVocales("javascript") -> 3
function contarVocales(texto) {
  let cantidadVocales = 0;
  for (let i = 0; i < texto.length; i++) {
    let letra = texto.charAt(i);
    if ("aeiou".includes(letra)) {
      cantidadVocales++;
    }
  }
  return cantidadVocales;
}

// EJERCICIO 4
// Calcula el factorial de n (n * n-1 * ... * 1). El factorial de 0 es 1.
// Ej: factorial(5) -> 120
function factorial(n) {
  let resultadoFactorial = 1;
  for (let i = 2; i <= n; i++) {
    resultadoFactorial = resultadoFactorial * i;
  }
  return resultadoFactorial;
}

// EJERCICIO 5
// Devuelve un array del 1 a n donde:
//   multiplos de 3      -> "Fizz"
//   multiplos de 5      -> "Buzz"
//   multiplos de 3 y 5  -> "FizzBuzz"
//   el resto            -> el numero (como numero, no texto)
// Ej: fizzBuzz(5) -> [1, 2, "Fizz", 4, "Buzz"]
function fizzBuzz(n) {
  const array = [];
  for (let i = 1; i <= n; i++) {
    if (i % 3 === 0 && i % 5 === 0) {
      array.push("FizzBuzz");
    } else if (i % 3 === 0) {
      array.push("Fizz");
    } else if (i % 5 === 0) {
      array.push("Buzz");
    } else {
      array.push(i);
    }
  }
  return array;
}

module.exports = {
  sumarHasta,
  tablaDeMultiplicar,
  contarVocales,
  factorial,
  fizzBuzz,
};
