import { grupo, prueba, esperar, pendiente } from '../lib/mini-test';
import * as m from '../05-typescript/36-clases-e-interfaces';

// Mientras el ejercicio no tenga constructor propio, TS se quejaria de los
// argumentos: por eso aqui se construyen con `as any`.
const nuevo = (Clase: any, ...args: any[]) => new Clase(...args);

grupo('TEMA 36 - Clases e interfaces en TS', () => {
  prueba('E1  new Rectangulo(3,4).area() -> 12', () => {
    esperar(nuevo(m.Rectangulo, 3, 4).area()).aSer(12);
  });
  prueba('E2  Contador sube y expone valor', () => {
    const c = nuevo(m.Contador);
    c.subir();
    c.subir();
    esperar(c.valor).aSer(2);
  });
  prueba('E2  el campo n es privado (no esta en la interfaz publica)', () => {
    const c = nuevo(m.Contador);
    if (c.valor === undefined) pendiente();
    esperar(typeof c.subir).aSer('function');
  });
  prueba('E3  new Circulo(2).area() -> 12.57', () => {
    esperar(nuevo(m.Circulo, 2).area()).aSer(12.57);
  });
  prueba('E3  new Circulo(2).nombre() -> circulo', () => {
    esperar(nuevo(m.Circulo, 2).nombre()).aSer('círculo');
  });
  prueba('E4  areaTotal suma las areas', () => {
    const figuras = [
      { area: () => 10, nombre: () => 'a' },
      { area: () => 5, nombre: () => 'b' },
    ];
    esperar(m.areaTotal(figuras)).aSer(15);
  });
  prueba('E5  new Moto(Honda).describir()', () => {
    esperar(nuevo(m.Moto, 'Honda').describir()).aSer('Honda (2 ruedas)');
  });
  prueba('E6  new Auto(Toyota, 5).describir()', () => {
    esperar(nuevo(m.Auto, 'Toyota', 5).describir()).aSer('Toyota (4 ruedas)');
  });
  prueba('E6  Auto guarda las puertas', () => {
    const a = nuevo(m.Auto, 'Toyota', 5);
    if (a.puertas === undefined) pendiente();
    esperar(a.puertas).aSer(5);
  });
  prueba('E7  ErrorHttp guarda mensaje y codigo', () => {
    const e = nuevo(m.ErrorHttp, 'No existe', 404);
    if (e.codigo === undefined) pendiente();
    esperar({ msg: e.message, cod: e.codigo }).aSer({ msg: 'No existe', cod: 404 });
  });
  prueba('E7  ErrorHttp es un Error', () => esperar(nuevo(m.ErrorHttp, 'x', 1) instanceof Error).aSer(true));
  prueba('E8  textoDeError con 404', () => {
    const e = nuevo(m.ErrorHttp, 'x', 404);
    if (e.codigo === undefined) pendiente();
    esperar(m.textoDeError(e)).aSer('No encontrado');
  });
  prueba('E8  textoDeError con otro codigo', () => {
    const e = nuevo(m.ErrorHttp, 'x', 500);
    if (e.codigo === undefined) pendiente();
    esperar(m.textoDeError(e)).aSer('Error 500');
  });
  prueba('E8  textoDeError con Error normal', () => esperar(m.textoDeError(new Error('uy'))).aSer('uy'));
  prueba('E8  textoDeError con cualquier cosa', () => esperar(m.textoDeError('texto suelto')).aSer('Error desconocido'));
  prueba('E9  ApiCliente.url(/usuarios)', () => {
    esperar(nuevo(m.ApiCliente, '/api').url('/usuarios')).aSer('/api/usuarios');
  });
});
