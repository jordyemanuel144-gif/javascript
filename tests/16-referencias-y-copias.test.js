const { grupo, prueba, esperar, usar, pendiente } = require('../lib/mini-test');
const m = require('../03-js-a-fondo/16-referencias-y-copias');

grupo('TEMA 16 - Referencias y copias', () => {
  // 16.1
  prueba('E1  mismoObjeto(x, x) -> true', () => {
    const x = { a: 1 };
    esperar(m.mismoObjeto(x, x)).aSer(true);
  });
  prueba('E1  mismoObjeto({a:1},{a:1}) -> false', () => esperar(m.mismoObjeto({ a: 1 }, { a: 1 })).aSer(false));
  prueba('E2  agregarMutando muta la lista recibida', () => {
    const lista = [1];
    usar(m.agregarMutando)(lista, 2);
    esperar(lista).aSer([1, 2]);
  });

  // 16.2
  prueba('E3  copiarLista([1,2]) -> [1,2]', () => esperar(m.copiarLista([1, 2])).aSer([1, 2]));
  prueba('E3  copiarLista devuelve OTRO array', () => {
    const o = [1, 2];
    esperar(m.copiarLista(o) !== o).aSer(true);
  });
  prueba('E4  copiar({a:1}) -> {a:1}', () => esperar(m.copiar({ a: 1 })).aSer({ a: 1 }));
  prueba('E4  copiar devuelve OTRO objeto', () => {
    const o = { a: 1 };
    esperar(m.copiar(o) !== o).aSer(true);
  });
  prueba('E5  mezclar({a:1,b:2},{b:9}) -> {a:1,b:9}', () => esperar(m.mezclar({ a: 1, b: 2 }, { b: 9 })).aSer({ a: 1, b: 9 }));
  prueba('E6  conCampo({a:1,b:2}, b, 99)', () => esperar(m.conCampo({ a: 1, b: 2 }, 'b', 99)).aSer({ a: 1, b: 99 }));
  prueba('E6  conCampo NO muta el original', () => {
    const o = { a: 1, b: 2 };
    m.conCampo(o, 'b', 99);
    esperar(o).aSer({ a: 1, b: 2 });
  });

  // 16.3
  prueba('E7  copiarProfundo separa lo anidado', () => {
    const o = { dir: { ciudad: 'Lima' } };
    const c = m.copiarProfundo(o);
    if (c === undefined) pendiente();
    c.dir.ciudad = 'Cusco';
    esperar(o.dir.ciudad).aSer('Lima');
  });

  // 16.4
  prueba('E8  agregar([{id:1}], {id:2})', () => esperar(m.agregar([{ id: 1 }], { id: 2 })).aSer([{ id: 1 }, { id: 2 }]));
  prueba('E8  agregar NO muta', () => {
    const l = [{ id: 1 }];
    m.agregar(l, { id: 2 });
    esperar(l.length).aSer(1);
  });
  prueba('E9  quitar([{id:1},{id:2}], 1) -> [{id:2}]', () => esperar(m.quitar([{ id: 1 }, { id: 2 }], 1)).aSer([{ id: 2 }]));
  prueba('E10 renombrar cambia solo al que coincide', () => esperar(m.renombrar([{ id: 1, nombre: 'a' }, { id: 2, nombre: 'b' }], 2, 'z')).aSer([{ id: 1, nombre: 'a' }, { id: 2, nombre: 'z' }]));
  prueba('E10 renombrar NO muta los objetos originales', () => {
    const l = [{ id: 1, nombre: 'a' }];
    m.renombrar(l, 1, 'z');
    esperar(l[0].nombre).aSer('a');
  });
  prueba('E11 alternar invierte hecha', () => esperar(m.alternar([{ id: 1, hecha: false }], 1)).aSer([{ id: 1, hecha: true }]));
  prueba('E11 alternar no toca a los demas', () => esperar(m.alternar([{ id: 1, hecha: false }, { id: 2, hecha: false }], 1)?.[1]?.hecha).aSer(false));

  // 16.5
  prueba('E12 congelar', () => {
    const c = m.congelar({ a: 1 });
    esperar(c === undefined ? undefined : Object.isFrozen(c)).aSer(true);
  });
  prueba('E13 estaCongelado(freeze({})) -> true', () => esperar(m.estaCongelado(Object.freeze({}))).aSer(true));
  prueba('E13 estaCongelado({}) -> false', () => esperar(m.estaCongelado({})).aSer(false));

  // 16.6
  prueba('E14 igualContenido({a:1},{a:1}) -> true', () => esperar(m.igualContenido({ a: 1 }, { a: 1 })).aSer(true));
  prueba('E14 igualContenido({a:1},{a:2}) -> false', () => esperar(m.igualContenido({ a: 1 }, { a: 2 })).aSer(false));
  prueba('E15 forzarNuevo devuelve otra referencia', () => {
    const o = { a: 1 };
    const n = m.forzarNuevo(o);
    esperar(n === undefined ? undefined : n !== o && JSON.stringify(n) === '{"a":1}').aSer(true);
  });
});
