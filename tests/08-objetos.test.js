const { grupo, prueba, esperar } = require('../lib/mini-test');
const m = require('../02-sintaxis/08-objetos');

grupo('TEMA 08 - Objetos', () => {
  prueba('hacerPersona(Ana, 30)', () => esperar(m.hacerPersona('Ana', 30)).aSer({ nombre: 'Ana', edad: 30 }));
  prueba('hacerPersonaCorto(Luis, 25)', () => esperar(m.hacerPersonaCorto('Luis', 25)).aSer({ nombre: 'Luis', edad: 25 }));
  prueba('hacerPersonaCorto usa shorthand', () => {
    const codigo = m.hacerPersonaCorto.toString().replace(/\s/g, '');
    esperar(codigo.includes('nombre:nombre')).aSer(false);
  });
  prueba('leerCiudad({ ciudad: Lima }) -> Lima', () => esperar(m.leerCiudad({ ciudad: 'Lima' })).aSer('Lima'));
  prueba('leerCampo({ edad: 30 }, edad) -> 30', () => esperar(m.leerCampo({ edad: 30 }, 'edad')).aSer(30));
  prueba('leerCampo({ a: 1 }, a) -> 1', () => esperar(m.leerCampo({ a: 1 }, 'a')).aSer(1));
  prueba('activar agrega activo: true', () => esperar(m.activar({ nombre: 'Ana' })).aSer({ nombre: 'Ana', activo: true }));
  prueba('nombresDeCampos({ a: 1, b: 2 }) -> [a, b]', () => esperar(m.nombresDeCampos({ a: 1, b: 2 })).aSer(['a', 'b']));
  prueba('nombresDeCampos({}) -> []', () => esperar(m.nombresDeCampos({})).aSer([]));
});
