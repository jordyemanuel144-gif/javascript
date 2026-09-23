/* ============================================================
   TEMA 11 - Arrays de objetos
   ------------------------------------------------------------
   Asi llegan los datos de verdad, siempre. De una API, de una
   base de datos, de un archivo JSON:

     const usuarios = [
       { id: 1, nombre: "Ana",  edad: 30, activo: true  },
       { id: 2, nombre: "Luis", edad: 25, activo: false },
     ];

   Metodos que usaras a diario sobre estos datos:
     .map(u => u.nombre)              -> ["Ana", "Luis"]
     .filter(u => u.activo)           -> solo los activos
     .find(u => u.id === 2)           -> el PRIMERO que cumpla (un objeto, no array)
     .some(u => u.edad > 28)          -> true/false, hay alguno?
     .every(u => u.activo)            -> true/false, todos cumplen?

   Fijate: dentro de la flecha, "u" es cada objeto del array, y a
   sus campos entras con punto.
   ============================================================ */

// EJERCICIO 1
// Devuelve un array solo con los nombres.
// soloNombres([{nombre:"Ana"},{nombre:"Luis"}]) -> ["Ana", "Luis"]
function soloNombres(usuarios) {
  // TODO
  return usuarios.map(u => u.nombre);
}

// EJERCICIO 2
// Devuelve solo los usuarios cuyo campo activo sea true.
// (No hace falta escribir === true; el campo YA es booleano.)
function soloActivos(usuarios) {
  return usuarios.filter(u => u.activo);
}

// EJERCICIO 3
// Devuelve el usuario cuyo id coincida. Si no existe, find
// devuelve undefined solo, no tienes que hacer nada extra.
// buscarPorId([{id:1},{id:2}], 2) -> {id:2}
function buscarPorId(usuarios, id) {
  return usuarios.find(u => u.id === id);
}

// EJERCICIO 4
// Devuelve true si HAY al menos un usuario mayor de la edad dada.
// hayMayoresDe([{edad:20},{edad:40}], 30) -> true
function hayMayoresDe(usuarios, edad) {
  return usuarios.some(u => u.edad > edad);
}
// EJERCICIO 5
// Desestructura DENTRO de la flecha del map y devuelve textos.
// Ej: [{nombre:"Ana", edad:30}] -> ["Ana (30)"]
// Pista: usuarios.map(({ nombre, edad }) => ...)
function comoTexto(usuarios) {
  return usuarios.map(({nombre, edad}) => `${nombre} (${edad})`);
}

// EJERCICIO 6
// Encadena dos metodos: primero filtra los activos, luego saca
// sus nombres. Se escribe uno detras del otro con puntos.
// nombresDeActivos([{nombre:"Ana",activo:true},{nombre:"Luis",activo:false}]) -> ["Ana"]
function nombresDeActivos(usuarios) {
  return usuarios.filter(u => u.activo).map(u => u.nombre);
// si quisiera devolver objetos sería asi: 
//return usuarios.filter(u => u.activo).map(u => {return ({nombre: u.nombre, activo: u.activo})});
}

module.exports = { soloNombres, soloActivos, buscarPorId, hayMayoresDe, comoTexto, nombresDeActivos };
