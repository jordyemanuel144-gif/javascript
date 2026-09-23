const { grupo, prueba, esperar, pendiente } = require('../lib/mini-test');
const { reiniciar } = require('../lib/api-falsa');
const m = require('../04-js-asincrono/25-fetch-y-apis');

const noVacio = (v) => { if (v === undefined) pendiente(); return v; };
const mensajeDe = (p) => p.then(() => null, e => e.message);

grupo('TEMA 25 - fetch y APIs REST', () => {
  prueba('E1  traerUsuarios devuelve los 3 usuarios', async () => {
    reiniciar();
    esperar(noVacio(await m.traerUsuarios()).map(u => u.nombre)).aSer(['Ana', 'Luis', 'Eva']);
  });
  prueba('E2  statusDe(/api/error) -> 500', async () => esperar(noVacio(await m.statusDe('/api/error'))).aSer(500));
  prueba('E2  statusDe(/api/usuarios) -> 200', async () => esperar(noVacio(await m.statusDe('/api/usuarios'))).aSer(200));
  prueba('E3  traerUsuario(1) -> Ana', async () => {
    reiniciar();
    esperar(noVacio(await m.traerUsuario(1)).nombre).aSer('Ana');
  });
  prueba('E3  traerUsuario(99) lanza HTTP 404', async () => {
    if ((await m.traerUsuario(1)) === undefined) pendiente();
    esperar(await mensajeDe(m.traerUsuario(99))).aSer('HTTP 404');
  });
  prueba('E4  crearUsuario devuelve el creado con id nuevo', async () => {
    reiniciar();
    const nuevo = noVacio(await m.crearUsuario({ nombre: 'Nuevo', email: 'n@mail.com' }));
    esperar({ id: nuevo.id, nombre: nuevo.nombre }).aSer({ id: 4, nombre: 'Nuevo' });
  });
  prueba('E4  crearUsuario manda el body como JSON', async () => {
    reiniciar();
    await m.crearUsuario({ nombre: 'Zoe' });
    const todos = await m.traerUsuarios();
    esperar(noVacio(todos).some(u => u.nombre === 'Zoe')).aSer(true);
  });
  prueba('E5  actualizarUsuario(1) cambia el nombre', async () => {
    reiniciar();
    esperar(noVacio(await m.actualizarUsuario(1, { nombre: 'Ana María' })).nombre).aSer('Ana María');
  });
  prueba('E6  borrarUsuario(1) -> true', async () => {
    reiniciar();
    esperar(noVacio(await m.borrarUsuario(1))).aSer(true);
  });
  prueba('E6  borrarUsuario(99) -> false', async () => {
    reiniciar();
    esperar(noVacio(await m.borrarUsuario(99))).aSer(false);
  });
  prueba('E7  pedir(/api/usuarios) devuelve el array', async () => {
    reiniciar();
    esperar(noVacio(await m.pedir('/api/usuarios')).length).aSer(3);
  });
  prueba('E7  pedir(/api/usuarios/99) lanza "No encontrado"', async () => {
    if ((await m.pedir('/api/usuarios')) === undefined) pendiente();
    esperar(await mensajeDe(m.pedir('/api/usuarios/99'))).aSer('No encontrado');
  });
  prueba('E7  pedir(/api/error) lanza "Error del servidor"', async () => {
    if ((await m.pedir('/api/usuarios')) === undefined) pendiente();
    esperar(await mensajeDe(m.pedir('/api/error'))).aSer('Error del servidor');
  });
  prueba('E7  pedir sobre un 204 devuelve null', async () => {
    reiniciar();
    if ((await m.pedir('/api/usuarios')) === undefined) pendiente();
    esperar(await m.pedir('/api/usuarios/2', { method: 'DELETE' })).aSer(null);
  });
  prueba('E8  cargar ok', async () => {
    reiniciar();
    const r = noVacio(await m.cargar('/api/usuarios'));
    esperar({ ok: r.ok, error: r.error, n: r.datos.length }).aSer({ ok: true, error: null, n: 3 });
  });
  prueba('E8  cargar con error no lanza', async () => {
    esperar(noVacio(await m.cargar('/api/error'))).aSer({ ok: false, datos: null, error: 'Error del servidor' });
  });
  prueba('E9  armarUrl con filtros', () => esperar(m.armarUrl('/api/usuarios', { q: 'ana', pagina: 2 })).aSer('/api/usuarios?q=ana&pagina=2'));
  prueba('E10 armarUrlLimpia descarta vacios', () => esperar(m.armarUrlLimpia('/api/u', { q: 'ana', estado: '', pagina: null })).aSer('/api/u?q=ana'));
  prueba('E10 armarUrlLimpia sin filtros -> base sola', () => esperar(m.armarUrlLimpia('/api/u', { estado: '', pagina: null })).aSer('/api/u'));
  prueba('E11 usuariosApi.listar()', async () => {
    reiniciar();
    if (typeof m.usuariosApi.listar !== 'function') pendiente();
    esperar((await m.usuariosApi.listar()).length).aSer(3);
  });
  prueba('E11 usuariosApi.traer(1)', async () => {
    reiniciar();
    if (typeof m.usuariosApi.traer !== 'function') pendiente();
    esperar((await m.usuariosApi.traer(1)).nombre).aSer('Ana');
  });
  prueba('E11 usuariosApi.crear + borrar', async () => {
    reiniciar();
    if (typeof m.usuariosApi.crear !== 'function' || typeof m.usuariosApi.borrar !== 'function') pendiente();
    const nuevo = await m.usuariosApi.crear({ nombre: 'Temp' });
    esperar(await m.usuariosApi.borrar(nuevo.id)).aSer(null);
  });
});
