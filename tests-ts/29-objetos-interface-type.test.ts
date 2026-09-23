import { grupo, prueba, esperar } from '../lib/mini-test';
import * as m from '../05-typescript/29-objetos-interface-type';

const prod = { id: 1, nombre: 'Mouse', precio: 100, descuento: 0.1 } as any;
const pedido = {
  id: 1,
  cliente: 'Ana',
  items: [
    { sku: 'a', cantidad: 2, precio: 10 },
    { sku: 'b', cantidad: 1, precio: 5 },
  ],
} as any;

grupo('TEMA 29 - Objetos: interface y type', () => {
  prueba('E2  precioFinal con descuento -> 90', () => esperar(m.precioFinal(prod)).aSer(90));
  prueba('E2  precioFinal sin descuento -> 100', () => esperar(m.precioFinal({ id: 1, nombre: 'x', precio: 100 } as any)).aSer(100));
  prueba('E6  describirCliente -> "1 - Ana"', () => esperar(m.describirCliente({ id: 1, nombre: 'Ana' } as any)).aSer('1 - Ana'));
  prueba('E8  totalPedido -> 25', () => esperar(m.totalPedido(pedido)).aSer(25));
  prueba('E9  skusRepetidos -> [a]', () => esperar(m.skusRepetidos(pedido)).aSer(['a']));
  prueba('E11 totalStock({a:2,b:3}) -> 5', () => esperar(m.totalStock({ a: 2, b: 3 } as any)).aSer(5));
  prueba('E12 contar([a,b,a]) -> {a:2,b:1}', () => esperar(m.contar(['a', 'b', 'a'])).aSer({ a: 2, b: 1 }));
  prueba('E14 aUsuario convierte el DTO', () => {
    esperar(m.aUsuario({ id: 1, nombre_completo: 'Ana', correo: 'a@b.c', activo: 1 }) as any)
      .aSer({ id: 1, nombre: 'Ana', email: 'a@b.c', activo: true } as any);
  });
  prueba('E14 activo 0 -> false', () => {
    esperar((m.aUsuario({ id: 2, nombre_completo: 'Luis', correo: 'l@b.c', activo: 0 }) as any).activo).aSer(false);
  });
  prueba('E15 aUsuarios convierte la lista entera', () => {
    const r = m.aUsuarios([
      { id: 1, nombre_completo: 'Ana', correo: 'a@b.c', activo: 1 },
      { id: 2, nombre_completo: 'Luis', correo: 'l@b.c', activo: 0 },
    ]) as any[];
    esperar(r.map(u => u.nombre)).aSer(['Ana', 'Luis']);
  });
});
