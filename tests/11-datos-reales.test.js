const { grupo, prueba, esperar } = require('../lib/mini-test');
const m = require('../02-sintaxis/11-datos-reales');

const usuarios = [
  { id: 1, nombre: 'Ana', edad: 30, activo: true },
  { id: 2, nombre: 'Luis', edad: 25, activo: false },
  { id: 3, nombre: 'Sara', edad: 41, activo: true },
];

grupo('TEMA 11 - Arrays de objetos', () => {
  prueba('soloNombres -> [Ana, Luis, Sara]', () => esperar(m.soloNombres(usuarios)).aSer(['Ana', 'Luis', 'Sara']));
  prueba('soloNombres([]) -> []', () => esperar(m.soloNombres([])).aSer([]));
  prueba('soloActivos devuelve 2 usuarios', () => esperar(m.soloActivos(usuarios)).aSer([usuarios[0], usuarios[2]]));
  prueba('buscarPorId(2) -> Luis', () => esperar(m.buscarPorId(usuarios, 2)).aSer(usuarios[1]));
  prueba('buscarPorId(99) -> undefined', () => {
    esperar(m.buscarPorId(usuarios, 99) === undefined).cumple(v => v === true, 'find devuelve undefined si no encuentra');
  });
  prueba('hayMayoresDe(40) -> true', () => esperar(m.hayMayoresDe(usuarios, 40)).aSer(true));
  prueba('hayMayoresDe(50) -> false', () => esperar(m.hayMayoresDe(usuarios, 50)).aSer(false));
  prueba('comoTexto -> [Ana (30), ...]', () => esperar(m.comoTexto(usuarios)).aSer(['Ana (30)', 'Luis (25)', 'Sara (41)']));
  prueba('nombresDeActivos -> [Ana, Sara]', () => esperar(m.nombresDeActivos(usuarios)).aSer(['Ana', 'Sara']));
});
