import { grupo, prueba, esperar, pendiente } from '../lib/mini-test';
import * as m from '../05-typescript/33-genericos';

grupo('TEMA 33 - Genericos', () => {
  prueba('E1  primero([1,2]) -> 1', () => esperar(m.primero([1, 2])).aSer(1));
  prueba('E1  primero([]) -> undefined', () => esperar(m.primero<number>([]) === undefined).aSer(true));
  prueba('E2  ultimo([1,2,3]) -> 3', () => esperar(m.ultimo([1, 2, 3])).aSer(3));
  prueba('E3  envolver(5) -> [5]', () => esperar(m.envolver(5)).aSer([5]));
  prueba('E4  invertir([1,2,3]) -> [3,2,1]', () => esperar(m.invertir([1, 2, 3])).aSer([3, 2, 1]));
  prueba('E4  invertir NO muta el original', () => {
    const o = [1, 2, 3];
    m.invertir(o);
    esperar(o).aSer([1, 2, 3]);
  });
  prueba('E5  par(x, 1) -> [x, 1]', () => esperar(m.par('x', 1)).aSer(['x', 1]));
  prueba('E6  mapear([1,2], n => #n)', () => esperar(m.mapear([1, 2], n => `#${n}`)).aSer(['#1', '#2']));
  prueba('E7  intercambiar([a,1]) -> [1,a]', () => esperar(m.intercambiar(['a', 1])).aSer([1, 'a']));
  prueba('E8  buscarPorId encuentra', () => esperar(m.buscarPorId([{ id: 1, n: 'a' }, { id: 2, n: 'b' }], 2)?.n).aSer('b'));
  prueba('E8  buscarPorId sin resultado -> undefined', () => esperar(m.buscarPorId([{ id: 1 }], 9) === undefined).aSer(true));
  prueba('E9  ids([{id:1},{id:2}]) -> [1,2]', () => esperar(m.ids([{ id: 1 }, { id: 2 }])).aSer([1, 2]));
  prueba('E10 quitarPorId', () => esperar(m.quitarPorId([{ id: 1 }, { id: 2 }], 1)).aSer([{ id: 2 }]));
  prueba('E13 empaquetar([1,2]) -> { datos, total: 2 }', () => esperar(m.empaquetar([1, 2]) as any).aSer({ datos: [1, 2], total: 2 } as any));
  prueba('E14 intentar(() => 5) -> ok', () => esperar(m.intentar(() => 5) as any).aSer({ ok: true, valor: 5 } as any));
  prueba('E14 intentar con error -> ok false', () => {
    const r = m.intentar(() => { throw new Error('uy'); }) as any;
    esperar(r).aSer({ ok: false, error: 'uy' } as any);
  });
  prueba('E15 crearRef(0).value -> 0', () => esperar(m.crearRef(0)?.value).aSer(0));
  prueba('E15 crearRef deja cambiar el value', () => {
    const r = m.crearRef(0);
    if (!r) pendiente();
    r.value = 5;
    esperar(r.value).aSer(5);
  });
});
