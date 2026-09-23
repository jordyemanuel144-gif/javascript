/* ============================================================================
   25 · fetch Y APIs REST
   Nivel 4 · JavaScript asíncrono
   ----------------------------------------------------------------------------
   Así habla tu app con el servidor. Todo lo demás (Pinia, tablas, formularios)
   gira alrededor de esto.

   Para que puedas practicar sin internet, este archivo usa una API falsa que
   responde EXACTAMENTE igual que un servidor real. La línea de abajo hace que
   `fetch` apunte a ella: en tu proyecto no existe, ahí `fetch` ya es global.
   Corrige con:   node verificar.js 25
   ============================================================================ */

const { fetchFalso } = require('../lib/api-falsa');
const fetch = fetchFalso;   // <- en el proyecto real: borra esta línea y listo


/* ############################################################################
   25.1  LA FORMA BÁSICA: dos await
   ############################################################################

     const respuesta = await fetch('/api/usuarios');   // 1) llega la respuesta
     const datos     = await respuesta.json();         // 2) se lee el cuerpo

   Sí, son DOS await. El primero espera a que el servidor conteste; el segundo
   espera a leer y convertir el cuerpo.

   El objeto `respuesta` trae:
     respuesta.ok        // true si el status es 200-299
     respuesta.status    // 200, 201, 404, 500...
     respuesta.json()    // promesa con el cuerpo convertido a objeto
     respuesta.text()    // promesa con el cuerpo como texto

   ⚠⚠ LA TRAMPA MÁS IMPORTANTE DE fetch:
     un 404 o un 500 NO lanzan error. La promesa se cumple igual. Si no
     revisas `respuesta.ok`, vas a terminar haciendo `.map` sobre un
     `{ mensaje: 'No encontrado' }` y el error saldrá tres pantallas después.

     if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);

     (axios, en cambio, sí lanza solo. Por eso muchos proyectos lo prefieren.)

   EJEMPLO --------------------------------------------------------------------
     const r = await fetch('/api/usuarios');
     r.ok;                      // true
     r.status;                  // 200
     const usuarios = await r.json();
     usuarios.length;           // 3
   -------------------------------------------------------------------------- */

// E1. Trae la lista de usuarios de '/api/usuarios' y devuélvela.
// traerUsuarios() -> [ {id:1, nombre:'Ana', ...}, ... ]
async function traerUsuarios() {
  // TODO: dos await
}

// E2. Devuelve el STATUS de la respuesta (sin leer el cuerpo).
// statusDe('/api/error') -> 500
async function statusDe(url) {
  // TODO
}

// E3. Trae un usuario por id. Si la respuesta NO es ok, lanza
// Error(`HTTP ${status}`).
// traerUsuario(1)  -> { id: 1, nombre: 'Ana', ... }
// traerUsuario(99) -> lanza Error("HTTP 404")
async function traerUsuario(id) {
  // TODO: revisa respuesta.ok ANTES de hacer .json()
}



/* ############################################################################
   25.2  MANDAR DATOS: POST, PUT, DELETE
   ############################################################################

     await fetch('/api/usuarios', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ nombre: 'Ana' }),
     });

   Las tres cosas que nunca hay que olvidar en un POST:
     1. `method`
     2. el header `Content-Type: application/json`
     3. `JSON.stringify(...)` en el body   <- el body va como TEXTO, no objeto

   Si mandas el objeto sin stringify, el servidor recibe "[object Object]".

   Los verbos y qué significan:
     GET     traer          (no lleva body)
     POST    crear          -> responde 201 con el objeto creado
     PUT     reemplazar     -> responde 200
     PATCH   editar campos  -> responde 200
     DELETE  borrar         -> responde 204 SIN CUERPO

   ⚠ Un 204 no tiene cuerpo: si haces `.json()` revienta. Revisa el status.

   Con token de autenticación:
     headers: {
       'Content-Type': 'application/json',
       'Authorization': `Bearer ${token}`,
     }

   EJEMPLO --------------------------------------------------------------------
     const r = await fetch('/api/usuarios', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ nombre: 'Nuevo', email: 'n@mail.com' }),
     });
     r.status;                  // 201
     await r.json();            // { id: 4, nombre: 'Nuevo', email: 'n@mail.com' }
   -------------------------------------------------------------------------- */

