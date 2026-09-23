import { grupo, prueba, esperar, pendiente } from '../lib/mini-test';
import * as m from '../05-typescript/31-arrays-tuplas-enums';

grupo('TEMA 31 - Arrays, tuplas, enums y as const', () => {
  prueba('E3  soloTextos([a,1,b]) -> [a,b]', () => esperar(m.soloTextos(['a', 1, 'b'])).aSer(['a', 'b']));
  prueba('E4  sumar([1,2,3]) -> 6', () => esperar(m.sumar([1, 2, 3])).aSer(6));
  prueba('E7  distanciaX([0,0],[3,5]) -> 3', () => esperar(m.distanciaX([0, 0], [3, 5])).aSer(3));
  prueba('E7  distanciaX al reves tambien da 3', () => esperar(m.distanciaX([3, 5], [0, 0])).aSer(3));
  prueba('E8  aPares({a:1,b:2})', () => esperar(m.aPares({ a: 1, b: 2 })).aSer([['a', 1], ['b', 2]]));
  prueba('E10 etiqueta(pendiente) -> En espera', () => esperar(m.etiqueta('pendiente' as any)).aSer('En espera'));
  prueba('E10 etiqueta(enviado) -> En camino', () => esperar(m.etiqueta('enviado' as any)).aSer('En camino'));
  prueba('E10 etiqueta(entregado) -> Finalizado', () => esperar(m.etiqueta('entregado' as any)).aSer('Finalizado'));
  prueba('E11 el enum Prioridad tiene Baja y Alta', () => {
    if ((m.Prioridad as any).Alta === undefined) pendiente();
    esperar([(m.Prioridad as any).Baja, (m.Prioridad as any).Alta]).aSer(['BAJA', 'ALTA'] as any);
  });
  prueba('E12 esUrgente(Alta) -> true', () => esperar(m.esUrgente('ALTA' as any)).aSer(true));
  prueba('E12 esUrgente(Baja) -> false', () => esperar(m.esUrgente('BAJA' as any)).aSer(false));
  prueba('E13 MONEDAS tiene los 3 valores', () => esperar([...m.MONEDAS]).aSer(['PEN', 'USD', 'EUR']));
  prueba('E15 simbolo(PEN) -> S/', () => esperar(m.simbolo('PEN' as any)).aSer('S/'));
  prueba('E15 simbolo(USD) -> $', () => esperar(m.simbolo('USD' as any)).aSer('$'));
  prueba('E15 simbolo(EUR) -> euro', () => esperar(m.simbolo('EUR' as any)).aSer('€'));
});
