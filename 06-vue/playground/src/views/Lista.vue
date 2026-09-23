<script setup lang="ts">
// El patrón completo de una pantalla: cargar / error / vacío / datos.
import { onMounted, computed, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useUsuarios } from '@/composables/useUsuarios';

const { usuarios, cargando, error, cargar } = useUsuarios();
const busqueda = ref('');

const visibles = computed(() =>
  usuarios.value.filter(u =>
    u.name.toLowerCase().includes(busqueda.value.toLowerCase()),
  ),
);

onMounted(cargar);
</script>

<template>
  <div class="caja">
    <h2>Lista desde una API</h2>

    <input v-model="busqueda" placeholder="buscar por nombre" />
    <button @click="cargar">Recargar</button>

    <p v-if="cargando">Cargando...</p>
    <p v-else-if="error">Error: {{ error }}</p>
    <p v-else-if="visibles.length === 0" class="tenue">Sin resultados.</p>
    <ul v-else>
      <li v-for="u in visibles" :key="u.id">
        <RouterLink :to="`/lista/${u.id}`">{{ u.name }}</RouterLink>
        <span class="tenue"> — {{ u.email }}</span>
      </li>
    </ul>
  </div>
</template>