// E4. Crea un usuario con POST y devuelve el objeto creado.
// crearUsuario({ nombre: 'Nuevo' }) -> { id: 4, nombre: 'Nuevo' }
async function crearUsuario(datos) {
  // TODO: method, headers y body con JSON.stringify
}

// E5. Actualiza con PUT y devuelve el usuario actualizado.
// actualizarUsuario(1, { nombre: 'Ana María' }) -> { id:1, nombre:'Ana María', ... }
async function actualizarUsuario(id, cambios) {
  // TODO
}

// E6. Borra con DELETE. Devuelve true si el status es 204, false si es 404.
// borrarUsuario(1)  -> true
// borrarUsuario(99) -> false
async function borrarUsuario(id) {
  // TODO: no llames a .json(), un 204 no trae cuerpo
}



/* ############################################################################
   25.3  MANEJAR ERRORES DE VERDAD
   ############################################################################
   Hay DOS tipos de fallo y se atrapan distinto:

     1. La red falló (sin internet, servidor caído, CORS)  -> fetch RECHAZA
        -> lo atrapa el try/catch
     2. El servidor contestó con 4xx/5xx                   -> fetch NO rechaza
        -> hay que revisar respuesta.ok a mano

   El envoltorio que termina en todo proyecto:

     async function pedir(url, opciones) {
       let respuesta;
       try {
         respuesta = await fetch(url, opciones);
       } catch {
         throw new Error('Sin conexión');          // caso 1
       }
       if (!respuesta.ok) {                        // caso 2
         const cuerpo = await respuesta.json().catch(() => ({}));
         throw new Error(cuerpo.mensaje || `HTTP ${respuesta.status}`);
       }
       return respuesta.status === 204 ? null : respuesta.json();
     }

   Con eso, quien lo llama solo necesita un try/catch normal.

   EJEMPLO --------------------------------------------------------------------
     try {
       const u = await pedir('/api/usuarios/99');
     } catch (e) {
       e.message;             // "No encontrado"  <- el mensaje del servidor
     }
   -------------------------------------------------------------------------- */

// E7. Envoltorio genérico. Si no es ok, lanza Error con el `mensaje` que manda
// el servidor (o `HTTP <status>` si no hay). Si es 204, devuelve null.
// pedir('/api/usuarios')     -> array de usuarios
// pedir('/api/usuarios/99')  -> lanza Error("No encontrado")
// pedir('/api/error')        -> lanza Error("Error del servidor")
async function pedir(url, opciones) {
  // TODO
}

// E8. Usa `pedir` y devuelve { ok, datos, error } sin lanzar nunca.
// cargar('/api/usuarios')    -> { ok: true,  datos: [...], error: null }
// cargar('/api/error')       -> { ok: false, datos: null,  error: 'Error del servidor' }
async function cargar(url) {
  // TODO: try/catch sobre pedir
}



/* ############################################################################
   25.4  QUERY STRINGS Y RUTAS
   ############################################################################

     // a mano (se rompe con espacios y acentos):
     fetch(`/api/usuarios?nombre=${nombre}&pagina=${pagina}`);

     // bien, escapando los valores:
     const params = new URLSearchParams({ nombre, pagina: 2 });
     fetch(`/api/usuarios?${params}`);        // "/api/usuarios?nombre=Ana&pagina=2"

   URLSearchParams escapa solo los espacios y símbolos raros. Además ignora
   los valores undefined si los filtras antes:

     const limpio = Object.fromEntries(
       Object.entries(filtros).filter(([, v]) => v !== '' && v != null)
     );
     const params = new URLSearchParams(limpio);

   EJEMPLO --------------------------------------------------------------------
     String(new URLSearchParams({ q: 'ana perez', pagina: 2 }));
     // "q=ana+perez&pagina=2"
   -------------------------------------------------------------------------- */

