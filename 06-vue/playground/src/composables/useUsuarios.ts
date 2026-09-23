// Un composable: lógica reutilizable con estado propio.
// Convención: el archivo y la función empiezan con "use".
import { ref } from 'vue';

export interface Usuario {
  id: number;
  name: string;
  email: string;
}

export function useUsuarios() {
  const usuarios = ref<Usuario[]>([]);
  const cargando = ref(false);
  const error = ref<string | null>(null);

  async function cargar() {
    cargando.value = true;
    error.value = null;
    try {
      const r = await fetch('https://jsonplaceholder.typicode.com/users');
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      usuarios.value = (await r.json()) as Usuario[];
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error desconocido';
    } finally {
      cargando.value = false;
    }
  }

  return { usuarios, cargando, error, cargar };
}
