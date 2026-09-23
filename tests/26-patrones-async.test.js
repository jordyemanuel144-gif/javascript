const { grupo, prueba, esperar, usar, pendiente } = require('../lib/mini-test');
const m = require('../04-js-asincrono/26-patrones-async');

const dormir = (ms) => new Promise(r => setTimeout(r, ms));
const fn = (v) => { if (typeof v !== 'function') pendiente(); return v; };

grupo('TEMA 26 - Patrones asincronos', () => {
  prueba('E1  debounce llama 1 sola vez', async () => {
    let n = 0;
    const f = fn(usar(m.debounce)(() => { n++; }, 20));
    f(); f(); f();
    await dormir(60);
    esperar(n).aSer(1);
  });
  prueba('E1  debounce espera de verdad', async () => {
    let n = 0;
    const f = fn(usar(m.debounce)(() => { n++; }, 40));
    f();
    esperar(n).aSer(0);
    await dormir(80);
    esperar(n).aSer(1);
  });
  prueba('E2  debounceArgs pasa los ultimos argumentos', async () => {
    let recibido = null;
    const f = fn(usar(m.debounceArgs)((v) => { recibido = v; }, 20));
    f('a'); f('b');
    await dormir(60);
    esperar(recibido).aSer('b');
  });
  prueba('E3  throttle deja pasar la primera y bloquea el resto', async () => {
    let n = 0;
    const f = fn(usar(m.throttle)(() => { n++; }, 50));
    f(); f(); f();
    esperar(n).aSer(1);
  });
  prueba('E3  throttle vuelve a permitir despues del tiempo', async () => {
    let n = 0;
    const f = fn(usar(m.throttle)(() => { n++; }, 20));
    f(); f();
    await dormir(50);
    f();
    esperar(n).aSer(2);
  });
  prueba('E4  probarAbort -> true', () => esperar(m.probarAbort()).aSer(true));
  prueba('E5  tareaCancelable rechaza al cancelar', async () => {
    const r = m.tareaCancelable(100);
    if (!r || typeof r.cancelar !== 'function') pendiente();
    r.cancelar();
    esperar(await r.promesa.then(() => null, e => e.message)).aSer('cancelado');
  });
  prueba('E5  tareaCancelable resuelve si no se cancela', async () => {
    const r = m.tareaCancelable(10);
    if (!r || typeof r.cancelar !== 'function') pendiente();
    esperar(await r.promesa).aSer('listo');
  });
  prueba('E6  crearBuscador descarta la respuesta vieja', async () => {
    const recibidos = [];
    const buscar = fn(usar(m.crearBuscador)((t) => recibidos.push(t)));
    buscar('a', 40);
    buscar('ab', 5);
    await dormir(90);
    esperar(recibidos).aSer(['ab']);
  });
  prueba('E7  conCache llama una sola vez por clave', async () => {
    let llamadas = 0;
    const traer = fn(usar(m.conCache)(async (id) => { llamadas++; return id * 2; }));
    esperar(await traer(1)).aSer(2);
    await traer(1);
    esperar(llamadas).aSer(1);
  });
  prueba('E7  conCache distingue claves distintas', async () => {
    let llamadas = 0;
    const traer = fn(usar(m.conCache)(async (id) => { llamadas++; return id * 2; }));
    await traer(1);
    esperar(await traer(2)).aSer(4);
    esperar(llamadas).aSer(2);
  });
  prueba('E8  porTandas devuelve todo en orden', async () => {
    esperar(await m.porTandas([1, 2, 3, 4, 5], 2, async n => n * 10)).aSer([10, 20, 30, 40, 50]);
  });
  prueba('E8  porTandas respeta el tamano de tanda', async () => {
    if ((await m.porTandas([1], 1, async n => n)) === undefined) pendiente();
    let simultaneas = 0;
    let maximo = 0;
    await m.porTandas([1, 2, 3, 4], 2, async () => {
      simultaneas++;
      maximo = Math.max(maximo, simultaneas);
      await dormir(10);
      simultaneas--;
    });
    esperar(maximo <= 2).aSer(true);
  });
});