// E9. Arma la URL con query string a partir del objeto de filtros.
// armarUrl('/api/usuarios', { q: 'ana', pagina: 2 }) -> "/api/usuarios?q=ana&pagina=2"
function armarUrl(base, filtros) {
  // TODO: new URLSearchParams + template literal
}

// E10. Igual, pero descartando los filtros vacíos ('' , null, undefined).
// armarUrlLimpia('/api/u', { q: 'ana', estado: '', pagina: null }) -> "/api/u?q=ana"
// Si no queda ningún filtro, devuelve la base sola, sin '?'.
function armarUrlLimpia(base, filtros) {
  // TODO
}



/* ############################################################################
   25.5  UN "SERVICE": cómo se organiza esto en un proyecto Vue
   ############################################################################
   Las llamadas NO se escriben dentro de los componentes. Se agrupan en un
   archivo `src/services/usuarios.js` (o .ts) así:

     const BASE = import.meta.env.VITE_API_URL;      // viene del archivo .env

     export const usuariosApi = {
       listar:     ()        => pedir(`${BASE}/usuarios`),
       traer:      (id)      => pedir(`${BASE}/usuarios/${id}`),
       crear:      (datos)   => pedir(`${BASE}/usuarios`, {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify(datos),
                                }),
       borrar:     (id)      => pedir(`${BASE}/usuarios/${id}`, { method: 'DELETE' }),
     };

   Y el componente solo hace `await usuariosApi.listar()`. Ventajas: la URL
   está en un solo lado, y si mañana cambian el endpoint tocas un archivo.
   -------------------------------------------------------------------------- */

// E11. Arma el objeto `usuariosApi` con los 4 métodos, usando `pedir`.
// usuariosApi.listar()          -> array
// usuariosApi.traer(1)          -> { id: 1, ... }
// usuariosApi.crear({nombre})   -> el creado
// usuariosApi.borrar(1)         -> null (204)
const usuariosApi = {
  // TODO: listar, traer, crear, borrar
};


module.exports = {
  traerUsuarios, statusDe, traerUsuario, crearUsuario, actualizarUsuario,
  borrarUsuario, pedir, cargar, armarUrl, armarUrlLimpia, usuariosApi,
};


/* ============================================================================
   SOLUCIONES
   ----------------------------------------------------------------------------
   E1   const r = await fetch('/api/usuarios');
        return await r.json();
   E2   const r = await fetch(url);
        return r.status;
   E3   const r = await fetch(`/api/usuarios/${id}`);
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return await r.json();
   E4   const r = await fetch('/api/usuarios', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(datos),
        });
        return await r.json();
   E5   const r = await fetch(`/api/usuarios/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(cambios),
        });
        return await r.json();
   E6   const r = await fetch(`/api/usuarios/${id}`, { method: 'DELETE' });
        return r.status === 204;
   E7   let respuesta;
        try {
          respuesta = await fetch(url, opciones);
        } catch {
          throw new Error('Sin conexión');
        }
        if (!respuesta.ok) {
          const cuerpo = await respuesta.json().catch(() => ({}));
          throw new Error(cuerpo.mensaje || `HTTP ${respuesta.status}`);
        }
        return respuesta.status === 204 ? null : respuesta.json();
   E8   try {
          return { ok: true, datos: await pedir(url), error: null };
        } catch (e) {
          return { ok: false, datos: null, error: e.message };
        }
   E9   return `${base}?${new URLSearchParams(filtros)}`;
   E10  const limpio = Object.fromEntries(
          Object.entries(filtros).filter(([, v]) => v !== '' && v !== null && v !== undefined)
        );
        const qs = String(new URLSearchParams(limpio));
        return qs ? `${base}?${qs}` : base;
   E11  const usuariosApi = {
          listar: () => pedir('/api/usuarios'),
          traer: (id) => pedir(`/api/usuarios/${id}`),
          crear: (datos) => pedir('/api/usuarios', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos),
          }),
          borrar: (id) => pedir(`/api/usuarios/${id}`, { method: 'DELETE' }),
        };
   ============================================================================ */
