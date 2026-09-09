/* ============================================================
   TEMA 04 - Condicionales
   ------------------------------------------------------------
     if (condicion) { ... } else if (otra) { ... } else { ... }
     Operador ternario:  condicion ? valorSiSi : valorSiNo
   ============================================================ */

// EJERCICIO 1
// Devuelve true si la edad es 18 o mas.
// Ej: esMayorDeEdad(18) -> true
function esMayorDeEdad(edad) {
  //const pruebaTernario = edad >= 18 ? true : false;
  return edad >= 18;
}

// EJERCICIO 2
// Devuelve el mayor de tres numeros.
// Ej: mayorDeTres(3, 9, 5) -> 9
function mayorDeTres(a, b, c) {
  let numeroMayor;
  if (a > b) {
    numeroMayor = a;
  } else {
    numeroMayor = b;
  }
  if (numeroMayor < c) {
    numeroMayor = c;
  }
  return numeroMayor;
}

// EJERCICIO 3
// Devuelve "positivo", "negativo" o "cero" segun el numero.
// Ej: signo(-4) -> "negativo"
function signo(numero) {
  let signoNumero;
  if (numero > 0) {
    signoNumero = "positivo";
  } else if (numero < 0) {
    signoNumero = "negativo";
  } else {
    signoNumero = "cero";
  }

  return signoNumero;
}

// EJERCICIO 4
// Convierte una nota (0 a 100) en letra:
//   90 o mas -> "A"    80-89 -> "B"    70-79 -> "C"    60-69 -> "D"   menos de 60 -> "F"
// Ej: notaEnLetra(85) -> "B"
function notaEnLetra(nota) {
  let notaTexto;
  if (nota >= 90) {
    notaTexto = "A";
  } else if (nota >= 80) {
    notaTexto = "B";
  } else if (nota >= 70) {
    notaTexto = "C";
  } else if (nota >= 60) {
    notaTexto = "D";
  } else {
    notaTexto = "F";
  }

  return notaTexto;
}

// EJERCICIO 5
// Devuelve true si el anio es bisiesto.
// Regla: divisible entre 4, pero NO entre 100, salvo que tambien lo sea entre 400.
// Ej: esBisiesto(2024) -> true | esBisiesto(1900) -> false | esBisiesto(2000) -> true
function esBisiesto(anio) {
  return anio % 400 === 0 || (anio % 4 === 0 && !(anio % 100 === 0));
}

module.exports = { esMayorDeEdad, mayorDeTres, signo, notaEnLetra, esBisiesto };
