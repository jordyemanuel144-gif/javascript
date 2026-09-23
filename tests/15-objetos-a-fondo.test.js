const { grupo, prueba, esperar, pendiente } = require('../lib/mini-test');
const m = require('../03-js-a-fondo/15-objetos-a-fondo');

grupo('TEMA 15 - Objetos a fondo', () => {
  // 15.1
  prueba('E1  nombreDe({nombre:Ana}) -> Ana', () => esperar(m.nombreDe({ nombre: 'Ana' })).aSer('Ana'));
  prueba('E2  leerCampo({a:1,b:2}, b) -> 2', () => esperar(m.leerCampo({ a: 1, b: 2 }, 'b')).aSer(2));
  prueba('E3  valoresDe(..., [nombre, id]) -> [Ana, 1]', () => esperar(m.valoresDe({ id: 1, nombre: 'Ana' }, ['nombre', 'id'])).aSer(['Ana', 1]));

  // 15.2
  prueba('E4  tieneClave({a:undefined}, a) -> true', () => esperar(m.tieneClave({ a: undefined }, 'a')).aSer(true));
  prueba('E4  tieneClave({a:1}, z) -> false', () => esperar(m.tieneClave({ a: 1 }, 'z')).aSer(false));
  prueba('E5  oNoHay({a:1}, a) -> 1', () => esperar(m.oNoHay({ a: 1 }, 'a')).aSer(1));
  prueba('E5  oNoHay({a:1}, z) -> no hay', () => esperar(m.oNoHay({ a: 1 }, 'z')).aSer('no hay'));

  // 15.3
  prueba('E6  copiar({a:1}) -> {a:1}', () => esperar(m.copiar({ a: 1 })).aSer({ a: 1 }));
  prueba('E6  copiar devuelve OTRO objeto', () => {
    const o = { a: 1 };
    esperar(m.copiar(o) !== o).aSer(true);
  });
  prueba('E7  conEdad99 cambia solo la edad', () => esperar(m.conEdad99({ nombre: 'Ana', edad: 30 })).aSer({ nombre: 'Ana', edad: 99 }));
  prueba('E8  conCampo({a:1,b:2}, b, 99)', () => esperar(m.conCampo({ a: 1, b: 2 }, 'b', 99)).aSer({ a: 1, b: 99 }));
  prueba('E9  sinClave({a:1,b:2}, b) -> {a:1}', () => esperar(m.sinClave({ a: 1, b: 2 }, 'b')).aSer({ a: 1 }));
  prueba('E9  sinClave NO muta el original', () => {
    const o = { a: 1, b: 2 };
    m.sinClave(o, 'b');
    esperar(o).aSer({ a: 1, b: 2 });
  });

  // 15.4
  prueba('E10 armar(Ana, 30) -> {nombre, edad}', () => esperar(m.armar('Ana', 30)).aSer({ nombre: 'Ana', edad: 30 }));
  prueba('E11 filtroDe(estado, activo)', () => esperar(m.filtroDe('estado', 'activo')).aSer({ estado: 'activo' }));

  // 15.5
  prueba('E12 claves({a:1,b:2}) -> [a,b]', () => esperar(m.claves({ a: 1, b: 2 })).aSer(['a', 'b']));
  prueba('E13 soloValores({a:1,b:2}) -> [1,2]', () => esperar(m.soloValores({ a: 1, b: 2 })).aSer([1, 2]));
  prueba('E14 sumarValores({a:1,b:2,c:3}) -> 6', () => esperar(m.sumarValores({ a: 1, b: 2, c: 3 })).aSer(6));
  prueba('E15 primerPar({a:1,b:2}) -> [a,1]', () => esperar(m.primerPar({ a: 1, b: 2 })).aSer(['a', 1]));
  prueba('E16 aObjeto([[a,1],[b,2]]) -> {a:1,b:2}', () => esperar(m.aObjeto([['a', 1], ['b', 2]])).aSer({ a: 1, b: 2 }));

  // 15.6
  prueba('E17 duplicarValores({a:1,b:2}) -> {a:2,b:4}', () => esperar(m.duplicarValores({ a: 1, b: 2 })).aSer({ a: 2, b: 4 }));
  prueba('E18 clavesMayus({a:1}) -> {A:1}', () => esperar(m.clavesMayus({ a: 1 })).aSer({ A: 1 }));
  prueba('E19 limpiar quita null y undefined pero deja el 0', () => esperar(m.limpiar({ a: 1, b: null, c: undefined, d: 0 })).aSer({ a: 1, d: 0 }));

  // 15.7
  prueba('E20 describir({a:1,b:2}) -> [a=1, b=2]', () => esperar(m.describir({ a: 1, b: 2 })).aSer(['a=1', 'b=2']));
  prueba('E21 describirCorto({a:1,b:2}) -> [a=1, b=2]', () => esperar(m.describirCorto({ a: 1, b: 2 })).aSer(['a=1', 'b=2']));
  prueba('E21 describirCorto usa map, no for', () => {
    if (m.describirCorto({ a: 1 }) === undefined) pendiente();
    esperar(/\.map\s*\(/.test(String(m.describirCorto))).aSer(true);
  });

  // 15.8
  prueba('E22 unPar(pan, 100) -> {pan:100}', () => esperar(m.unPar('pan', 100)).aSer({ pan: 100 }));
  prueba('E23 indexarConFor', () => esperar(m.indexarConFor([{ id: 1, n: 'a' }, { id: 2, n: 'b' }])).aSer({ 1: { id: 1, n: 'a' }, 2: { id: 2, n: 'b' } }));
  prueba('E24 indexarPorId', () => esperar(m.indexarPorId([{ id: 1, n: 'a' }])).aSer({ 1: { id: 1, n: 'a' } }));
  prueba('E25 contar([a,b,a]) -> {a:2,b:1}', () => esperar(m.contar(['a', 'b', 'a'])).aSer({ a: 2, b: 1 }));
  prueba('E25 contar([]) -> {}', () => esperar(m.contar([])).aSer({}));
  prueba('E26 agrupar por t', () => esperar(m.agrupar([{ t: 'a', v: 1 }, { t: 'b', v: 2 }, { t: 'a', v: 3 }], 't')).aSer({ a: [{ t: 'a', v: 1 }, { t: 'a', v: 3 }], b: [{ t: 'b', v: 2 }] }));

  // 15.9
  prueba('E27 ciudadPedido con ciudad -> Lima', () => esperar(m.ciudadPedido({ cliente: { direccion: { ciudad: 'Lima' } } })).aSer('Lima'));
  prueba('E27 ciudadPedido({}) -> desconocida', () => esperar(m.ciudadPedido({})).aSer('desconocida'));
  prueba('E28 primerSku([{sku:A1}]) -> A1', () => esperar(m.primerSku({ items: [{ sku: 'A1' }] })).aSer('A1'));
  prueba('E28 primerSku sin items -> null', () => esperar(m.primerSku({ items: [] })).aSer(null));
});
