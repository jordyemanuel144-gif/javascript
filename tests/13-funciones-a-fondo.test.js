const { grupo, prueba, esperar, usar, pendiente } = require('../lib/mini-test');
const m = require('../03-js-a-fondo/13-funciones-a-fondo');

grupo('TEMA 13 - Funciones a fondo', () => {
  // 13.1
  prueba('E1  doble(4) -> 8', () => esperar(usar(m.doble)(4)).aSer(8));
  prueba('E2  triple(3) -> 9', () => esperar(usar(m.triple)(3)).aSer(9));
  prueba('E3  cuadruple(2) -> 8', () => esperar(usar(m.cuadruple)(2)).aSer(8));

  // 13.2
  prueba('E4  mitad(10) -> 5', () => esperar(m.mitad(10)).aSer(5));
  prueba('E4  mitad esta escrita SIN llaves', () => {
    if (m.mitad(10) === undefined) pendiente();
    esperar(/=>\s*\{/.test(String(m.mitad))).aSer(false);
  });
  prueba('E5  mitadLarga(10) -> 5', () => esperar(m.mitadLarga(10)).aSer(5));
  prueba('E6  saludo() -> hola', () => esperar(m.saludo()).aSer('hola'));

  // 13.3
  prueba('E7  aObjeto(1, Ana) -> { id: 1, nombre: Ana }', () => esperar(m.aObjeto(1, 'Ana')).aSer({ id: 1, nombre: 'Ana' }));
  prueba('E8  conLargo([ab, c])', () => esperar(m.conLargo(['ab', 'c'])).aSer([{ texto: 'ab', largo: 2 }, { texto: 'c', largo: 1 }]));

  // 13.4
  prueba('E9  ejecutar(10, n => n / 2) -> 5', () => esperar(m.ejecutar(10, n => n / 2)).aSer(5));
  prueba('E10 dosVeces(3, n => n * 10) -> 300', () => esperar(m.dosVeces(3, n => n * 10)).aSer(300));
  prueba('E11 siAcaso(true) llama al callback', () => esperar(m.siAcaso(true, () => 'hola')).aSer('hola'));
  prueba('E11 siAcaso(false) -> null', () => esperar(m.siAcaso(false, () => 'hola')).aSer(null));
  prueba('E12 mapearAMano([1,2,3], +1) -> [2,3,4]', () => esperar(m.mapearAMano([1, 2, 3], n => n + 1)).aSer([2, 3, 4]));
  prueba('E12 mapearAMano no usa .map', () => {
    if (m.mapearAMano([1], n => n) === undefined) pendiente();
    esperar(/\.map\s*\(/.test(String(m.mapearAMano))).aSer(false);
  });

  // 13.5
  prueba('E13 crearSaludo()() -> hola', () => esperar(usar(m.crearSaludo())()).aSer('hola'));
  prueba('E14 sumador(5)(2) -> 7', () => esperar(usar(m.sumador(5))(2)).aSer(7));
  prueba('E15 envolver(**)(hola) -> **hola**', () => esperar(usar(m.envolver('**'))('hola')).aSer('**hola**'));

  // 13.6
  prueba('E16 crearSiete()() -> 7', () => esperar(usar(m.crearSiete())()).aSer(7));
  prueba('E17 crearContador cuenta 1, 2, 3', () => {
    const c = usar(m.crearContador());
    esperar([c(), c(), c()]).aSer([1, 2, 3]);
  });
  prueba('E17 cada contador es independiente', () => {
    const a = usar(m.crearContador());
    const b = usar(m.crearContador());
    a(); a();
    esperar(b()).aSer(1);
  });
  prueba('E18 crearAcumulador(10) luego (5) -> 15', () => {
    const a = usar(m.crearAcumulador());
    esperar([a(10), a(5)]).aSer([10, 15]);
  });

  // 13.7
  prueba('E19 agregarPuro([1,2], 3) -> [1,2,3]', () => esperar(m.agregarPuro([1, 2], 3)).aSer([1, 2, 3]));
  prueba('E19 agregarPuro NO muta el original', () => {
    const original = [1, 2];
    m.agregarPuro(original, 3);
    esperar(original).aSer([1, 2]);
  });
  prueba('E20 quitarPuro([1,2,3], 2) -> [1,3]', () => esperar(m.quitarPuro([1, 2, 3], 2)).aSer([1, 3]));
  prueba('E21 ordenarPuro([3,1,2]) -> [1,2,3]', () => esperar(m.ordenarPuro([3, 1, 2])).aSer([1, 2, 3]));
  prueba('E21 ordenarPuro NO muta el original', () => {
    const original = [3, 1, 2];
    m.ordenarPuro(original);
    esperar(original).aSer([3, 1, 2]);
  });
});
