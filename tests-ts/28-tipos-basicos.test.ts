import { grupo, prueba, esperar } from '../lib/mini-test';
import * as m from '../05-typescript/28-tipos-basicos';

grupo('TEMA 28 - TypeScript: tipos basicos', () => {
  prueba('E1  las constantes tienen los valores correctos', () => {
    esperar([m.ciudad, m.habitantes, m.esCapital]).aSer(['Lima', 9700000, true] as any);
  });
  prueba('E2  gritar(hola) -> HOLA', () => esperar(m.gritar('hola')).aSer('HOLA'));
  prueba('E3  sumar(2, 3) -> 5', () => esperar(m.sumar(2, 3)).aSer(5));
  prueba('E4  largoSeguro(hola) -> 4', () => esperar(m.largoSeguro('hola')).aSer(4));
  prueba('E4  largoSeguro(5) -> 0', () => esperar(m.largoSeguro(5)).aSer(0));
  prueba('E5  anotar agrega al registro', () => {
    const antes = m.registro.length;
    m.anotar('hola');
    esperar(m.registro.length - antes).aSer(1);
  });
  prueba('E6  explotar lanza un Error con el mensaje', () => {
    try {
      m.explotar('uy');
    } catch (e: any) {
      if (e?.pendiente) throw e;           // todavia sin resolver
      esperar(e instanceof Error && e.message === 'uy').aSer(true);
      return;
    }
    esperar('no lanzo nada').aSer('un Error');
  });
  prueba('E7  saludo(null) -> invitado', () => esperar(m.saludo(null)).aSer('invitado'));
  prueba('E7  saludo(Ana) -> Ana', () => esperar(m.saludo('Ana')).aSer('Ana'));
  prueba('E8  conLimite() -> 10', () => esperar(m.conLimite()).aSer(10));
  prueba('E8  conLimite(5) -> 5', () => esperar(m.conLimite(5)).aSer(5));
  prueba('E9  repetir(ab) -> abab', () => esperar(m.repetir('ab')).aSer('abab'));
  prueba('E9  repetir(ab, 3) -> ababab', () => esperar(m.repetir('ab', 3)).aSer('ababab'));
  prueba('E13 formatear(ab) -> AB', () => esperar(m.formatear('ab')).aSer('AB'));
  prueba('E13 formatear(ab, 2) -> ABAB', () => esperar(m.formatear('ab', 2)).aSer('ABAB'));
  prueba('E13 formatear(undefined) -> cadena vacia', () => esperar(m.formatear(undefined)).aSer(''));
});
