const { grupo, prueba, esperar } = require('../lib/mini-test');
const { saludar, enMayusculas, contarCaracteres, invertir, capitalizar } = require('../01-basicos/03-strings');

grupo('TEMA 03 - Strings', () => {
  prueba('saludar(Ana) -> Hola, Ana!', () => esperar(saludar('Ana')).aSer('Hola, Ana!'));
  prueba('saludar(Luis) -> Hola, Luis!', () => esperar(saludar('Luis')).aSer('Hola, Luis!'));
  prueba('enMayusculas(hola) -> HOLA', () => esperar(enMayusculas('hola')).aSer('HOLA'));
  prueba('contarCaracteres(hola) -> 4', () => esperar(contarCaracteres('hola')).aSer(4));
  prueba('contarCaracteres(cadena vacia) -> 0', () => esperar(contarCaracteres('')).aSer(0));
  prueba('invertir(hola) -> aloh', () => esperar(invertir('hola')).aSer('aloh'));
  prueba('invertir(javascript) -> tpircsavaj', () => esperar(invertir('javascript')).aSer('tpircsavaj'));
  prueba('capitalizar(hola mundo) -> Hola mundo', () => esperar(capitalizar('hola mundo')).aSer('Hola mundo'));
  prueba('capitalizar(js) -> Js', () => esperar(capitalizar('js')).aSer('Js'));
});
