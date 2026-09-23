const { grupo, prueba, esperar } = require('../lib/mini-test');
const m = require('../03-js-a-fondo/18-modulos-import-export');

grupo('TEMA 18 - Modulos import / export', () => {
  prueba('E1  sumarConModulo(2, 3) -> 5', () => esperar(m.sumarConModulo(2, 3)).aSer(5));
  prueba('E2  damePi() -> 3.14', () => esperar(m.damePi()).aSer(3.14));
  prueba('E3  usarSaludo(Ana) -> Hola Ana', () => esperar(m.usarSaludo('Ana')).aSer('Hola Ana'));
  prueba('E4  restarConModulo(5, 2) -> 3', () => esperar(m.restarConModulo(5, 2)).aSer(3));
  prueba('E5  import nombrado de vue', () => esperar(m.importVue()).aSer("import { ref, computed } from 'vue';"));
  prueba('E6  import renombrado con as', () => esperar(m.importRenombrado()).aSer("import { mayus as aMayus } from './utiles.js';"));
  prueba('E7  import por defecto', () => esperar(m.importDefault()).aSer("import axios from 'axios';"));
  prueba('E8  import mixto (default + nombrado)', () => esperar(m.importMixto()).aSer("import titulo, { VERSION } from './utiles.js';"));
  prueba('E9  ruta relativa desde views a components', () => esperar(m.rutaRelativa()).aSer('../components/Boton.vue'));
  prueba('E10 ruta con alias @', () => esperar(m.rutaConAlias()).aSer('@/components/Boton.vue'));
  prueba('E11 ruta lazy con import dinamico', () => esperar(m.rutaLazy()).aSer("() => import('@/views/Admin.vue')"));
});
