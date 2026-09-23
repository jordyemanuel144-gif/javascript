<script setup lang="ts">
/* ============================================================
   ESTA ES TU HOJA EN BLANCO.
   Pega aquí los ejemplos de las lecciones y guarda: la página
   se recarga sola.
   ============================================================ */
import { ref, computed, watch } from 'vue';
import TarjetaDemo from '@/components/TarjetaDemo.vue';

const nombre = ref('');
const contador = ref(0);
const items = ref<string[]>(['manzana', 'pera']);
const nuevo = ref('');

const saludo = computed(() => (nombre.value ? `Hola ${nombre.value}` : 'Escribe tu nombre'));

watch(contador, (nuevoValor, anterior) => {
  console.log(`el contador pasó de ${anterior} a ${nuevoValor}`);
});

function agregar() {
  if (!nuevo.value.trim()) return;
  items.value = [...items.value, nuevo.value.trim()];
  nuevo.value = '';
}
</script>

<template>
  <div class="caja">
    <h2>1 · ref + v-model + computed</h2>
    <input v-model="nombre" placeholder="tu nombre" />
    <p>{{ saludo }}</p>
  </div>

  <div class="caja">
    <h2>2 · eventos y estado</h2>
    <button @click="contador++">Sumar</button>
    <button @click="contador = 0">Reiniciar</button>
    <p>Contador: <strong>{{ contador }}</strong></p>
    <p v-if="contador > 3" class="tenue">Ya van varias...</p>
  </div>

  <div class="caja">
    <h2>3 · v-for con :key</h2>
    <form @submit.prevent="agregar">
      <input v-model="nuevo" placeholder="agregar item" />
      <button type="submit">Agregar</button>
    </form>
    <ul>
      <li v-for="(item, i) in items" :key="item">{{ i + 1 }}. {{ item }}</li>
    </ul>
  </div>

  <div class="caja">
    <h2>4 · componente hijo con props y emits</h2>
    <TarjetaDemo titulo="Soy un hijo" :veces="contador" @saludar="contador++" />
  </div>
</template>
