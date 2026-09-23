<script setup lang="ts">
// Página con parámetro de ruta: /lista/3
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { Usuario } from '@/composables/useUsuarios';

const route = useRoute();
const router = useRouter();

const usuario = ref<Usuario | null>(null);
const error = ref<string | null>(null);

onMounted(async () => {
  try {
    const r = await fetch(`https://jsonplaceholder.typicode.com/users/${route.params.id}`);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    usuario.value = (await r.json()) as Usuario;
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Error';
  }
});
</script>

<template>
  <div class="caja">
    <button @click="router.back()">Volver</button>
    <p v-if="error">Error: {{ error }}</p>
    <div v-else-if="usuario">
      <h2>{{ usuario.name }}</h2>
      <p class="tenue">{{ usuario.email }}</p>
    </div>
    <p v-else>Cargando...</p>
  </div>
</template>
