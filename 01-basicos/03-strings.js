/* ============================================================
   TEMA 03 - Textos (strings)
   ------------------------------------------------------------
   Utiles:
     texto.length              -> cuantos caracteres tiene
     texto.toUpperCase()       -> TODO EN MAYUSCULAS
     texto.toLowerCase()       -> todo en minusculas
     texto[0]  o  texto.charAt(0)  -> primer caracter
     texto.slice(1)            -> desde la posicion 1 hasta el final
     texto.split("")           -> convierte el texto en un array de letras
     Template literal: `Hola, ${nombre}!`   (comillas invertidas)
   ============================================================ */

// EJERCICIO 1
// Devuelve un saludo usando template literals.
// Ej: saludar("Ana") -> "Hola, Ana!"
function saludar(nombre) {
  // TODO
  const saludo = `Hola, ${nombre}!`;
  return saludo;
}

// EJERCICIO 2
// Devuelve el texto completo en mayusculas.
// Ej: enMayusculas("hola") -> "HOLA"
function enMayusculas(texto) {
  return texto.toUpperCase();
}

// EJERCICIO 3
// Devuelve cuantos caracteres tiene el texto.
// Ej: contarCaracteres("hola") -> 4
function contarCaracteres(texto) {
  return texto.length;
}

// EJERCICIO 4
// Devuelve el texto al reves.
// Pista: split("") + reverse() + join("")
// Ej: invertir("hola") -> "aloh"
function invertir(texto) {
  return texto.split("").reverse().join("");
}

// EJERCICIO 5
// Devuelve el texto con la primera letra en mayuscula y el resto igual.
// Ej: capitalizar("hola mundo") -> "Hola mundo"
function capitalizar(texto) {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

module.exports = {
  saludar,
  enMayusculas,
  contarCaracteres,
  invertir,
  capitalizar,
};
