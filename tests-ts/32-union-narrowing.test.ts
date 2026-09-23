import { grupo, prueba, esperar } from '../lib/mini-test';
import * as m from '../05-typescript/32-union-narrowing';

grupo('TEMA 32 - Uniones, literales y narrowing', () => {
  prueba('E2  idATexto(5) -> 5.00', () => esperar(m.idATexto(5)).aSer('5.00'));
  prueba('E2  idATexto("  ab ") -> ab', () => esperar(m.idATexto('  ab ')).aSer('ab'));
  prueba('E3  describir(null) -> nada', () => esperar(m.describir(null)).aSer('nada'));
  prueba('E3  describir(undefined) -> nada', () => esperar(m.describir(undefined)).aSer('nada'));
  prueba('E3  describir(5) -> numero 5', () => esperar(m.describir(5)).aSer('numero 5'));
  prueba('E3  describir(a) -> texto a', () => esperar(m.describir('a')).aSer('texto a'));
  prueba('E4  unir([a,b]) -> a-b', () => esperar(m.unir(['a', 'b'])).aSer('a-b'));
  prueba('E4  unir(abc) -> abc', () => esperar(m.unir('abc')).aSer('abc'));
  prueba('E5  mensajeDeError(Error) -> uy', () => esperar(m.mensajeDeError(new Error('uy'))).aSer('uy'));
  prueba('E5  mensajeDeError("x") -> error desconocido', () => esperar(m.mensajeDeError('x')).aSer('error desconocido'));
  prueba('E7  mostrar(cargando)', () => esperar(m.mostrar({ estado: 'cargando' })).aSer('Cargando...'));
  prueba('E7  mostrar(ok) une los datos', () => esperar(m.mostrar({ estado: 'ok', datos: ['a', 'b'] } as any)).aSer('a, b'));
  prueba('E7  mostrar(error) da el mensaje', () => esperar(m.mostrar({ estado: 'error', mensaje: 'uy' } as any)).aSer('uy'));
  prueba('E8  termino(cargando) -> false', () => esperar(m.termino({ estado: 'cargando' })).aSer(false));
  prueba('E8  termino(ok) -> true', () => esperar(m.termino({ estado: 'ok', datos: [] } as any)).aSer(true));
  prueba('E9  esNumero(5) -> true', () => esperar(m.esNumero(5)).aSer(true));
  prueba('E9  esNumero("5") -> false', () => esperar(m.esNumero('5')).aSer(false));
  prueba('E10 sinNulos([a,null,b]) -> [a,b]', () => esperar(m.sinNulos(['a', null, 'b'])).aSer(['a', 'b']));
  prueba('E11 sumarNumeros([1,a,2]) -> 3', () => esperar(m.sumarNumeros([1, 'a', 2])).aSer(3));
  prueba('E12 color(pendiente) -> gris', () => esperar(m.color('pendiente')).aSer('gris'));
  prueba('E12 color(enviado) -> azul', () => esperar(m.color('enviado')).aSer('azul'));
  prueba('E12 color(entregado) -> verde', () => esperar(m.color('entregado')).aSer('verde'));
});
