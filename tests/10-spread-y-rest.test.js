const { grupo, prueba, esperar, usar } = require('../lib/mini-test');
const m = require('../02-sintaxis/10-spread-y-rest');

grupo('TEMA 10 - Spread y rest', () => {
  prueba('copiar([1, 2]) -> [1, 2]', () => esperar(usar(m.copiar)([1, 2])).aSer([1, 2]));
  prueba('copiar devuelve OTRO array, no el mismo', () => {
    const original = [1, 2];
    esperar(usar(m.copiar)(original)).cumple(r => r !== original, 'debe ser un array nuevo');
  });
  prueba('agregar([1, 2], 3) -> [1, 2, 3]', () => esperar(m.agregar([1, 2], 3)).aSer([1, 2, 3]));
  prueba('agregar NO modifica el original', () => {
    const original = [1, 2];
    m.agregar(original, 3);
    esperar(original).aSer([1, 2]);
  });
  prueba('unir([1, 2], [3, 4]) -> [1, 2, 3, 4]', () => esperar(m.unir([1, 2], [3, 4])).aSer([1, 2, 3, 4]));
  prueba('cumplirAnios sube la edad en 1', () => esperar(m.cumplirAnios({ nombre: 'Ana', edad: 30 })).aSer({ nombre: 'Ana', edad: 31 }));
  prueba('cumplirAnios NO modifica el original', () => {
    const original = { nombre: 'Ana', edad: 30 };
    m.cumplirAnios(original);
    esperar(original.edad).aSer(30);
  });
  prueba('combinar({a:1,b:2}, {b:9}) -> {a:1,b:9}', () => esperar(m.combinar({ a: 1, b: 2 }, { b: 9 })).aSer({ a: 1, b: 9 }));
  prueba('cuantos(1, 2, 3) -> 3', () => esperar(m.cuantos(1, 2, 3)).aSer(3));
  prueba('cuantos() -> 0', () => esperar(m.cuantos()).aSer(0));
});
