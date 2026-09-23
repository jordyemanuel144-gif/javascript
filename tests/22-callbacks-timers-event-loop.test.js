const { grupo, prueba, esperar, usar, pendiente } = require('../lib/mini-test');
const m = require('../04-js-asincrono/22-callbacks-timers-event-loop');

const dormir = (ms) => new Promise(r => setTimeout(r, ms));

grupo('TEMA 22 - Callbacks, timers y event loop', () => {
  prueba('E1  ordenSalida -> [A, C, B]', () => esperar(m.ordenSalida()).aSer(['A', 'C', 'B']));

  prueba('E2  avisarLuego llama al callback', async () => {
    usar(m.avisarLuego);
    let llamado = false;
    m.avisarLuego(5, () => { llamado = true; });
    esperar(llamado).aSer(false);          // todavia NO: es asincrono
    await dormir(30);
    esperar(llamado).aSer(true);           // ahora si
  });

  prueba('E3  avisarLuegoCancelable devuelve un id', async () => {
    const id = m.avisarLuegoCancelable(5, () => {});
    if (id === undefined) pendiente();
    clearTimeout(id);
    esperar(id !== null).aSer(true);
  });

  prueba('E4  cancelar evita que se ejecute', async () => {
    usar(m.cancelar);
    let llamado = false;
    const id = setTimeout(() => { llamado = true; }, 5);
    m.cancelar(id);
    await dormir(30);
    esperar(llamado).aSer(false);
  });

  prueba('E5  repetir(3) llama 3 veces y para', async () => {
    usar(m.repetir);
    let veces = 0;
    m.repetir(3, 5, () => { veces++; });
    await dormir(80);
    esperar(veces).aSer(3);
  });

  prueba('E6  ordenConPromesa -> [1, 4, 3, 2]', () => esperar(m.ordenConPromesa()).aSer(['1', '4', '3', '2']));

  prueba('E7  buscarUsuario(1) devuelve el usuario', async () => {
    usar(m.buscarUsuario);
    const r = await new Promise(res => m.buscarUsuario(1, (e, u) => res({ e, u })));
    esperar(r.u).aSer({ id: 1, nombre: 'Ana' });
  });

  prueba('E7  buscarUsuario(0) devuelve un Error', async () => {
    usar(m.buscarUsuario);
    const r = await new Promise(res => m.buscarUsuario(0, (e, u) => res({ e, u })));
    esperar(r.e instanceof Error).aSer(true);
  });

  prueba('E8  buscarUsuarioPromesa(1) resuelve', async () => {
    const p = m.buscarUsuarioPromesa(1);
    if (p === undefined) pendiente();
    esperar(await p).aSer({ id: 1, nombre: 'Ana' });
  });

  prueba('E8  buscarUsuarioPromesa(0) rechaza', async () => {
    const p = m.buscarUsuarioPromesa(0);
    if (p === undefined) pendiente();
    let rechazo = false;
    await p.catch(() => { rechazo = true; });
    esperar(rechazo).aSer(true);
  });
});
