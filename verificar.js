// Corrector: ejecuta   node verificar.js        -> todos los temas
//                      node verificar.js 03     -> solo el tema 03
const fs = require('fs');
const path = require('path');
const { estado } = require('./lib/mini-test');

const filtro = process.argv[2];
const dir = path.join(__dirname, 'tests');
const archivos = fs.readdirSync(dir)
  .filter(f => f.endsWith('.test.js'))
  .filter(f => !filtro || f.startsWith(filtro))
  .sort();

if (archivos.length === 0) {
  console.log('No encontre tests con ese filtro.');
  process.exit(0);
}

// Saca de un error el archivo y la linea donde reviento, para no tener que
// adivinar. Node los pone en error.stack, en formato  ruta:linea:columna
function ubicar(error) {
  const esSintaxis = error instanceof SyntaxError;
  const texto = String(error.stack || '') + '\n' + String(error.message || '');
  // busca algo como  C:\ruta\archivo.js:123
  const m = texto.match(/([^\s():]+\.(?:js|mjs|cjs)):(\d+)/);
  const donde = m ? `${path.basename(m[1])}, linea ${m[2]}` : null;
  return {
    mensaje: String(error.message).split('\n')[0],
    donde,
    tipo: esSintaxis ? 'sintaxis' : 'ejecucion',
  };
}

// Un archivo con error de sintaxis no debe tumbar la correccion de los demas.
const rotos = [];
archivos.forEach(f => {
  try {
    require(path.join(dir, f));
  } catch (error) {
    rotos.push({ archivo: f, ...ubicar(error) });
  }
});

(async () => {
await Promise.all(estado.enCurso);   // espera las pruebas async (nivel 4)

const c = { gris: '\x1b[90m', verde: '\x1b[32m', rojo: '\x1b[31m', amarillo: '\x1b[33m', neg: '\x1b[1m', fin: '\x1b[0m' };
let ok = 0, fallos = 0, pendientes = 0;

console.log('');
for (const g of estado.grupos) {
  console.log(`${c.neg}${g.nombre}${c.fin}`);
  for (const p of g.pruebas) {
    if (p.estado === 'ok') {
      ok++;
      console.log(`  ${c.verde}PASA${c.fin}      ${p.descripcion}`);
    } else if (p.estado === 'pendiente') {
      pendientes++;
      console.log(`  ${c.gris}PENDIENTE ${p.descripcion}${c.fin}`);
    } else {
      fallos++;
      console.log(`  ${c.rojo}FALLA${c.fin}     ${p.descripcion}`);
      console.log(`            ${c.rojo}${p.detalle}${c.fin}`);
    }
  }
  console.log('');
}

for (const r of rotos) {
  fallos++;
  const titulo = r.tipo === 'sintaxis' ? 'NO COMPILA' : 'REVIENTA AL CARGAR';
  console.log(`${c.rojo}${c.neg}${titulo}${c.fin}  ${r.archivo}`);
  if (r.donde) console.log(`            ${c.amarillo}${c.neg}-> ${r.donde}${c.fin}`);
  console.log(`            ${c.rojo}${r.mensaje}${c.fin}`);
  const pista = r.tipo === 'sintaxis'
    ? 'falta una llave, un parentesis o un punto y coma. Mira esa linea y las de arriba.'
    : 'el archivo se ejecuto al importarlo y lanzo un error.';
  console.log(`            ${c.gris}(${pista} Nada de este tema se pudo probar)${c.fin}`);
  console.log('');
}

console.log(`${c.verde}${ok} correctos${c.fin}  ${c.rojo}${fallos} fallidos${c.fin}  ${c.gris}${pendientes} sin hacer${c.fin}`);
if (fallos === 0 && pendientes === 0) console.log(`\n${c.verde}${c.neg}Todo resuelto. Buen trabajo.${c.fin}`);
})();
