/* ============================================================================
   18 · MÓDULOS: import / export
   Nivel 3 · JavaScript a fondo
   ----------------------------------------------------------------------------
   Un proyecto Vue son cientos de archivos chicos que se importan entre sí. La
   primera línea de cualquier .vue o .ts es un import. Si no entiendes esa
   línea, no entiendes el archivo.

   Para ver ESM corriendo de verdad:
     node 03-js-a-fondo/18-modulos-demo/esm-demo.mjs
   Corrige con:   node verificar.js 18
   ============================================================================ */


/* ############################################################################
   18.1  QUÉ ES UN MÓDULO
   ############################################################################
   Un archivo que guarda cosas para que otro las use. Dos piezas:

     archivo A: dice qué saca afuera        ->  export
     archivo B: dice qué trae de A          ->  import

   Hay DOS sistemas, y vas a ver los dos:

     ESM (el estándar, lo que usa Vue y Vite)
        export const PI = 3.14;
        import { PI } from './mates.js';

     CommonJS (el viejo de Node, lo que usa ESTE curso para correr sin config)
        module.exports = { PI };
        const { PI } = require('./mates');

   Este archivo practica con CommonJS porque es lo que corre aquí. La tabla de
   equivalencias está en 18.4, y ahí practicas la sintaxis de ESM.
############################################################################ */

// El módulo 18-modulos-demo/matematicas.js exporta { PI, sumar, restar }.
// Al hacer require se desestructura lo que trae:
const { PI, sumar } = require('./18-modulos-demo/matematicas');

// E1. Usa `sumar` (ya importado arriba) para sumar los dos números.
// sumarConModulo(2, 3) -> 5
function sumarConModulo(a, b) {
  // TODO
}

// E2. Devuelve el valor de PI que trae el módulo.
function damePi() {
  // TODO
}

/* SOLUCIONES 18.1 ------------------------------------------------------------
   E1   return sumar(a, b);
   E2   return PI;
-------------------------------------------------------------------------- */


/* ############################################################################
   18.2  UN MÓDULO QUE EXPORTA UNA SOLA COSA
   ############################################################################
     // saludo.js
     module.exports = function saludar(nombre) { return `Hola ${nombre}`; };

     // quien lo usa: NO lleva llaves, porque no hay nada que desestructurar
     const saludar = require('./saludo');
     saludar('Ana');        // 'Hola Ana'

   Regla: si el módulo exporta un objeto con varias cosas -> con llaves.
   Si exporta una sola cosa -> sin llaves.
############################################################################ */

const saludar = require('./18-modulos-demo/saludo');

// E3. Usa `saludar`.
// usarSaludo('Ana') -> 'Hola Ana'
function usarSaludo(nombre) {
  // TODO
}

/* SOLUCIONES 18.2 ------------------------------------------------------------
   E3   return saludar(nombre);
-------------------------------------------------------------------------- */


/* ############################################################################
   18.3  require DENTRO DE UNA FUNCIÓN
   ############################################################################
   En CommonJS se puede importar en cualquier lado, no solo arriba:

     function hacer() {
       const { restar } = require('./mates');
       return restar(5, 2);
     }

   (En ESM esto NO se puede: los import van siempre arriba del archivo. Para
   cargar algo a mitad de camino existe el import dinámico, en 18.7.)
############################################################################ */

// E4. Importa AQUÍ DENTRO solo `restar` del módulo matematicas y úsala.
// restarConModulo(5, 2) -> 3
function restarConModulo(a, b) {
  // TODO: const { restar } = require('./18-modulos-demo/matematicas');
}

/* SOLUCIONES 18.3 ------------------------------------------------------------
   E4   const { restar } = require('./18-modulos-demo/matematicas');
        return restar(a, b);
-------------------------------------------------------------------------- */


/* ############################################################################
   18.4  ESM: EXPORTACIONES CON NOMBRE
   ############################################################################
   Esta es la sintaxis que vas a escribir en el proyecto de verdad.

     // utiles.js
     export const VERSION = '1.0';
     export function mayus(t) { return t.toUpperCase(); }

     // quien lo usa:
     import { VERSION, mayus } from './utiles.js';
     import { mayus as aMayus } from './utiles.js';   // renombrar con `as`
     import * as utiles from './utiles.js';           // todo junto

   Los nombres van CON llaves y tienen que coincidir exactos.

   Tabla de equivalencias, para traducir de uno al otro:

     CommonJS                          ESM
     ───────────────────────────────   ──────────────────────────────────
     module.exports = { a, b };        export { a, b };
     module.exports = fn;              export default fn;
     const { a } = require('./x');     import { a } from './x.js';
     const fn = require('./x');        import fn from './x.js';
     const todo = require('./x');      import * as todo from './x.js';

   Los siguientes ejercicios piden el TEXTO del import, entre comillas. Es
   para que la sintaxis se te quede en los dedos.
############################################################################ */

