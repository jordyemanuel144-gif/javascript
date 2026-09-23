import { grupo, prueba, esperar } from '../lib/mini-test';
import * as m from '../05-typescript/37-typescript-en-la-practica';

const respuesta = (ok: boolean, status: number, cuerpo: unknown): m.RespuestaFalsa => ({
  ok, status, json: async () => cuerpo,
});

grupo('TEMA 37 - TypeScript en la practica', () => {
  prueba('E1  comoUsuario devuelve el mismo objeto', () => {
    esperar(m.comoUsuario({ id: 1, nombre: 'Ana' })).aSer({ id: 1, nombre: 'Ana' });
  });
  prueba('E2  aUsuarioSeguro con datos validos', () => {
    esperar(m.aUsuarioSeguro({ id: 1, nombre: 'Ana' })).aSer({ id: 1, nombre: 'Ana' });
  });
  prueba('E2  aUsuarioSeguro con objeto vacio -> null', () => esperar(m.aUsuarioSeguro({})).aSer(null));
  prueba('E2  aUsuarioSeguro con null -> null', () => esperar(m.aUsuarioSeguro(null)).aSer(null));
  prueba('E2  aUsuarioSeguro con id que no es numero -> null', () => esperar(m.aUsuarioSeguro({ id: 'x', nombre: 'Ana' })).aSer(null));
  prueba('E3  pedir devuelve el cuerpo tipado', async () => {
    const r = await m.pedir<m.Usuario[]>(async () => respuesta(true, 200, [{ id: 1, nombre: 'Ana' }]));
    esperar(r).aSer([{ id: 1, nombre: 'Ana' }]);
  });
  prueba('E3  pedir lanza HTTP 404 si no es ok', async () => {
    const msg = await m.pedir(async () => respuesta(false, 404, null)).then(() => null, (e: Error) => e.message);
    esperar(msg).aSer('HTTP 404');
  });
  prueba('E4  useContador(5) arranca en 5 y el doble es 10', () => {
    const c = m.useContador(5);
    esperar({ valor: c?.valor, doble: c?.doble }).aSer({ valor: 5, doble: 10 });
  });
  prueba('E4  useContador().subir() devuelve 1', () => {
    const c = m.useContador();
    esperar(c?.subir()).aSer(1);
  });
  prueba('E5  normalizar({id:1})', () => esperar(m.normalizar({ id: 1 })).aSer({ id: 1, nombre: 'sin nombre' }));
  prueba('E5  normalizar({id:2,nombre:Ana})', () => esperar(m.normalizar({ id: 2, nombre: 'Ana' })).aSer({ id: 2, nombre: 'Ana' }));
  prueba('E5  normalizar({})', () => esperar(m.normalizar({})).aSer({ id: 0, nombre: 'sin nombre' }));
});
