import { grupo, prueba, esperar } from '../lib/mini-test';
import * as m from '../05-typescript/35-keyof-typeof-mapeados';

const u: m.Usuario = { id: 1, nombre: 'Ana', email: 'a@b.c', activo: true };
const pedido: m.Pedido = { id: 1, items: [{ sku: 'a', cantidad: 2 }, { sku: 'b', cantidad: 3 }] };

grupo('TEMA 35 - keyof, typeof y tipos mapeados', () => {
  prueba('E2  leer(u, nombre) -> Ana', () => esperar(m.leer(u, 'nombre')).aSer('Ana'));
  prueba('E2  leer(u, id) -> 1', () => esperar(m.leer(u, 'id')).aSer(1));
  prueba('E3  valores(u, [nombre, id]) -> [Ana, 1]', () => esperar(m.valores(u, ['nombre', 'id']) as any).aSer(['Ana', 1] as any));
  prueba('E6  esRol(admin) -> true', () => esperar(m.esRol('admin')).aSer(true));
  prueba('E6  esRol(otro) -> false', () => esperar(m.esRol('otro')).aSer(false));
  prueba('E8  totalItems -> 5', () => esperar(m.totalItems(pedido)).aSer(5));
  prueba('E11 sinTocar([a,b]) -> {a:false,b:false}', () => esperar(m.sinTocar(['a', 'b'])).aSer({ a: false, b: false }));
  prueba('E12 camposConError -> [email]', () => esperar(m.camposConError({ email: 'malo', nombre: undefined })).aSer(['email']));
  prueba('E12 camposConError sin errores -> []', () => esperar(m.camposConError({ email: undefined })).aSer([]));
  prueba('E13 TEMAS conserva sus valores', () => esperar({ ...m.TEMAS }).aSer({ claro: '#fff', oscuro: '#000' }));
});
