const { grupo, prueba, esperar, usar, pendiente } = require('../lib/mini-test');
const m = require('../03-js-a-fondo/21-map-set-y-regex');

grupo('TEMA 21 - Map, Set y regex', () => {
  // 21.1
  prueba('E1  cuantosDistintos([1,1,2,3,3]) -> 3', () => esperar(m.cuantosDistintos([1, 1, 2, 3, 3])).aSer(3));
  prueba('E2  unicos([1,2,2,3,1]) -> [1,2,3]', () => esperar(m.unicos([1, 2, 2, 3, 1])).aSer([1, 2, 3]));

  // 21.2
  prueba('E3  comunes([1,2,3],[2,3,4]) -> [2,3]', () => esperar(m.comunes([1, 2, 3], [2, 3, 4])).aSer([2, 3]));
  prueba('E4  alternarId agrega si no esta', () => {
    const s = new Set();
    const r = usar(m.alternarId)(s, 2);
    esperar([...(r || s)]).aSer([2]);
  });
  prueba('E4  alternarId quita si ya esta', () => {
    const s = new Set([1]);
    const r = usar(m.alternarId)(s, 1);
    esperar([...(r || s)]).aSer([]);
  });

  // 21.3
  prueba('E5  aMapa indexa por id', () => {
    const mapa = m.aMapa([{ id: 1, n: 'a' }, { id: 2, n: 'b' }]);
    if (mapa === undefined) pendiente();
    esperar(mapa.get(2)).aSer({ id: 2, n: 'b' });
  });
  prueba('E6  buscarEnMapa encuentra', () => esperar(m.buscarEnMapa(new Map([['a', 1]]), 'a')).aSer(1));
  prueba('E6  buscarEnMapa sin resultado -> null', () => esperar(m.buscarEnMapa(new Map(), 'z')).aSer(null));

  // 21.4
  prueba('E7  contarPalabras([a,b,a])', () => {
    const r = m.contarPalabras(['a', 'b', 'a']);
    if (r === undefined) pendiente();
    esperar([...r.entries()]).aSer([['a', 2], ['b', 1]]);
  });

  // 21.6
  prueba('E8  soloDigitos(123) -> true', () => esperar(m.soloDigitos('123')).aSer(true));
  prueba('E8  soloDigitos(12a) -> false', () => esperar(m.soloDigitos('12a')).aSer(false));
  prueba('E8  soloDigitos() vacio -> false', () => esperar(m.soloDigitos('')).aSer(false));
  prueba('E9  esEmail(a@b.com) -> true', () => esperar(m.esEmail('a@b.com')).aSer(true));
  prueba('E9  esEmail(a@b) -> false', () => esperar(m.esEmail('a@b')).aSer(false));

  // 21.7
  prueba('E10 aBarras(2026-03-15) -> 2026/03/15', () => esperar(m.aBarras('2026-03-15')).aSer('2026/03/15'));
  prueba('E11 soloNumeros((511) 999-888)', () => esperar(m.soloNumeros('(511) 999-888')).aSer('511999888'));
  prueba('E12 normalizar espacios', () => esperar(m.normalizar('  hola   mundo  ')).aSer('hola mundo'));

  // 21.8
  prueba('E13 contiene ignora mayusculas', () => esperar(m.contiene('Hola Mundo', 'mundo')).aSer(true));
  prueba('E13 contiene(no esta) -> false', () => esperar(m.contiene('Hola', 'chau')).aSer(false));
});