// E5. Devuelve el texto del import que trae `ref` y `computed` de 'vue'.
// Debe ser exactamente:  import { ref, computed } from 'vue';
function importVue() {
  // TODO: return "import { ref, computed } from 'vue';"
}

// E6. El import que trae `mayus` pero renombrada a `aMayus`, desde './utiles.js'.
// Debe ser:  import { mayus as aMayus } from './utiles.js';
function importRenombrado() {
  // TODO
}

/* SOLUCIONES 18.4 ------------------------------------------------------------
   E5   return "import { ref, computed } from 'vue';";
   E6   return "import { mayus as aMayus } from './utiles.js';";
-------------------------------------------------------------------------- */


/* ############################################################################
   18.5  ESM: export default
   ############################################################################
   Cada archivo puede tener UNA exportación por defecto. Se importa SIN llaves
   y le pones el nombre que quieras:

     // Boton.vue  ->  export default { ... }
     import Boton from './Boton.vue';
     import ComoSea from './Boton.vue';       // mismo módulo, otro nombre

   Se pueden combinar en una línea (el default primero, sin llaves):
     import titulo, { VERSION } from './utiles.js';

   ⚠ Error clásico: poner llaves donde no van.
        import { Boton } from './Boton.vue';   // undefined si era default

   En Vue con `<script setup>` no escribes `export default`: el componente se
   exporta solo. Pero en archivos .ts normales lo verás seguido.
############################################################################ */

// E7. El import por defecto de 'axios', llamándolo `axios`.
// Debe ser:  import axios from 'axios';
function importDefault() {
  // TODO
}

// E8. El import que trae el default como `titulo` Y el nombrado `VERSION`
// desde './utiles.js', en una sola línea.
// Debe ser:  import titulo, { VERSION } from './utiles.js';
function importMixto() {
  // TODO
}

/* SOLUCIONES 18.5 ------------------------------------------------------------
   E7   return "import axios from 'axios';";
   E8   return "import titulo, { VERSION } from './utiles.js';";
-------------------------------------------------------------------------- */


/* ############################################################################
   18.6  LAS RUTAS
   ############################################################################
     './archivo'            la MISMA carpeta   (el ./ es obligatorio)
     '../otra/cosa'         la carpeta de ARRIBA
     'vue'                  un PAQUETE de node_modules (sin ./)
     '@/components/X.vue'   un ALIAS del proyecto

   El alias `@` no es de JavaScript: lo define el proyecto en vite.config.ts y
   casi siempre apunta a `src/`. Entonces:

     '@/components/Boton.vue'   ===   'src/components/Boton.vue'

   Sirve para no escribir '../../../components/Boton.vue'.

   ⚠ En Windows las rutas usan / igual que en Linux, nunca \.
   ⚠ Las mayúsculas importan: './Boton.vue' no es './boton.vue'. En tu PC
     quizá funcione y en el servidor no.
############################################################################ */

// E9. Estás en src/views/Home.vue y quieres importar src/components/Boton.vue.
// Devuelve el TEXTO de la ruta relativa (solo la ruta).
// Debe ser:  ../components/Boton.vue
function rutaRelativa() {
  // TODO
}

// E10. La misma ruta, pero con alias.
// Debe ser:  @/components/Boton.vue
function rutaConAlias() {
  // TODO
}

/* SOLUCIONES 18.6 ------------------------------------------------------------
   E9   return '../components/Boton.vue';
   E10  return '@/components/Boton.vue';
-------------------------------------------------------------------------- */


/* ############################################################################
   18.7  IMPORT DINÁMICO: cargar recién cuando hace falta
   ############################################################################
     const modulo = await import('./pesado.js');    // import como FUNCIÓN

   Devuelve una promesa (tema 23). Para qué sirve en Vue:

     · rutas "lazy": el código de esa pantalla se descarga al entrar
         { path: '/admin', component: () => import('@/views/Admin.vue') }

     · componentes pesados:
         defineAsyncComponent(() => import('./Grafico.vue'))

   Es la diferencia entre que la app cargue 3 MB de golpe o 300 KB.
############################################################################ */

// E11. Devuelve el TEXTO de la definición de ruta lazy para '@/views/Admin.vue'.
// Debe ser:  () => import('@/views/Admin.vue')
function rutaLazy() {
  // TODO
}

/* SOLUCIONES 18.7 ------------------------------------------------------------
   E11  return "() => import('@/views/Admin.vue')";
-------------------------------------------------------------------------- */


module.exports = {
  PI, saludar,
  sumarConModulo, damePi, usarSaludo, restarConModulo,
  importVue, importRenombrado, importDefault, importMixto,
  rutaRelativa, rutaConAlias, rutaLazy,
};
