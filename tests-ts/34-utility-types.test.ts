import { grupo, prueba, esperar } from '../lib/mini-test';
import * as m from '../05-typescript/34-utility-types';

const u: m.Usuario = { id: 1, nombre: 'Ana', email: 'a@b.c', activo: true };

grupo('TEMA 34 - Utility types', () => {
  prueba('E4  actualizar cambia solo lo indicado', () => {
    esperar(m.actualizar(u, { nombre: 'Eva' } as any)).aSer({ id: 1, nombre: 'Eva', email: 'a@b.c', activo: true });
  });
  prueba('E4  actualizar NO muta el original', () => {
    m.actualizar(u, { nombre: 'Eva' } as any);
    esperar(u.nombre).aSer('Ana');
  });
  prueba('E5  aFila deja solo id y nombre', () => esperar(m.aFila(u) as any).aSer({ id: 1, nombre: 'Ana' } as any));
  prueba('E7  colorDeNivel(bajo) -> verde', () => esperar(m.colorDeNivel('bajo')).aSer('verde'));
  prueba('E7  colorDeNivel(medio) -> amarillo', () => esperar(m.colorDeNivel('medio')).aSer('amarillo'));
  prueba('E7  colorDeNivel(alto) -> rojo', () => esperar(m.colorDeNivel('alto')).aSer('rojo'));
  prueba('E8  indexar por id', () => {
    const r = m.indexar([u, { id: 2, nombre: 'Luis', email: null as any, activo: false }]);
    esperar(r?.[2]?.nombre).aSer('Luis');
  });
  prueba('E13 enMayusculas(bajo) -> BAJO', () => esperar(m.enMayusculas('bajo') as string).aSer('BAJO'));
  prueba('E13 enMayusculas(alto) -> ALTO', () => esperar(m.enMayusculas('alto') as string).aSer('ALTO'));
});
