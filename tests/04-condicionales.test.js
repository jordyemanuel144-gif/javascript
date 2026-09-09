const { grupo, prueba, esperar } = require('../lib/mini-test');
const { esMayorDeEdad, mayorDeTres, signo, notaEnLetra, esBisiesto } = require('../01-basicos/04-condicionales');

grupo('TEMA 04 - Condicionales', () => {
  prueba('esMayorDeEdad(18) -> true', () => esperar(esMayorDeEdad(18)).aSer(true));
  prueba('esMayorDeEdad(12) -> false', () => esperar(esMayorDeEdad(12)).aSer(false));
  prueba('mayorDeTres(3, 9, 5) -> 9', () => esperar(mayorDeTres(3, 9, 5)).aSer(9));
  prueba('mayorDeTres(10, 2, 4) -> 10', () => esperar(mayorDeTres(10, 2, 4)).aSer(10));
  prueba('mayorDeTres(1, 2, 8) -> 8', () => esperar(mayorDeTres(1, 2, 8)).aSer(8));
  prueba('signo(-4) -> negativo', () => esperar(signo(-4)).aSer('negativo'));
  prueba('signo(0) -> cero', () => esperar(signo(0)).aSer('cero'));
  prueba('signo(7) -> positivo', () => esperar(signo(7)).aSer('positivo'));
  prueba('notaEnLetra(95) -> A', () => esperar(notaEnLetra(95)).aSer('A'));
  prueba('notaEnLetra(85) -> B', () => esperar(notaEnLetra(85)).aSer('B'));
  prueba('notaEnLetra(75) -> C', () => esperar(notaEnLetra(75)).aSer('C'));
  prueba('notaEnLetra(70) -> C', () => esperar(notaEnLetra(70)).aSer('C'));
  prueba('notaEnLetra(60) -> D', () => esperar(notaEnLetra(60)).aSer('D'));
  prueba('notaEnLetra(30) -> F', () => esperar(notaEnLetra(30)).aSer('F'));
  prueba('esBisiesto(2024) -> true', () => esperar(esBisiesto(2024)).aSer(true));
  prueba('esBisiesto(2023) -> false', () => esperar(esBisiesto(2023)).aSer(false));
  prueba('esBisiesto(1900) -> false', () => esperar(esBisiesto(1900)).aSer(false));
  prueba('esBisiesto(2000) -> true', () => esperar(esBisiesto(2000)).aSer(true));
});
