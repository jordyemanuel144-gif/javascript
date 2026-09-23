const { grupo, prueba, esperar, pendiente } = require('../lib/mini-test');
const m = require('../04-js-asincrono/24-async-await');

const dormir = (ms) => new Promise(r => setTimeout(r, ms));
const noVacio = (v) => { if (v === undefined || v === null) pendiente(); return v; };

// Una promesa rechazada que ya esta "atendida": asi, si el ejercicio todavia
// no la consume, Node no se queja con UnhandledPromiseRejection.
const rechazada = (mensaje) => {
  const p = Promise.reject(new Error(mensaje));
  p.catch(() => {});
  return p;
};

grupo('TEMA 24 - async / await', () => {
  prueba('E1  tarea() resuelve "listo"', async () => esperar(noVacio(await m.tarea())).aSer('listo'));
  prueba('E2  gritar(hola) -> HOLA', async () => esperar(noVacio(await m.gritar(Promise.resolve('hola')))).aSer('HOLA'));
  prueba('E3  esPromesa(Promise) -> true', () => esperar(m.esPromesa(Promise.resolve(1))).aSer(true));
  prueba('E3  esPromesa(5) -> false', () => esperar(m.esPromesa(5)).aSer(false));
  prueba('E4  conRespaldo devuelve el valor si va bien', async () => esperar(noVacio(await m.conRespaldo(Promise.resolve(9), 0))).aSer(9));
  prueba('E4  conRespaldo devuelve el respaldo si falla', async () => esperar(noVacio(await m.conRespaldo(rechazada('x'), 7))).aSer(7));
  prueba('E5  pasosConError -> [inicio, error, fin]', async () => {
    const r = await m.pasosConError();
    if (!r || r.length === 0) pendiente();
    esperar(r).aSer(['inicio', 'error', 'fin']);
  });
  prueba('E6  cargarEstado con exito', async () => esperar(noVacio(await m.cargarEstado(Promise.resolve(5)))).aSer({ datos: 5, error: null, cargando: false }));
  prueba('E6  cargarEstado con error', async () => esperar(noVacio(await m.cargarEstado(rechazada('uy')))).aSer({ datos: null, error: 'uy', cargando: false }));
  prueba('E7  enSerie([1,2]) -> [10, 20]', async () => esperar(noVacio(await m.enSerie([1, 2], async id => id * 10))).aSer([10, 20]));
  prueba('E7  enSerie respeta el orden uno por uno', async () => {
    if ((await m.enSerie([1], async i => i)) === undefined) pendiente();
    const orden = [];
    await m.enSerie([1, 2, 3], async (id) => { await dormir(10); orden.push(id); return id; });
    esperar(orden).aSer([1, 2, 3]);
  });
  prueba('E8  enParalelo([1,2]) -> [10, 20]', async () => esperar(noVacio(await m.enParalelo([1, 2], async id => id * 10))).aSer([10, 20]));
  prueba('E8  enParalelo es de verdad paralelo', async () => {
    if ((await m.enParalelo([1], async i => i)) === undefined) pendiente();
    const inicio = Date.now();
    await m.enParalelo([1, 2, 3], async () => { await dormir(50); });
    esperar(Date.now() - inicio < 120).aSer(true);
  });
  prueba('E9  sumarTodo([1,2,3]) -> 6', async () => esperar(noVacio(await m.sumarTodo([1, 2, 3], async n => n))).aSer(6));
  prueba('E10 sumarEnParalelo -> 3', async () => {
    esperar(noVacio(await m.sumarEnParalelo(dormir(40).then(() => 1), dormir(40).then(() => 2)))).aSer(3);
  });
  prueba('E11 nombreDeUsuario(ana) -> Ana', async () => esperar(noVacio(await m.nombreDeUsuario('ana'))).aSer('Ana'));
  prueba('E12 reintentar logra al segundo intento', async () => {
    let n = 0;
    const fn = async () => { n++; if (n < 2) throw new Error('falla'); return 'ok'; };
    esperar(noVacio(await m.reintentar(fn, 3))).aSer('ok');
  });
  prueba('E12 reintentar relanza si fallan todos', async () => {
    const fn = async () => { throw new Error('siempre falla'); };
    if ((await m.reintentar(async () => 'x', 1)) === undefined) pendiente();
    const msg = await m.reintentar(fn, 2).then(() => null, e => e.message);
    esperar(msg).aSer('siempre falla');
  });
});
