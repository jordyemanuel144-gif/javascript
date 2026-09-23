const { grupo, prueba, esperar, pendiente } = require('../lib/mini-test');
const m = require('../03-js-a-fondo/20-json-fechas-numeros');

const F = new Date('2026-03-15T00:00:00');      // 15 de marzo de 2026, hora local

grupo('TEMA 20 - JSON, fechas y numeros', () => {
  // 20.1
  prueba('E1  aTexto({a:1})', () => esperar(m.aTexto({ a: 1 })).aSer('{"a":1}'));
  prueba('E2  bonito({a:1}) con 2 espacios', () => esperar(m.bonito({ a: 1 })).aSer('{\n  "a": 1\n}'));

  // 20.2
  prueba('E3  aObjeto(json valido)', () => esperar(m.aObjeto('{"a":1}')).aSer({ a: 1 }));
  prueba('E3  aObjeto(roto) -> null', () => esperar(m.aObjeto('roto')).aSer(null));
  prueba('E4  copiaJson separa lo anidado', () => {
    const o = { dir: { ciudad: 'Lima' } };
    const c = m.copiaJson(o);
    if (c === undefined) pendiente();
    c.dir.ciudad = 'Cusco';
    esperar(o.dir.ciudad).aSer('Lima');
  });

  // 20.3
  prueba('E5  anio -> 2026', () => esperar(m.anio(F)).aSer(2026));
  prueba('E6  mesHumano -> 3 (no 2)', () => esperar(m.mesHumano(F)).aSer(3));

  // 20.4
  prueba('E7  aInputDate -> 2026-03-15', () => esperar(m.aInputDate(new Date('2026-03-15T00:00:00Z'))).aSer('2026-03-15'));
  prueba('E8  formatoCorto -> 15/03/2026', () => esperar(m.formatoCorto(F)).aSer('15/03/2026'));
  prueba('E8  formatoCorto rellena con cero -> 05/01/2026', () => esperar(m.formatoCorto(new Date('2026-01-05T00:00:00'))).aSer('05/01/2026'));

  // 20.5
  prueba('E9  diasEntre 1 y 11 de marzo -> 10', () => esperar(m.diasEntre(new Date('2026-03-01'), new Date('2026-03-11'))).aSer(10));
  prueba('E10 mismaFecha -> true', () => esperar(m.mismaFecha(new Date('2026-01-01'), new Date('2026-01-01'))).aSer(true));
  prueba('E10 mismaFecha distinta -> false', () => esperar(m.mismaFecha(new Date('2026-01-01'), new Date('2026-01-02'))).aSer(false));

  // 20.6
  prueba('E11 aNumero(12.5) -> 12.5', () => esperar(m.aNumero('12.5')).aSer(12.5));
  prueba('E11 aNumero(abc) -> 0', () => esperar(m.aNumero('abc')).aSer(0));

  // 20.7
  prueba('E12 redondear2(1234.567) -> 1234.57', () => esperar(m.redondear2(1234.567)).aSer(1234.57));
  prueba('E12 redondear2 devuelve NUMERO, no texto', () => {
    if (m.redondear2(1.005) === undefined) pendiente();
    esperar(typeof m.redondear2(1.005)).aSer('number');
  });
  prueba('E13 porcentaje(1, 3) -> 33.3%', () => esperar(m.porcentaje(1, 3)).aSer('33.3%'));

  // 20.8
  prueba('E14 sumarPrecios([0.1, 0.2]) -> 0.3', () => esperar(m.sumarPrecios([0.1, 0.2])).aSer(0.3));
  prueba('E14 sumarPrecios([]) -> 0', () => esperar(m.sumarPrecios([])).aSer(0));
});
