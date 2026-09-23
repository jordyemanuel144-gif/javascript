/* ============================================================================
   API FALSA — un servidor de mentira que vive en memoria.
   No necesitas tocar este archivo.

   Sirve para practicar `fetch` sin internet y sin montar un backend. Responde
   igual que un servidor de verdad: devuelve un objeto Response con .ok,
   .status y .json(), y respeta los métodos GET / POST / PUT / DELETE.

   Rutas disponibles:
     GET    /api/usuarios          -> 200  [ {id, nombre, email}, ... ]
     GET    /api/usuarios/:id      -> 200  {id, nombre, email}   |  404
     POST   /api/usuarios          -> 201  el usuario creado (con id nuevo)
     PUT    /api/usuarios/:id      -> 200  el usuario actualizado |  404
     DELETE /api/usuarios/:id      -> 204  sin cuerpo             |  404
     GET    /api/lento             -> 200  { ok: true }  (tarda 60 ms)
     GET    /api/error             -> 500  { mensaje: 'Error del servidor' }
     GET    /api/texto             -> 200  texto plano "hola"
     cualquier otra                -> 404  { mensaje: 'Ruta no encontrada' }
   ============================================================================ */

const dormir = (ms) => new Promise(r => setTimeout(r, ms));

function estadoInicial() {
  return [
    { id: 1, nombre: 'Ana', email: 'ana@mail.com' },
    { id: 2, nombre: 'Luis', email: 'luis@mail.com' },
    { id: 3, nombre: 'Eva', email: null },
  ];
}

let usuarios = estadoInicial();

// Deja la base como estaba (lo usan los tests entre pruebas).
function reiniciar() {
  usuarios = estadoInicial();
}

function respuesta(status, cuerpo, { texto = false } = {}) {
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? 'OK' : String(status),
    headers: {
      get: (h) => (String(h).toLowerCase() === 'content-type'
        ? (texto ? 'text/plain' : 'application/json')
        : null),
    },
    async json() {
      if (cuerpo === undefined) throw new SyntaxError('Unexpected end of JSON input');
      return JSON.parse(JSON.stringify(cuerpo));
    },
    async text() {
      return texto ? String(cuerpo) : JSON.stringify(cuerpo);
    },
  };
}

// Misma firma que el fetch del navegador.
async function fetchFalso(url, opciones = {}) {
  const metodo = (opciones.method || 'GET').toUpperCase();
  const ruta = String(url).split('?')[0];
  const cuerpo = opciones.body ? JSON.parse(opciones.body) : null;

  await dormir(5); // siempre tarda algo, como la red de verdad

  if (ruta === '/api/lento') {
    await dormir(60);
    return respuesta(200, { ok: true });
  }
  if (ruta === '/api/error') return respuesta(500, { mensaje: 'Error del servidor' });
  if (ruta === '/api/texto') return respuesta(200, 'hola', { texto: true });

  if (ruta === '/api/usuarios') {
    if (metodo === 'GET') return respuesta(200, usuarios);
    if (metodo === 'POST') {
      const nuevo = { id: Math.max(0, ...usuarios.map(u => u.id)) + 1, ...cuerpo };
      usuarios.push(nuevo);
      return respuesta(201, nuevo);
    }
  }

  const m = ruta.match(/^\/api\/usuarios\/(\d+)$/);
  if (m) {
    const id = Number(m[1]);
    const i = usuarios.findIndex(u => u.id === id);
    if (i === -1) return respuesta(404, { mensaje: 'No encontrado' });
    if (metodo === 'GET') return respuesta(200, usuarios[i]);
    if (metodo === 'PUT') {
      usuarios[i] = { ...usuarios[i], ...cuerpo };
      return respuesta(200, usuarios[i]);
    }
    if (metodo === 'DELETE') {
      usuarios.splice(i, 1);
      return respuesta(204, undefined);
    }
  }

  return respuesta(404, { mensaje: 'Ruta no encontrada' });
}

module.exports = { fetchFalso, reiniciar };
