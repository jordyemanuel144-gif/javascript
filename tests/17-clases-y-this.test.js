const { grupo, prueba, esperar, usar, pendiente } = require('../lib/mini-test');
const m = require('../03-js-a-fondo/17-clases-y-this');

// Devuelve el metodo solo si la clase lo define ella misma (no heredado).
const propio = (Clase, metodo) => Object.getOwnPropertyDescriptor(Clase.prototype, metodo)?.value;
// Construye ignorando que el ejercicio todavia no tenga constructor propio.
const nuevo = (Clase, ...args) => new Clase(...args);

grupo('TEMA 17 - Clases y this', () => {
  // 17.1
  prueba('E1  presentarse() usa this.nombre', () => esperar(m.crearPersona('Ana').presentarse()).aSer('Hola, soy Ana'));
  prueba('E2  crearContador().subir() cuenta 1, 2', () => {
    const c = m.crearContador();
    if (c.subir() === undefined) pendiente();
    const otro = m.crearContador();
    esperar([otro.subir(), otro.subir()]).aSer([1, 2]);
  });

  // 17.2
  prueba('E3  atado() funciona suelto', () => {
    const f = usar(m.atado(m.crearPersona('Ana')));
    esperar(f()).aSer('Hola, soy Ana');
  });

  // 17.3
  prueba('E4  listar() conserva el this', () => esperar(m.crearEquipo('Rojo', ['Ana', 'Luis']).listar()).aSer(['Ana (Rojo)', 'Luis (Rojo)']));

  // 17.4
  prueba('E5  new Rectangulo(3,4).area() -> 12', () => {
    const r = nuevo(m.Rectangulo, 3, 4);
    esperar(usar(propio(m.Rectangulo, 'area')).call(r)).aSer(12);
  });
  prueba('E6  Carrito suma 10 + 5 -> 15', () => {
    const c = nuevo(m.Carrito);
    usar(propio(m.Carrito, 'agregar')).call(c, 10);
    usar(propio(m.Carrito, 'agregar')).call(c, 5);
    esperar(usar(propio(m.Carrito, 'total')).call(c)).aSer(15);
  });
  prueba('E6  Carrito vacio -> total 0', () => {
    const c = nuevo(m.Carrito);
    esperar(usar(propio(m.Carrito, 'total')).call(c)).aSer(0);
  });

  // 17.5
  prueba('E7  new Circulo(5).diametro -> 10 (getter, sin parentesis)', () => {
    esperar(nuevo(m.Circulo, 5).diametro).aSer(10);
  });

  // 17.6
  prueba('E8  new Moto(Honda, 250).describir()', () => {
    const mt = nuevo(m.Moto, 'Honda', 250);
    esperar(usar(propio(m.Moto, 'describir')).call(mt)).aSer('Moto Honda de 250cc');
  });
  prueba('E8  Moto sigue siendo un Vehiculo', () => esperar(nuevo(m.Moto, 'Honda', 250) instanceof m.Vehiculo).aSer(true));

  // 17.7
  prueba('E9  esVehiculo(new Moto(...)) -> true', () => esperar(m.esVehiculo(nuevo(m.Moto, 'Honda', 250))).aSer(true));
  prueba('E9  esVehiculo({}) -> false', () => esperar(m.esVehiculo({})).aSer(false));
  prueba('E10 ErrorHttp guarda mensaje y codigo', () => {
    const e = nuevo(m.ErrorHttp, 'No existe', 404);
    if (e.codigo === undefined) pendiente();
    esperar({ msg: e.message, cod: e.codigo }).aSer({ msg: 'No existe', cod: 404 });
  });
  prueba('E10 ErrorHttp es un Error de verdad', () => esperar(nuevo(m.ErrorHttp, 'x', 1) instanceof Error).aSer(true));

  // 17.8
  prueba('E11 ApiCliente.url(/users)', () => {
    const api = nuevo(m.ApiCliente, 'https://x.com');
    esperar(usar(propio(m.ApiCliente, 'url')).call(api, '/users')).aSer('https://x.com/users');
  });
});
