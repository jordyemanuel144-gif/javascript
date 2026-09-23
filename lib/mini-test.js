// Mini framework de tests. No necesitas tocar este archivo.
const estado = { grupos: [], grupoActual: null, enCurso: [] };

function grupo(nombre, fn) {
  estado.grupoActual = { nombre, pruebas: [] };
  estado.grupos.push(estado.grupoActual);
  fn();
  estado.grupoActual = null;
}

function anotarError(p, error) {
  if (error && error.pendiente) {
    p.estado = 'pendiente';
  } else {
    p.estado = 'fallo';
    p.detalle = (error && error.message) || String(error);
  }
}

// Acepta funciones normales y funciones async. Si la prueba devuelve una
// promesa, se guarda en estado.enCurso y el corrector la espera antes de
// imprimir el resumen.
function prueba(descripcion, fn) {
  const p = { descripcion, estado: 'ok', detalle: '' };
  estado.grupoActual.pruebas.push(p);
  try {
    const resultado = fn();
    if (resultado && typeof resultado.then === 'function') {
      estado.enCurso.push(
        Promise.resolve(resultado).catch(error => anotarError(p, error))
      );
    }
  } catch (error) {
    anotarError(p, error);
  }
}

function mostrar(valor) {
  if (typeof valor === 'string') return JSON.stringify(valor);
  if (Array.isArray(valor) || (valor && typeof valor === 'object')) return JSON.stringify(valor);
  return String(valor);
}

function esObjetoPlano(v) {
  return v !== null && typeof v === 'object' && !Array.isArray(v);
}

function iguales(a, b) {
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((v, i) => iguales(v, b[i]));
  }
  if (esObjetoPlano(a) && esObjetoPlano(b)) {
    const ka = Object.keys(a);
    const kb = Object.keys(b);
    return ka.length === kb.length && ka.every(k => iguales(a[k], b[k]));
  }
  return Object.is(a, b);
}

// Para ejercicios que empiezan como  const x = undefined;
// Si todavia no es una funcion, la prueba queda PENDIENTE en vez de fallar.
// Si es una funcion pero el cuerpo esta vacio (solo el // TODO), tambien.
function usar(valor) {
  if (typeof valor !== 'function') throw { pendiente: true };
  if (cuerpoVacio(valor)) throw { pendiente: true };
  return valor;
}

// true si la funcion no tiene ninguna instruccion: solo comentarios y espacios.
// Sirve para los ejercicios que mutan o imprimen y no devuelven nada.
function cuerpoVacio(fn) {
  const src = String(fn);
  const abre = src.indexOf('{');
  const cierra = src.lastIndexOf('}');
  if (abre === -1 || cierra <= abre) return false; // flecha con retorno implicito
  const cuerpo = src
    .slice(abre + 1, cierra)
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/[^\n]*/g, '')
    .trim();
  return cuerpo === '';
}

// Se llama DESDE el ejercicio sin resolver: `return falta();`
// Hace que la prueba salga como PENDIENTE en vez de fallar, y de paso deja
// contento a TypeScript (su tipo es `never`).
function falta() {
  throw { pendiente: true };
}

// Marca la prueba como PENDIENTE a mano (para ejercicios que no devuelven nada).
function pendiente() {
  throw { pendiente: true };
}

function esperar(actual) {
  return {
    aSer(esperado) {
      if (actual === undefined && esperado !== undefined) {
        throw { pendiente: true };
      }
      if (!iguales(actual, esperado)) {
        throw new Error(`esperaba ${mostrar(esperado)} pero recibi ${mostrar(actual)}`);
      }
    },
    cumple(fn, mensaje) {
      if (actual === undefined) throw { pendiente: true };
      if (!fn(actual)) throw new Error(`${mensaje} (recibi ${mostrar(actual)})`);
    }
  };
}

module.exports = { grupo, prueba, esperar, usar, cuerpoVacio, pendiente, falta, estado };
