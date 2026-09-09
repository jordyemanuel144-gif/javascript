const { grupo, prueba, esperar, usar } = require('../lib/mini-test');
const m = require('../02-sintaxis/07-funciones-flecha');

// Saca el nombre del parametro de una flecha de un solo parametro.
const nombreParam = (f) => f.toString().split('=>')[0].replace(/[()\s]/g, '');

grupo('TEMA 07 - Funciones flecha (forma)', () => {
  prueba('restar(10, 4) -> 6', () => esperar(usar(m.restar)(10, 4)).aSer(6));
  prueba('restar es una funcion flecha', () => {
    esperar(usar(m.restar).toString().includes('=>')).aSer(true);
  });
  prueba('multiplicar(3, 4) -> 12', () => esperar(usar(m.multiplicar)(3, 4)).aSer(12));
  prueba('multiplicar en forma corta (sin return)', () => {
    esperar(usar(m.multiplicar).toString().includes('return')).aSer(false);
  });
  prueba('alCuadrado(5) -> 25', () => esperar(usar(m.alCuadrado)(5)).aSer(25));
  prueba('holaMundo() -> hola mundo', () => esperar(usar(m.holaMundo)()).aSer('hola mundo'));
  prueba('crearUsuario(Ana, 30) -> objeto', () => {
    esperar(usar(m.crearUsuario)('Ana', 30)).aSer({ nombre: 'Ana', edad: 30 });
  });
  prueba('crearUsuario(Luis, 25) -> objeto (no esta clavado)', () => {
    esperar(usar(m.crearUsuario)('Luis', 25)).aSer({ nombre: 'Luis', edad: 25 });
  });
  prueba('triplicarTodos([1, 2]) -> [3, 6]', () => esperar(m.triplicarTodos([1, 2])).aSer([3, 6]));
  prueba('triplicarTodos([]) -> []', () => esperar(m.triplicarTodos([])).aSer([]));
});

grupo('TEMA 07 - Funciones flecha (parametros)', () => {
  prueba('dias(Ana) -> Buenos dias, Ana', () => esperar(usar(m.dias)('Ana')).aSer('Buenos dias, Ana'));
  prueba('dias(Luis) -> Buenos dias, Luis  (no esta clavado)', () => esperar(usar(m.dias)('Luis')).aSer('Buenos dias, Luis'));

  prueba('juntar(hola, mundo) -> hola mundo', () => esperar(usar(m.juntar)('hola', 'mundo')).aSer('hola mundo'));
  prueba('juntar(mundo, hola) -> mundo hola  (el orden importa)', () => esperar(usar(m.juntar)('mundo', 'hola')).aSer('mundo hola'));

  prueba('sumarConsigoMismo(7) -> 14', () => esperar(usar(m.sumarConsigoMismo)(7)).aSer(14));
  prueba('sumarConsigoMismo(0) -> 0', () => esperar(usar(m.sumarConsigoMismo)(0)).aSer(0));

  prueba('respuesta() -> 42', () => esperar(usar(m.respuesta)()).aSer(42));
  prueba('respuesta no recibe parametros', () => esperar(usar(m.respuesta).length).aSer(0));

  prueba('sumarTres(1, 2, 3) -> 6', () => esperar(usar(m.sumarTres)(1, 2, 3)).aSer(6));
  prueba('sumarTres(10, 20, 30) -> 60', () => esperar(usar(m.sumarTres)(10, 20, 30)).aSer(60));

  prueba('voltear(a, b) -> [b, a]', () => esperar(usar(m.voltear)('a', 'b')).aSer(['b', 'a']));
  prueba('voltear(1, 2) -> [2, 1]', () => esperar(usar(m.voltear)(1, 2)).aSer([2, 1]));

  prueba('calcularArea(2) -> 12.56', () => esperar(usar(m.calcularArea)(2)).aSer(12.56));
  prueba('calcularArea(1) -> 3.14', () => esperar(usar(m.calcularArea)(1)).aSer(3.14));
  prueba('calcularArea LLAMA a areaCirculo', () => {
    esperar(usar(m.calcularArea).toString().includes('areaCirculo')).aSer(true);
  });

  prueba('tripleA(5) -> 15', () => esperar(usar(m.tripleA)(5)).aSer(15));
  prueba('tripleB(5) -> 15', () => esperar(usar(m.tripleB)(5)).aSer(15));
  prueba('tripleB(4) -> 12', () => esperar(usar(m.tripleB)(4)).aSer(12));
  prueba('tripleA y tripleB usan nombres de parametro distintos', () => {
    const a = nombreParam(usar(m.tripleA));
    const b = nombreParam(usar(m.tripleB));
    esperar(a !== b).cumple(v => v === true, `los dos se llaman "${a}"`);
  });

  prueba('hacer(Luis, 25) -> objeto', () => esperar(usar(m.hacer)('Luis', 25)).aSer({ nombre: 'Luis', edad: 25 }));
  prueba('hacer(Ana, 30) -> objeto  (no esta clavado)', () => esperar(usar(m.hacer)('Ana', 30)).aSer({ nombre: 'Ana', edad: 30 }));
  prueba('hacer devuelve la edad como NUMERO, no texto', () => {
    esperar(typeof usar(m.hacer)('Ana', 30).edad).aSer('number');
  });
});
