const { grupo, prueba, esperar } = require('../lib/mini-test');
const { sumarHasta, tablaDeMultiplicar, contarVocales, factorial, fizzBuzz } = require('../01-basicos/05-bucles');

grupo('TEMA 05 - Bucles', () => {
  prueba('sumarHasta(5) -> 15', () => esperar(sumarHasta(5)).aSer(15));
  prueba('sumarHasta(1) -> 1', () => esperar(sumarHasta(1)).aSer(1));
  prueba('sumarHasta(100) -> 5050', () => esperar(sumarHasta(100)).aSer(5050));
  prueba('tablaDeMultiplicar(3)', () => esperar(tablaDeMultiplicar(3)).aSer([3, 6, 9, 12, 15, 18, 21, 24, 27, 30]));
  prueba('tablaDeMultiplicar(1)', () => esperar(tablaDeMultiplicar(1)).aSer([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]));
  prueba('contarVocales(javascript) -> 3', () => esperar(contarVocales('javascript')).aSer(3));
  prueba('contarVocales(murcielago) -> 5', () => esperar(contarVocales('murcielago')).aSer(5));
  prueba('contarVocales(xyz) -> 0', () => esperar(contarVocales('xyz')).aSer(0));
  prueba('factorial(5) -> 120', () => esperar(factorial(5)).aSer(120));
  prueba('factorial(0) -> 1', () => esperar(factorial(0)).aSer(1));
  prueba('fizzBuzz(5)', () => esperar(fizzBuzz(5)).aSer([1, 2, 'Fizz', 4, 'Buzz']));
  prueba('fizzBuzz(15) termina en FizzBuzz', () => esperar(fizzBuzz(15)).aSer([1, 2, 'Fizz', 4, 'Buzz', 'Fizz', 7, 8, 'Fizz', 'Buzz', 11, 'Fizz', 13, 14, 'FizzBuzz']));
});
