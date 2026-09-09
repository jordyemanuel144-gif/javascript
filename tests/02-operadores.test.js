const { grupo, prueba, esperar } = require('../lib/mini-test');
const { areaRectangulo, esPar, promedio, precioFinal, enEdadLaboral } = require('../01-basicos/02-operadores');

grupo('TEMA 02 - Operadores', () => {
  prueba('areaRectangulo(4, 5) -> 20', () => esperar(areaRectangulo(4, 5)).aSer(20));
  prueba('areaRectangulo(2.5, 4) -> 10', () => esperar(areaRectangulo(2.5, 4)).aSer(10));
  prueba('esPar(4) -> true', () => esperar(esPar(4)).aSer(true));
  prueba('esPar(7) -> false', () => esperar(esPar(7)).aSer(false));
  prueba('esPar(0) -> true', () => esperar(esPar(0)).aSer(true));
  prueba('promedio(3, 4, 5) -> 4', () => esperar(promedio(3, 4, 5)).aSer(4));
  prueba('promedio(10, 20, 30) -> 20', () => esperar(promedio(10, 20, 30)).aSer(20));
  prueba('precioFinal(100, 16) -> 116', () => esperar(precioFinal(100, 16)).aSer(116));
  prueba('precioFinal(50, 10) -> 55', () => esperar(precioFinal(50, 10)).aSer(55));
  prueba('enEdadLaboral(30) -> true', () => esperar(enEdadLaboral(30)).aSer(true));
  prueba('enEdadLaboral(17) -> false', () => esperar(enEdadLaboral(17)).aSer(false));
  prueba('enEdadLaboral(65) -> true', () => esperar(enEdadLaboral(65)).aSer(true));
});
