/* ============================================================
   TEMA 08 - Objetos
   ------------------------------------------------------------
   Un objeto agrupa datos con nombre:

     const persona = { nombre: "Ana", edad: 30 };

   Leer:
     persona.nombre        // con punto, cuando sabes el nombre
     persona["nombre"]     // con corchetes, mismo resultado
     persona[campo]        // con corchetes, cuando el nombre esta en una variable

   Escribir / agregar:
     persona.pais = "Peru";

   Atajo (shorthand): si la variable se llama igual que la propiedad,
   no repitas:
     const nombre = "Ana";
     const p = { nombre };        // equivale a { nombre: nombre }

   Utiles:
     Object.keys(obj)     -> array con los nombres de las propiedades
     Object.values(obj)   -> array con los valores
   ============================================================ */

// EJERCICIO 1
// Devuelve un objeto con las propiedades nombre y edad, usando los
// parametros recibidos. Escribelo SIN shorthand (nombre: nombre).
// hacerPersona("Ana", 30) -> { nombre: "Ana", edad: 30 }
function hacerPersona(nombre, edad) {
  // TODO
  return undefined;
}

// EJERCICIO 2
// Lo mismo, pero usando el shorthand.
// hacerPersonaCorto("Luis", 25) -> { nombre: "Luis", edad: 25 }
function hacerPersonaCorto(nombre, edad) {
  // TODO
  return undefined;
}

// EJERCICIO 3
// Devuelve el valor de la propiedad "ciudad" del objeto recibido.
// leerCiudad({ ciudad: "Lima" }) -> "Lima"
function leerCiudad(persona) {
  // TODO
  return undefined;
}

// EJERCICIO 4
// El nombre de la propiedad llega como texto en una variable.
// Aqui el punto NO sirve: usa corchetes.
// leerCampo({ edad: 30 }, "edad") -> 30
function leerCampo(objeto, campo) {
  // TODO
  return undefined;
}

// EJERCICIO 5
// Agrega la propiedad "activo" con valor true al objeto y devuelvelo.
// activar({ nombre: "Ana" }) -> { nombre: "Ana", activo: true }
function activar(usuario) {
  // TODO
  return undefined;
}

// EJERCICIO 6
// Devuelve un array con los NOMBRES de las propiedades del objeto.
// nombresDeCampos({ a: 1, b: 2 }) -> ["a", "b"]
function nombresDeCampos(objeto) {
  // TODO
  return undefined;
}

module.exports = { hacerPersona, hacerPersonaCorto, leerCiudad, leerCampo, activar, nombresDeCampos };
