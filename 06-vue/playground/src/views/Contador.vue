<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useContadorStore } from '@/stores/contador';

const store = useContadorStore();
// storeToRefs conserva la reactividad al desestructurar el STATE.
const { n, doble } = storeToRefs(store);
// las acciones se sacan directo, sin storeToRefs
const { subir, reiniciar } = store;
</script>

<template>
  <div class="caja">
    <h2>Pinia</h2>
    <p>n = {{ n }} · doble = {{ doble }}</p>
    <button @click="subir()">+1</button>
    <button @click="subir(5)">+5</button>
    <button @click="reiniciar">Reiniciar</button>
    <p class="tenue">
      Cambia de pestaña y vuelve: el valor sigue ahí, porque vive en el store.
    </p>
  </div>
</template>
