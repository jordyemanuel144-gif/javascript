/* ============================================================
   TEMA 02 - Operadores
   ------------------------------------------------------------
   Aritmeticos:  +  -  *  /  %  (resto de la division)  ** (potencia)
   Comparacion:  ===  !==  >  <  >=  <=
   Logicos:      &&  (y)    ||  (o)    !  (no)
   ============================================================ */

// EJERCICIO 1
// Calcula el area de un rectangulo (base * altura).
// Ej: areaRectangulo(4, 5) -> 20
function areaRectangulo(base, altura) {
  // TODO
  let area = base * altura;
  return area;
}

// EJERCICIO 2
// Devuelve true si el numero es par, false si es impar.
// Pista: un numero es par cuando el resto de dividirlo entre 2 es 0.
// Ej: esPar(4) -> true   |   esPar(7) -> false
function esPar(numero) {
  return numero % 2 === 0;
}

// EJERCICIO 3
// Devuelve el promedio de tres numeros.
// Ej: promedio(3, 4, 5) -> 4
function promedio(a, b, c) {
  const resultado = (a + b + c) / 3;

  return resultado;
}

// EJERCICIO 4
// Devuelve el precio final sumandole el porcentaje de impuesto.
// Ej: precioFinal(100, 16) -> 116
function precioFinal(precio, porcentajeImpuesto) {
  return precio + precio * (porcentajeImpuesto / 100);
}

// EJERCICIO 5
// Devuelve true solo si la edad esta entre 18 y 65 (ambos incluidos).
// Ej: enEdadLaboral(30) -> true   |   enEdadLaboral(70) -> false
function enEdadLaboral(edad) {
  return 18 <= edad && 65 >= edad;
}

module.exports = {
  areaRectangulo,
  esPar,
  promedio,
  precioFinal,
  enEdadLaboral,
};
