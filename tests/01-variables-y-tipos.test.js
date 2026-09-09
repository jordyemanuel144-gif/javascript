const { grupo, prueba, esperar } = require('../lib/mini-test');
const { miNombre, doble, tipoDe, aNumero } = require('../01-basicos/01-variables-y-tipos');

grupo('TEMA 01 - Variables y tipos', () => {
  prueba('miNombre() devuelve un texto no vacio', () => {
    esperar(miNombre()).cumple(v => typeof v === 'string' && v.length > 0, 'debe ser un string con tu nombre');
  });
  prueba('doble(7) -> 14', () => esperar(doble(7)).aSer(14));
  prueba('doble(0) -> 0', () => esperar(doble(0)).aSer(0));
  prueba('tipoDe("hola") -> string', () => esperar(tipoDe('hola')).aSer('string'));
  prueba('tipoDe(5) -> number', () => esperar(tipoDe(5)).aSer('number'));
  prueba('tipoDe(true) -> boolean', () => esperar(tipoDe(true)).aSer('boolean'));
  prueba('aNumero("42") -> 42', () => esperar(aNumero('42')).aSer(42));
  prueba('aNumero("3.5") -> 3.5', () => esperar(aNumero('3.5')).aSer(3.5));
});
