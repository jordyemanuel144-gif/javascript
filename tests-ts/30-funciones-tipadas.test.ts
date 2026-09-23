import { grupo, prueba, esperar } from '../lib/mini-test';
import * as m from '../05-typescript/30-funciones-tipadas';

const noVacio = m.noVacio as unknown as (t: string) => boolean;

grupo('TEMA 30 - Funciones tipadas', () => {
  prueba('E1  esPar(4) -> true', () => esperar(m.esPar(4)).aSer(true));
  prueba('E1  esPar(3) -> false', () => esperar(m.esPar(3)).aSer(false));
  prueba('E2  nombreCompleto(Ana, Perez)', () => esperar(m.nombreCompleto('Ana', 'Pérez')).aSer('Ana Pérez'));
  prueba('E3  conIva(100) -> 121', () => esperar(m.conIva(100)).aSer(121));
  prueba('E5  noVacio("") -> false', () => esperar(noVacio('')).aSer(false));
  prueba('E5  noVacio("a") -> true', () => esperar(noVacio('a')).aSer(true));
  prueba('E6  aplicar(5, n => n*2) -> 10', () => esperar(m.aplicar(5, n => n * 2)).aSer(10));
  prueba('E7  filtrar(["", "a"]) -> ["a"]', () => esperar(m.filtrar(['', 'a'], t => t.length > 0)).aSer(['a']));
  prueba('E8  sumarTodos(1,2,3) -> 6', () => esperar(m.sumarTodos(1, 2, 3)).aSer(6));
  prueba('E8  sumarTodos() -> 0', () => esperar(m.sumarTodos()).aSer(0));
  prueba('E9  unir([a,b]) -> "a, b"', () => esperar(m.unir(['a', 'b'])).aSer('a, b'));
  prueba('E9  unir([a,b], "-") -> "a-b"', () => esperar(m.unir(['a', 'b'], '-')).aSer('a-b'));
  prueba('E10 presentar con ciudad', () => esperar(m.presentar({ nombre: 'Ana', edad: 30, ciudad: 'Lima' })).aSer('Ana (30) de Lima'));
  prueba('E10 presentar sin ciudad -> desconocida', () => esperar(m.presentar({ nombre: 'Luis', edad: 25 })).aSer('Luis (25) de desconocida'));
  prueba('E11 gritarAsync(hola) -> HOLA', async () => esperar(await m.gritarAsync('hola')).aSer('HOLA'));
  prueba('E12 dormir(20) espera de verdad', async () => {
    const inicio = Date.now();
    await m.dormir(20);
    esperar(Date.now() - inicio >= 15).aSer(true);
  });
  prueba('E13 nombresAsync -> [Ana]', async () => esperar(await m.nombresAsync([{ nombre: 'Ana', edad: 30 }])).aSer(['Ana']));
  prueba('E14 buscarPersona(Ana) la encuentra', () => esperar(m.buscarPersona('Ana')?.edad).aSer(30));
  prueba('E14 buscarPersona(Zoe) -> undefined', () => esperar(m.buscarPersona('Zoe') === undefined).aSer(true));
  prueba('E15 edadDe(Luis) -> 25', () => esperar(m.edadDe('Luis')).aSer(25));
  prueba('E15 edadDe(Zoe) -> 0', () => esperar(m.edadDe('Zoe')).aSer(0));
});
