const { grupo, prueba, esperar } = require('../lib/mini-test');
const { duplicarTodos, soloPares, sumarTodos, maximo, contarPalabras } = require('../01-basicos/06-arrays');

grupo('TEMA 06 - Arrays', () => {
  prueba('duplicarTodos([1, 2, 3]) -> [2, 4, 6]', () => esperar(duplicarTodos([1, 2, 3])).aSer([2, 4, 6]));
  prueba('duplicarTodos([]) -> []', () => esperar(duplicarTodos([])).aSer([]));
  prueba('soloPares([1, 2, 3, 4]) -> [2, 4]', () => esperar(soloPares([1, 2, 3, 4])).aSer([2, 4]));
  prueba('soloPares([1, 3, 5]) -> []', () => esperar(soloPares([1, 3, 5])).aSer([]));
  prueba('sumarTodos([1, 2, 3]) -> 6', () => esperar(sumarTodos([1, 2, 3])).aSer(6));
  prueba('sumarTodos([]) -> 0', () => esperar(sumarTodos([])).aSer(0));
  prueba('maximo([3, 9, 4]) -> 9', () => esperar(maximo([3, 9, 4])).aSer(9));
  prueba('maximo([-5, -1, -9]) -> -1', () => esperar(maximo([-5, -1, -9])).aSer(-1));
  prueba('maximo([]) -> null', () => esperar(maximo([])).cumple(v => v === null, 'debe devolver null'));
  prueba('contarPalabras(hola mundo cruel) -> 3', () => esperar(contarPalabras('hola mundo cruel')).aSer(3));
  prueba('contarPalabras(uno) -> 1', () => esperar(contarPalabras('uno')).aSer(1));
});
