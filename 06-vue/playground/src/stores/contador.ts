// Un store de Pinia con la sintaxis "setup" (la misma que un composable).
import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useContadorStore = defineStore('contador', () => {
  const n = ref(0);                                  // state
  const doble = computed(() => n.value * 2);         // getter

  function subir(cuanto = 1) { n.value += cuanto; }  // action
  function reiniciar() { n.value = 0; }

  return { n, doble, subir, reiniciar };
});
