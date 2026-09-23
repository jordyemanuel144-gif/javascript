/* ============================================================================
   BORRADOR TYPESCRIPT — la misma idea, pero con tipos
   ----------------------------------------------------------------------------
   Déjalo corriendo con:

       npm run bt

   Guardas (Ctrl+S) y se vuelve a ejecutar solo.

   Ojo: `tsx` NO revisa los tipos, solo ejecuta. Los errores de tipo los ves
   subrayados en el editor, y todos juntos con `npm run tipos`.
   ============================================================================ */

interface Usuario {
  id: number;
  nombre: string;
  email: string | null;
}

const usuarios: Usuario[] = [
  { id: 1, nombre: 'Ana', email: 'ana@mail.com' },
  { id: 2, nombre: 'Luis', email: null },
];

console.table(usuarios);

// Pasa el mouse por encima de `conEmail` en el editor: TS te dice el tipo.
const conEmail = usuarios.filter((u): u is Usuario & { email: string } => u.email !== null);
console.log(conEmail.map(u => u.email));

// A partir de aquí, prueba lo que quieras ------------------------------------




/* ----------------------------------------------------------------------------
   Importar algo de una lección (con sintaxis ESM, que es la de Vue):

     import { primero } from './05-typescript/33-genericos';
     console.log(primero([1, 2, 3]));

   Para usar await, envuélvelo en una función async y llámala:

     (async () => {
       const r = await fetch('https://jsonplaceholder.typicode.com/users/1');
       console.log(await r.json());
     })();

   (El `await` suelto, sin función alrededor, solo funciona en archivos .mts
    y dentro del <script setup> de un componente Vue.)
---------------------------------------------------------------------------- */
