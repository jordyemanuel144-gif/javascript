/* ============================================================================
   27 · DOM Y EVENTOS — lo que Vue hace por ti
   Nivel 4 · JavaScript asíncrono
   ----------------------------------------------------------------------------
   En Vue casi nunca tocas el DOM a mano: `v-if`, `v-for` y `@click` lo hacen
   solos. Pero hay que entender qué pasa por debajo, porque:
     · los eventos de Vue son los eventos del navegador (event, preventDefault)
     · a veces sí tocas el DOM (focus, scroll, una librería externa)
     · los errores del navegador hablan de nodos y elementos

   Node no trae DOM, así que aquí se usa uno de mentira que funciona igual.
   Corrige con:   node verificar.js 27
   ============================================================================ */

const { crearDocumento } = require('../lib/dom-falso');

// En el navegador `document` ya existe. Acá lo fabricamos.
const document = crearDocumento();


/* ############################################################################
   27.1  BUSCAR Y CREAR ELEMENTOS
   ############################################################################

     document.getElementById('titulo')        // uno, por id
     document.querySelector('#titulo')        // uno, por selector CSS
     document.querySelector('.fila')          // el PRIMERO con esa clase
     document.querySelectorAll('.fila')       // TODOS (una lista)

     const div = document.createElement('div');
     div.textContent = 'Hola';                // el texto de adentro
     div.className = 'caja roja';             // las clases (pisa las que haya)
     div.id = 'saludo';
     padre.append(div);                       // lo mete en el árbol
     div.remove();                            // lo saca

   Clases sin pisar lo que había:
     div.classList.add('activo');
     div.classList.remove('activo');
     div.classList.toggle('activo');          // pone/saca
     div.classList.contains('activo');        // true/false

   En Vue esto se escribe así, y Vue hace lo de arriba por vos:
     <div :class="{ activo: estaActivo }">{{ texto }}</div>

   EJEMPLO --------------------------------------------------------------------
     const li = document.createElement('li');
     li.textContent = 'Item 1';
     li.classList.add('fila');
     document.body.append(li);
     document.querySelectorAll('.fila').length;      // 1
   -------------------------------------------------------------------------- */

// E1. Crea un <li> con ese texto y la clase 'fila'. Devuélvelo (no lo metas
// en ningún lado todavía).
function crearFila(texto) {
  // TODO: createElement + textContent + classList.add
}

// E2. Crea una <ul> con un <li> por cada texto de la lista. Devuelve la ul.
// crearLista(['a','b']).children.length -> 2
function crearLista(textos) {
  // TODO: crea la ul, recorre y usa append
}

// E3. Devuelve el texto de todos los hijos de un elemento.
// textosDe(crearLista(['a','b'])) -> ['a','b']
function textosDe(elemento) {
  // TODO: elemento.children es un array normal
}

// E4. Activa o desactiva la clase 'activo' y devuelve si quedó activa.
// alternarActivo(el) -> true la primera vez, false la segunda
function alternarActivo(elemento) {
  // TODO: classList.toggle devuelve el estado final
}



/* ############################################################################
   27.2  EVENTOS: escuchar y disparar
   ############################################################################

     boton.addEventListener('click', manejar);
     boton.removeEventListener('click', manejar);   // la MISMA función

   ⚠ Para poder quitarlo, el handler tiene que ser una función con nombre.
     Si pasas una flecha nueva cada vez, nunca vas a poder removerla.

   El objeto `event` que recibe el handler:
     event.type              // 'click'
     event.target            // el elemento donde SE ORIGINÓ
     event.currentTarget     // el elemento que está escuchando
     event.preventDefault()  // cancela lo que el navegador haría solo
                             // (enviar el form, seguir el link)
     event.stopPropagation() // corta el burbujeo

   En Vue:
     @click="manejar"           -> recibe el event
     @click="manejar($event)"   -> si además mandas otros argumentos
     @submit.prevent="guardar"  -> .prevent ES preventDefault()
     @click.stop="..."          -> .stop ES stopPropagation()

   EJEMPLO --------------------------------------------------------------------
     let veces = 0;
     const boton = document.createElement('button');
     boton.addEventListener('click', () => { veces++; });
     boton.click();
     veces;                   // 1
   -------------------------------------------------------------------------- */

// E5. Cuenta los clics en el elemento. Devuelve una función que informa el
// total acumulado.
// const total = contarClics(boton);  boton.click(); boton.click();  total() -> 2
function contarClics(elemento) {
  // TODO: closure + addEventListener
}

// E6. Devuelve el `type` del evento recibido cuando se hace click.
// (Guarda el valor en una variable desde el handler y devuélvela.)
// tipoDelEvento(boton) -> 'click'  (después de boton.click())
function tipoDelEvento(elemento) {
  let tipo = null;
  // TODO: elemento.addEventListener('click', (evento) => { tipo = evento.type; });
  elemento.click();
  return tipo;
}

// E7. Handler que cancela el comportamiento por defecto.
// Si se llama a preventDefault, dispatchEvent devuelve false.
// cancelarEnvio(form) -> después, form.dispatchEvent({type:'submit'}) da false
function cancelarEnvio(form) {
  // TODO: addEventListener('submit', e => e.preventDefault())
}



