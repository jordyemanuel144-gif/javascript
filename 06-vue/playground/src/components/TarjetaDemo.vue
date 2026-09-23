<script setup lang="ts">
// Un componente hijo típico: recibe props tipadas y emite eventos.
interface Props {
  titulo: string;
  veces?: number;
}

const props = withDefaults(defineProps<Props>(), { veces: 0 });

const emit = defineEmits<{
  saludar: [];                 // evento sin datos
}>();
</script>

<template>
  <div class="caja">
    <strong>{{ props.titulo }}</strong>
    <p class="tenue">El padre me pasó veces = {{ veces }}</p>
    <button @click="emit('saludar')">Avisarle al padre</button>
    <slot>Contenido por defecto del slot</slot>
  </div>
</template>
