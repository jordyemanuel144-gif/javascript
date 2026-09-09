/* ============================================================
   TEMA 09 - Desestructuracion  <- ESTO ES "PROPS"
   ------------------------------------------------------------
   Sacar propiedades de un objeto a variables sueltas:

     const persona = { nombre: "Ana", edad: 30 };

     const nombre = persona.nombre;      // la forma larga
     const { nombre } = persona;         // desestructurando

   Varias a la vez:
     const { nombre, edad } = persona;

   Renombrar (la propiedad "nombre" pasa a llamarse "n"):
     const { nombre: n } = persona;

   Valor por defecto si la propiedad no existe:
     const { pais = "Peru" } = persona;

   EN LOS PARAMETROS de una funcion (aqui es donde lo veras en React):
     function Saludo({ nombre }) { ... }
     Saludo({ nombre: "Ana", edad: 30 });   // recibe el objeto, usa solo nombre

   Tambien funciona con arrays, pero por POSICION:
     const [primero, segundo] = [10, 20];
   ============================================================ */

// EJERCICIO 1
// Saca nombre y edad del objeto con desestructuracion y devuelve un texto.
// Ej: presentar({ nombre: "Ana", edad: 30 }) -> "Ana tiene 30"
function presentar(persona) {
  // TODO: usa  const { nombre, edad } = persona;  y un template literal
  return undefined;
}

// EJERCICIO 2
// Lo mismo, pero desestructurando EN EL PARAMETRO.
// Fijate que la funcion sigue recibiendo un objeto completo.
// presentarCorto({ nombre: "Luis", edad: 25 }) -> "Luis tiene 25"
function presentarCorto(/* TODO: desestructura aqui */) {
  return undefined;
}

// EJERCICIO 3
// Desestructura con RENOMBRE: saca "titulo" pero llamalo "t".
// Devuelve t en mayusculas.
// tituloEnMayusculas({ titulo: "hola" }) -> "HOLA"
function tituloEnMayusculas(articulo) {
  // TODO
  return undefined;
}

// EJERCICIO 4
// Desestructura "color" con valor por defecto "azul".
// colorDe({ color: "rojo" }) -> "rojo"
// colorDe({})               -> "azul"
function colorDe(opciones) {
  // TODO
  return undefined;
}

// EJERCICIO 5
// Desestructuracion de ARRAY: devuelve el primer y el tercer elemento
// juntos en un texto separados por un guion.
// primeroYTercero(["a", "b", "c"]) -> "a-c"
// Pista: para saltarte una posicion, dejas el hueco vacio: const [x, , z] = ...
function primeroYTercero(lista) {
  // TODO
  return undefined;
}

// EJERCICIO 6
// Esto es literalmente un componente de React sin el JSX.
// Recibe un objeto de props y devuelve un texto.
// Desestructura en el parametro: texto, y color con defecto "gris".
// Boton({ texto: "Enviar", color: "verde" }) -> "[verde] Enviar"
// Boton({ texto: "Enviar" })                 -> "[gris] Enviar"
function Boton(/* TODO */) {
  return undefined;
}

module.exports = { presentar, presentarCorto, tituloEnMayusculas, colorDe, primeroYTercero, Boton };
