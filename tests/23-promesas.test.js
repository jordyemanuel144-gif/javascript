const { grupo, prueba, esperar, pendiente } = require('../lib/mini-test');
const m = require('../04-js-asincrono/23-promesas');

const dormir = (ms) => new Promise(r => setTimeout(r, ms));
const espera = (p) => { if (p === undefined || typeof p.then !== 'function') pendiente(); return p; };

// Una promesa rechazada que ya esta "atendida": asi, si el ejercicio todavia
// no la consume, Node no se queja con UnhandledPromiseRejection.
const rechazada = (mensaje) => {
  const p = Promise.reject(new Error(mensaje));
  p.catch(() => {});
  return p;
};

grupo('TEMA 23 - Promesas', () => {
  prueba('E1  dormir(20) es una promesa que espera', async () => {
    const inicio = Date.now();
    await espera(m.dormir(20));
    esperar(Date.now() - inicio >= 15).aSer(true);
  });
  prueba('E2  ya(5) resuelve 5', async () => esperar(await espera(m.ya(5))).aSer(5));
  prueba('E3  tardeOTemprano(7) resuelve 7', async () => esperar(await espera(m.tardeOTemprano(7))).aSer(7));
  prueba('E3  tardeOTemprano(0) rechaza con "sin valor"', async () => {
    const p = espera(m.tardeOTemprano(0));
    const msg = await p.then(() => null, e => e.message);
    esperar(msg).aSer('sin valor');
  });
  prueba('E4  enMayusculas', async () => esperar(await espera(m.enMayusculas(Promise.resolve('hola')))).aSer('HOLA'));
  prueba('E5  aSalvo con promesa rota -> error', async () => esperar(await espera(m.aSalvo(rechazada('x')))).aSer('error'));
  prueba('E5  aSalvo con promesa buena -> deja pasar', async () => esperar(await espera(m.aSalvo(Promise.resolve('ok')))).aSer('ok'));
  prueba('E6  procesar("  ana ") -> ANA!', async () => esperar(await espera(m.procesar(Promise.resolve('  ana ')))).aSer('ANA!'));
  prueba('E7  buscarNombre(1) -> Ana', async () => esperar(await espera(m.buscarNombre(1))).aSer('Ana'));
  prueba('E8  ambas -> [1, 2]', async () => esperar(await espera(m.ambas(Promise.resolve(1), Promise.resolve(2)))).aSer([1, 2]));
  prueba('E8  ambas corre en PARALELO (no en serie)', async () => {
    const inicio = Date.now();
    await espera(m.ambas(dormir(60), dormir(60)));
    esperar(Date.now() - inicio < 110).aSer(true);
  });
  prueba('E9  cuantasOk -> 1', async () => {
    esperar(await espera(m.cuantasOk([Promise.resolve(1), rechazada('x')]))).aSer(1);
  });
  prueba('E9  cuantasOk no rechaza nunca', async () => {
    esperar(await espera(m.cuantasOk([rechazada('a'), rechazada('b')]))).aSer(0);
  });
  prueba('E10 laPrimera -> rapida', async () => {
    const r = await espera(m.laPrimera([dormir(60).then(() => 'lenta'), dormir(5).then(() => 'rapida')]));
    esperar(r).aSer('rapida');
  });
  prueba('E11 conTimeout corta si tarda', async () => {
    const p = espera(m.conTimeout(dormir(100), 10));
    const msg = await p.then(() => null, e => e.message);
    esperar(msg).aSer('timeout');
  });
  prueba('E11 conTimeout deja pasar si llega a tiempo', async () => {
    esperar(await espera(m.conTimeout(dormir(5).then(() => 'ok'), 100))).aSer('ok');
  });
  prueba('E12 aResultado ok', async () => esperar(await espera(m.aResultado(Promise.resolve(5)))).aSer({ ok: true, valor: 5 }));
  prueba('E12 aResultado con error', async () => esperar(await espera(m.aResultado(rechazada('x')))).aSer({ ok: false, error: 'x' }));
});
