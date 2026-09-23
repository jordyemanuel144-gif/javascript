// Corrector de los temas de TypeScript.
//    npm run ts          -> revisa todos los temas
//    npm run ts 30       -> revisa solo el tema 30
//    npm run tipos       -> solo revisa TIPOS (sin ejecutar nada)
import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import { estado } from './lib/mini-test';

const filtro = process.argv[2];
const dir = path.join(__dirname, 'tests-ts');
const archivos = fs.readdirSync(dir)
  .filter(f => f.endsWith('.test.ts'))
  .filter(f => !filtro || f.startsWith(filtro))
  .sort();

const rotos: Array<{ archivo: string; mensaje: string }> = [];

async function main() {
  if (archivos.length === 0) {
    console.log('No encontre tests con ese filtro.');
    return;
  }

  for (const f of archivos) {
    try {
      await import(pathToFileURL(path.join(dir, f)).href);
    } catch (error: any) {
      rotos.push({ archivo: f, mensaje: String(error?.message ?? error).split('\n')[0] });
    }
  }

  await Promise.all(estado.enCurso);

  const c = { gris: '\x1b[90m', verde: '\x1b[32m', rojo: '\x1b[31m', neg: '\x1b[1m', fin: '\x1b[0m' };
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
    console.log(`${c.rojo}${c.neg}NO COMPILA${c.fin}  ${r.archivo}`);
    console.log(`            ${c.rojo}${r.mensaje}${c.fin}`);
    console.log('');
  }

  console.log(`${c.verde}${ok} correctos${c.fin}  ${c.rojo}${fallos} fallidos${c.fin}  ${c.gris}${pendientes} sin hacer${c.fin}`);
  console.log(`${c.gris}(esto ejecuta el codigo; para revisar solo los TIPOS: npm run tipos)${c.fin}`);
  if (fallos === 0 && pendientes === 0) console.log(`\n${c.verde}${c.neg}Todo resuelto. Buen trabajo.${c.fin}`);
}

main();
