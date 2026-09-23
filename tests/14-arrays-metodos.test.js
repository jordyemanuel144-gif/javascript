const { grupo, prueba, esperar, usar } = require('../lib/mini-test');
const m = require('../03-js-a-fondo/14-arrays-metodos');

// Cada prueba recibe una COPIA nueva de los datos. Asi, si un ejercicio muta
// el array por error, solo falla ESE ejercicio y no contamina a los demas.
const datos = () => [
  { id: 1, nombre: 'Teclado', precio: 120, stock: 10, categoria: 'perifericos' },
  { id: 2, nombre: 'Mouse', precio: 80, stock: 0, categoria: 'perifericos' },
  { id: 3, nombre: 'Monitor', precio: 900, stock: 4, categoria: 'pantallas' },
  { id: 4, nombre: 'Notebook', precio: 3500, stock: 2, categoria: 'computos' },
];

grupo('TEMA 14 - Metodos de array', () => {
  // 14.1
  prueba('E1  cuadrados([1,2,3]) -> [1,4,9]', () => esperar(m.cuadrados([1, 2, 3])).aSer([1, 4, 9]));
  prueba('E2  nombresMayus', () => esperar(m.nombresMayus(datos())).aSer(['TECLADO', 'MOUSE', 'MONITOR', 'NOTEBOOK']));
  prueba('E3  numerados([Teclado, Mouse]) <- llegan TEXTOS, no objetos', () => esperar(m.numerados(['Teclado', 'Mouse'])).aSer(['1. Teclado', '2. Mouse']));

  // 14.2
  prueba('E4  llenar mete los nombres en el array destino', () => {
    const salida = [];
    usar(m.llenar)(['a', 'b'], salida);
    esperar(salida).aSer(['a', 'b']);
  });

  // 14.3
  prueba('E5  pares([1,2,3,4]) -> [2,4]', () => esperar(m.pares([1, 2, 3, 4])).aSer([2, 4]));
  prueba('E6  conStock -> ids 1, 3, 4', () => esperar(m.conStock(datos())?.map(p => p.id)).aSer([1, 3, 4]));

  // 14.4
  prueba('E7  porId(3) -> Monitor', () => esperar(m.porId(datos(), 3)?.nombre).aSer('Monitor'));
  prueba('E7  porId(99) -> undefined', () => esperar(m.porId(datos(), 99) === undefined).aSer(true));
  prueba('E8  posicionDe(Monitor) -> 2', () => esperar(m.posicionDe(datos(), 'Monitor')).aSer(2));
  prueba('E8  posicionDe(Nada) -> -1', () => esperar(m.posicionDe(datos(), 'Nada')).aSer(-1));

  // 14.5
  prueba('E9  esAdmin([user, admin]) -> true', () => esperar(m.esAdmin(['user', 'admin'])).aSer(true));
  prueba('E9  esAdmin([user]) -> false', () => esperar(m.esAdmin(['user'])).aSer(false));

  // 14.6
  prueba('E10 hayAgotados -> true', () => esperar(m.hayAgotados(datos())).aSer(true));
  prueba('E11 todosBaratos -> true', () => esperar(m.todosBaratos(datos())).aSer(true));

  // 14.7
  prueba('E12 ordenarAsc([3,1,2]) -> [1,2,3]', () => esperar(m.ordenarAsc([3, 1, 2])).aSer([1, 2, 3]));
  prueba('E13 ordenarDesc([1,5,3]) -> [5,3,1]  (de MAYOR a menor)', () => esperar(m.ordenarDesc([1, 5, 3])).aSer([5, 3, 1]));
  prueba('E13 ordenarDesc NO muta el array que recibe', () => {
    const o = [1, 5, 3];
    m.ordenarDesc(o);
    esperar(o).aSer([1, 5, 3]);
  });
  prueba('E14 porPrecio -> Mouse, Teclado, Monitor, Notebook', () => esperar(m.porPrecio(datos())?.map(p => p.nombre)).aSer(['Mouse', 'Teclado', 'Monitor', 'Notebook']));
  prueba('E14 porPrecio NO muta el array que recibe', () => {
    const o = datos();
    m.porPrecio(o);
    esperar(o.map(p => p.id)).aSer([1, 2, 3, 4]);
  });
  prueba('E15 alfabetico <- llegan TEXTOS, no objetos', () => esperar(m.alfabetico(['Mouse', 'Teclado', 'Monitor'])).aSer(['Monitor', 'Mouse', 'Teclado']));
  prueba('E15 alfabetico NO muta el array que recibe', () => {
    const o = ['Mouse', 'Teclado', 'Monitor'];
    m.alfabetico(o);
    esperar(o).aSer(['Mouse', 'Teclado', 'Monitor']);
  });

  // 14.8
  prueba('E16 sumar([1,2,3]) -> 6', () => esperar(m.sumar([1, 2, 3])).aSer(6));
  prueba('E16 sumar([]) -> 0', () => esperar(m.sumar([])).aSer(0));
  prueba('E17 juntar([ho, la]) -> hola', () => esperar(m.juntar(['ho', 'la'])).aSer('hola'));
  prueba('E17 juntar([]) -> cadena vacia', () => esperar(m.juntar([])).aSer(''));
  prueba('E18 totalInventario -> 11800', () => esperar(m.totalInventario(datos())).aSer(11800));
  prueba('E19 contarPorCategoria', () => esperar(m.contarPorCategoria(datos())).aSer({ perifericos: 2, pantallas: 1, computos: 1 }));

  // 14.9
  prueba('E20 primeros3([1,2,3,4,5])', () => esperar(m.primeros3([1, 2, 3, 4, 5])).aSer([1, 2, 3]));
  prueba('E21 listarNombres (separador punto medio)', () => esperar(m.listarNombres(datos())).aSer('Teclado · Mouse · Monitor · Notebook'));
  prueba('E22 sinRepetidos([1,2,2,3,1])', () => esperar(m.sinRepetidos([1, 2, 2, 3, 1])).aSer([1, 2, 3]));

  // 14.10
  prueba('E23 nombresCaros -> Monitor, Notebook', () => esperar(m.nombresCaros(datos())).aSer(['Monitor', 'Notebook']));
  prueba('E24 disponiblesOrdenados', () => esperar(m.disponiblesOrdenados(datos())).aSer(['Monitor', 'Notebook', 'Teclado']));
  prueba('E25 deCategoria(pantallas) agrega caro', () => esperar(m.deCategoria(datos(), 'pantallas')).aSer([{ id: 3, nombre: 'Monitor', precio: 900, stock: 4, categoria: 'pantallas', caro: true }]));
  prueba('E25 deCategoria NO toca los objetos originales', () => {
    const o = datos();
    m.deCategoria(o, 'pantallas');
    esperar(o[2].caro === undefined).aSer(true);
  });
});