/* ############################################################################
   27.3  BURBUJEO Y DELEGACIÓN
   ############################################################################
   Un clic en un <li> también "sube" al <ul>, al <body> y al document. Eso es
   el burbujeo (bubbling).

     ul.addEventListener('click', (e) => {
       console.log(e.target.textContent);    // el LI que se clickeó
       console.log(e.currentTarget.tagName); // "UL": quien escucha
     });

   DELEGACIÓN: en vez de poner un listener por cada fila (500 filas = 500
   listeners), pones UNO en el padre y miras `e.target`. Es más rápido y
   funciona con las filas que agregues después.

     tabla.addEventListener('click', (e) => {
       const fila = e.target;
       if (!fila.classList.contains('fila')) return;
       seleccionar(fila.dataset.id);
     });

   `stopPropagation()` corta la subida: útil cuando un botón está dentro de
   una fila clickeable y no quieres que dispare las dos cosas.
   (En Vue: `@click.stop`.)

   EJEMPLO --------------------------------------------------------------------
     ul.append(li);
     ul.addEventListener('click', e => console.log(e.target === li));  // true
     li.click();
   -------------------------------------------------------------------------- */

// E8. Escucha en el PADRE y devuelve el texto del hijo clickeado.
// const leer = escucharEnPadre(ul);  li.click();  leer() -> 'b'
function escucharEnPadre(padre) {
  // TODO: usa e.target.textContent
}

// E9. Cuenta los clics que llegan al padre; el handler del hijo debe cortar
// el burbujeo con stopPropagation.
// Devuelve la función que informa cuántos llegaron al padre (debe ser 0).
function cortarBurbujeo(padre, hijo) {
  let enPadre = 0;
  // TODO:
  // padre.addEventListener('click', () => { enPadre++; });
  // hijo.addEventListener('click', (e) => e.stopPropagation());
  return () => enPadre;
}

// E10. Delegación con data-*: devuelve el id del elemento clickeado.
// Los hijos tienen  li.dataset.id = '7'
// const leerId = delegarPorDataset(ul);  li.click();  leerId() -> '7'
function delegarPorDataset(padre) {
  // TODO: e.target.dataset.id
}



/* ############################################################################
   27.4  LO QUE SÍ VAS A USAR EN VUE
   ############################################################################
   · `localStorage` — guarda texto en el navegador, sobrevive al refresh:

        localStorage.setItem('token', 'abc');
        localStorage.getItem('token');            // "abc"  (null si no está)
        localStorage.removeItem('token');
        // solo guarda TEXTO: para objetos, JSON.stringify / JSON.parse

   · `event.target.value` — lo que escribió el usuario en un input.
     En Vue esto es `v-model`, que hace exactamente:
        :value="texto"  @input="texto = $event.target.value"

   · Referencias a elementos reales: `ref` + `onMounted` (tema 46):
        const caja = ref(null);
        onMounted(() => caja.value.focus());

   · `window.addEventListener('resize', ...)` y su `removeEventListener` en
     `onUnmounted`. Si no lo quitas, queda corriendo para siempre.
   -------------------------------------------------------------------------- */

// E11. Guarda el objeto en localStorage (simulado con un Map) y léelo de vuelta.
// El almacenamiento solo guarda TEXTO.
const almacenamiento = new Map();   // simula localStorage
function guardarObjeto(clave, obj) {
  // TODO: almacenamiento.set(clave, JSON.stringify(obj))
}
function leerObjeto(clave) {
  // TODO: parsear; si no existe la clave, devuelve null
}

// E12. Devuelve lo que el usuario escribió, leyéndolo del evento.
// input.value = 'hola'; input.dispatchEvent({type:'input'});  leer() -> 'hola'
function leerLoEscrito(input) {
  // TODO: addEventListener('input', e => { ... e.target.value ... })
}


module.exports = {
  document, crearFila, crearLista, textosDe, alternarActivo,
  contarClics, tipoDelEvento, cancelarEnvio,
  escucharEnPadre, cortarBurbujeo, delegarPorDataset,
  almacenamiento, guardarObjeto, leerObjeto, leerLoEscrito,
};


/* ============================================================================
   SOLUCIONES
   ----------------------------------------------------------------------------
   E1   const li = document.createElement('li');
        li.textContent = texto;
        li.classList.add('fila');
        return li;
   E2   const ul = document.createElement('ul');
        for (const t of textos) {
          const li = document.createElement('li');
          li.textContent = t;
          ul.append(li);
        }
        return ul;
   E3   return elemento.children.map(h => h.textContent);
   E4   return elemento.classList.toggle('activo');
   E5   let n = 0;
        elemento.addEventListener('click', () => { n++; });
        return () => n;
   E6   elemento.addEventListener('click', (evento) => { tipo = evento.type; });
   E7   form.addEventListener('submit', (e) => e.preventDefault());
   E8   let texto = null;
        padre.addEventListener('click', (e) => { texto = e.target.textContent; });
        return () => texto;
   E9   padre.addEventListener('click', () => { enPadre++; });
        hijo.addEventListener('click', (e) => e.stopPropagation());
   E10  let id = null;
        padre.addEventListener('click', (e) => { id = e.target.dataset.id; });
        return () => id;
   E11  almacenamiento.set(clave, JSON.stringify(obj));
        // leerObjeto:
        const texto = almacenamiento.get(clave);
        return texto ? JSON.parse(texto) : null;
   E12  let valor = null;
        input.addEventListener('input', (e) => { valor = e.target.value; });
        return () => valor;
   ============================================================================ */
