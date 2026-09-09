// Mini framework de tests. No necesitas tocar este archivo.
const estado = { grupos: [], grupoActual: null };

function grupo(nombre, fn) {
  estado.grupoActual = { nombre, pruebas: [] };
  estado.grupos.push(estado.grupoActual);
  fn();
  estado.grupoActual = null;
}

function prueba(descripcion, fn) {
  const p = { descripcion, estado: 'ok', detalle: '' };
  try {
    fn();
  } catch (error) {
    if (error && error.pendiente) {
      p.estado = 'pendiente';
    } else {
      p.estado = 'fallo';
      p.detalle = error.message;
    }
  }
  estado.grupoActual.pruebas.push(p);
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
function usar(valor) {
  if (typeof valor !== 'function') throw { pendiente: true };
  return valor;
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

module.exports = { grupo, prueba, esperar, usar, estado };
