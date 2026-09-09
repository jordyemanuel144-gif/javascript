const { grupo, prueba, esperar } = require('../lib/mini-test');
const m = require('../02-sintaxis/09-desestructuracion');

grupo('TEMA 09 - Desestructuracion', () => {
  prueba('presentar({ nombre: Ana, edad: 30 })', () => esperar(m.presentar({ nombre: 'Ana', edad: 30 })).aSer('Ana tiene 30'));
  prueba('presentar usa desestructuracion', () => {
    const codigo = m.presentar.toString();
    esperar(/const\s*\{/.test(codigo) || /let\s*\{/.test(codigo)).aSer(true);
  });
  prueba('presentarCorto({ nombre: Luis, edad: 25 })', () => esperar(m.presentarCorto({ nombre: 'Luis', edad: 25 })).aSer('Luis tiene 25'));
  prueba('presentarCorto desestructura en el parametro', () => {
    const firma = m.presentarCorto.toString().split(')')[0];
    esperar(firma.includes('{')).aSer(true);
  });
  prueba('tituloEnMayusculas({ titulo: hola }) -> HOLA', () => esperar(m.tituloEnMayusculas({ titulo: 'hola' })).aSer('HOLA'));
  prueba('colorDe({ color: rojo }) -> rojo', () => esperar(m.colorDe({ color: 'rojo' })).aSer('rojo'));
  prueba('colorDe({}) -> azul', () => esperar(m.colorDe({})).aSer('azul'));
  prueba('primeroYTercero([a, b, c]) -> a-c', () => esperar(m.primeroYTercero(['a', 'b', 'c'])).aSer('a-c'));
  prueba('Boton({ texto: Enviar, color: verde })', () => esperar(m.Boton({ texto: 'Enviar', color: 'verde' })).aSer('[verde] Enviar'));
  prueba('Boton({ texto: Enviar }) usa color por defecto', () => esperar(m.Boton({ texto: 'Enviar' })).aSer('[gris] Enviar'));
});
