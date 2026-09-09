/* ============================================================
   TEMA 01 - Variables y tipos de datos
   ------------------------------------------------------------
   Recuerda:
     let  -> variable que puede cambiar de valor
     const -> variable que NO se reasigna (usa esta por defecto)
     Tipos basicos: string "texto", number 42, boolean true/false
     typeof valor  -> te dice el tipo
   Completa cada funcion donde dice TODO y borra el "return undefined".
   ============================================================ */

// EJERCICIO 1
// Devuelve tu nombre como texto (string).
// Ej: miNombre() -> "Jordy"
function miNombre() {
  // TODO
  let miNombre = "Jordy";
  return miNombre;
}

// EJERCICIO 2
// Recibe un numero y devuelve su doble.
// Ej: doble(7) -> 14
function doble(numero) {
  let doble = numero * 2;
  return doble;
}

// EJERCICIO 3
// Devuelve el TIPO del valor recibido, como texto.
// Pista: el operador typeof.
// Ej: tipoDe("hola") -> "string"   |   tipoDe(5) -> "number"
function tipoDe(valor) {
  // TODO
  return typeof valor;
}

// EJERCICIO 4
// Recibe un texto que contiene un numero y devuelve el numero de verdad.
// Pista: Number(texto)
// Ej: aNumero("42") -> 42   (el numero, no el texto)
function aNumero(texto) {
  // TODO
  let numero = Number(texto);
  return numero;
}

module.exports = { miNombre, doble, tipoDe, aNumero };
