<script setup lang="ts">
// El componente raíz. Todo lo demás cuelga de aquí.
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
  <h1>Playground Vue 3 + TypeScript</h1>
  <p class="tenue">
    Aquí pruebas lo que leas en las lecciones. Arranca con <code>npm run dev</code>.
  </p>

  <nav>
    <RouterLink to="/">Laboratorio</RouterLink>
    <RouterLink to="/lista">Lista (API)</RouterLink>
    <RouterLink to="/contador">Contador (Pinia)</RouterLink>
  </nav>

  <!-- Aquí se dibuja la página de la ruta activa -->
  <RouterView />
</template>
