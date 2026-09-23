const { grupo, prueba, esperar, pendiente } = require('../lib/mini-test');
const m = require('../03-js-a-fondo/19-errores-y-excepciones');

// true si la funcion lanzo una excepcion
function lanza(fn) {
  try { fn(); return false; } catch { return true; }
}

grupo('TEMA 19 - Errores y excepciones', () => {
  // 19.1
  prueba('E1  parsearSeguro(json valido)', () => esperar(m.parsearSeguro('{"a":1}')).aSer({ a: 1 }));
  prueba('E1  parsearSeguro(roto) -> null', () => esperar(m.parsearSeguro('roto')).aSer(null));
  prueba('E2  intentar devuelve el resultado', () => esperar(m.intentar(() => 1 + 1, 0)).aSer(2));
  prueba('E2  intentar devuelve el respaldo si lanza', () => esperar(m.intentar(() => { throw new Error('x'); }, 0)).aSer(0));

  // 19.2
  prueba('E3  orden: try, catch, finally', () => {
    const r = m.ordenDeEjecucion();
    if (!r || r.length === 0) pendiente();
    esperar(r).aSer(['try', 'catch', 'finally']);
  });

  // 19.3
  prueba('E4  dividir(10, 2) -> 5', () => esperar(m.dividir(10, 2)).aSer(5));
  prueba('E4  dividir(1, 0) lanza Error', () => {
    if (m.dividir(10, 2) === undefined) pendiente();
    esperar(lanza(() => m.dividir(1, 0))).aSer(true);
  });
  prueba('E5  mensajeDeError con error -> uy', () => esperar(m.mensajeDeError(() => { throw new Error('uy'); })).aSer('uy'));
  prueba('E5  mensajeDeError sin error -> null', () => esperar(m.mensajeDeError(() => 1)).aSer(null));

  // 19.4
  prueba('E6  ErrorValidacion(email)', () => {
    const e = new m.ErrorValidacion('email');
    esperar(e.campo === undefined ? undefined : { campo: e.campo, message: e.message })
      .aSer({ campo: 'email', message: 'El campo email es obligatorio' });
  });
  prueba('E6  ErrorValidacion es un Error', () => esperar(new m.ErrorValidacion('x') instanceof Error).aSer(true));

  // 19.5
  prueba('E7  nombreSeguro con perfil -> Ana', () => esperar(m.nombreSeguro({ perfil: { nombre: 'Ana' } })).aSer('Ana'));
  prueba('E7  nombreSeguro(null) -> anonimo', () => esperar(m.nombreSeguro(null)).aSer('anónimo'));

  // 19.6
  prueba('E8  validarProducto valido', () => esperar(m.validarProducto({ nombre: 'a', precio: 1 })).aSer({ nombre: 'a', precio: 1, valido: true }));
  prueba('E8  validarProducto sin nombre lanza', () => {
    if (m.validarProducto({ nombre: 'a', precio: 1 }) === undefined) pendiente();
    esperar(lanza(() => m.validarProducto({ precio: 1 }))).aSer(true);
  });
  prueba('E8  validarProducto con precio negativo lanza', () => {
    if (m.validarProducto({ nombre: 'a', precio: 1 }) === undefined) pendiente();
    esperar(lanza(() => m.validarProducto({ nombre: 'a', precio: -5 }))).aSer(true);
  });

  // 19.7
  prueba('E9  conContexto agrega el contexto al mensaje', () => {
    if (m.conContexto(() => 7, 'x') === undefined) pendiente();
    let mensaje = null;
    try {
      m.conContexto(() => { throw new Error('timeout'); }, 'la carga');
    } catch (e) {
      mensaje = e.message;
    }
    esperar(mensaje).aSer('Falló la carga: timeout');
  });
  prueba('E9  conContexto deja pasar el valor si no falla', () => esperar(m.conContexto(() => 7, 'x')).aSer(7));
  prueba('E10 aResultado ok', () => esperar(m.aResultado(() => 5)).aSer({ ok: true, valor: 5 }));
  prueba('E10 aResultado con error', () => esperar(m.aResultado(() => { throw new Error('x'); })).aSer({ ok: false, error: 'x' }));
});
