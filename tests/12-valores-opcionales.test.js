const { grupo, prueba, esperar } = require('../lib/mini-test');
const m = require('../02-sintaxis/12-valores-opcionales');

grupo('TEMA 12 - Valores opcionales', () => {
  prueba('ciudadDe con direccion -> Lima', () => esperar(m.ciudadDe({ direccion: { ciudad: 'Lima' } })).aSer('Lima'));
  prueba('ciudadDe({}) no revienta', () => {
    let exploto = false;
    try { m.ciudadDe({}); } catch (e) { exploto = true; }
    esperar(exploto).aSer(false);
  });
  prueba('nombreODefecto(Ana) -> Ana', () => esperar(m.nombreODefecto('Ana')).aSer('Ana'));
  prueba('nombreODefecto(null) -> invitado', () => esperar(m.nombreODefecto(null)).aSer('invitado'));
  prueba('cantidadO10(5) -> 5', () => esperar(m.cantidadO10(5)).aSer(5));
  prueba('cantidadO10(0) -> 0  (aqui falla si usas ||)', () => esperar(m.cantidadO10(0)).aSer(0));
  prueba('cantidadO10(undefined) -> 10', () => esperar(m.cantidadO10(undefined)).aSer(10));
  prueba('saludar(Ana) -> Hola, Ana', () => esperar(m.saludar('Ana')).aSer('Hola, Ana'));
  prueba('saludar(Ana, Buenas) -> Buenas, Ana', () => esperar(m.saludar('Ana', 'Buenas')).aSer('Buenas, Ana'));
  prueba('empresaDe con trabajo -> ACME', () => esperar(m.empresaDe({ trabajo: { empresa: 'Acme' } })).aSer('ACME'));
  prueba('empresaDe({}) -> SIN EMPRESA', () => esperar(m.empresaDe({})).aSer('SIN EMPRESA'));
  prueba('primerNombre([{nombre:Ana}]) -> Ana', () => esperar(m.primerNombre([{ nombre: 'Ana' }])).aSer('Ana'));
  prueba('primerNombre([]) no revienta', () => {
    let exploto = false;
    try { m.primerNombre([]); } catch (e) { exploto = true; }
    esperar(exploto).aSer(false);
  });
});
