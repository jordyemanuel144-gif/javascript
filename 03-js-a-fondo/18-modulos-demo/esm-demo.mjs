// Ejecuta esto para ver ESM funcionando de verdad:
//    node 03-js-a-fondo/18-modulos-demo/esm-demo.mjs

import titulo, { VERSION, mayus } from './utiles.mjs';
import * as todo from './utiles.mjs';

console.log(titulo('Modulos ESM'));   // el default entra SIN llaves
console.log('VERSION:', VERSION);     // los nombrados entran CON llaves
console.log('mayus:', mayus('hola'));
console.log('namespace:', Object.keys(todo));   // [ 'VERSION', 'default', 'mayus' ]

// import dinámico: carga el módulo recién cuando hace falta (devuelve promesa)
const cargado = await import('./utiles.mjs');
console.log('dinamico:', cargado.VERSION);
