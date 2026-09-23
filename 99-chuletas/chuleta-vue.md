# Chuleta de Vue 3 + TypeScript

---

## Esqueleto de un componente

```vue
<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';

interface Props { titulo: string; items?: string[] }
const props = withDefaults(defineProps<Props>(), { items: () => [] });
const emit = defineEmits<{ guardar: [id: number]; cerrar: [] }>();

const n = ref(0);
const doble = computed(() => n.value * 2);

watch(n, (nuevo, viejo) => { });
onMounted(() => { });
</script>

<template>
  <h2>{{ props.titulo }}</h2>
  <button @click="emit('cerrar')">Cerrar</button>
</template>

<style scoped></style>
```

## Reactividad

```ts
const n = ref(0);                     n.value++;          // script: con .value
const u = ref<Usuario | null>(null);                      // template: sin .value
const lista = ref<Item[]>([]);
const estado = reactive({ a: 1 });    estado.a = 2;       // solo objetos

const total = computed(() => a.value * b.value);
const editable = computed({ get: () => x.value, set: (v) => { x.value = v; } });

watch(fuente, (nuevo, viejo) => { }, { immediate: true, deep: true });
watch(() => props.id, cargar, { immediate: true });
watch([a, b], ([na, nb]) => { });
watchEffect(() => { /* se suscribe solo a lo que use */ });

const { a } = toRefs(objetoReactive);      // desestructurar sin romper
const { a } = storeToRefs(store);          // lo mismo, para Pinia
```

## Template

```vue
{{ variable }}                  {{ a ? 'sí' : 'no' }}

:src="url"      :disabled="cargando"      :class="{ activo: x }"
:style="{ width: w + 'px' }"              v-bind="objeto"

@click="fn"     @click="fn(id)"           @click="fn($event)"
@submit.prevent @click.stop  @click.self  @click.once  @keyup.enter

v-if / v-else-if / v-else       v-show        v-html (¡XSS!)
v-for="(x, i) in lista" :key="x.id"
v-for="(v, k) in objeto" :key="k"

v-model="x"     v-model.number  v-model.trim  v-model.lazy
```

## Ciclo de vida

```ts
onBeforeMount   onMounted       // ya hay DOM: peticiones, focus, librerías
onBeforeUpdate  onUpdated
onBeforeUnmount onUnmounted     // ¡limpiar intervalos y listeners!
onActivated     onDeactivated   // con KeepAlive
onErrorCaptured

await nextTick();               // esperar al redibujado
```

## Template refs

```vue
<script setup lang="ts">
const campo = ref<HTMLInputElement | null>(null);
onMounted(() => campo.value?.focus());
</script>

<template><input ref="campo" /></template>
```

```ts
// llamar a un método del hijo
const hijo = ref<InstanceType<typeof Hijo> | null>(null);
hijo.value?.validar();
// en el hijo:  defineExpose({ validar });
```

## Props y eventos

```ts
// hijo
const props = defineProps<{ titulo: string; activo?: boolean }>();
const props = withDefaults(defineProps<Props>(), { activo: false, items: () => [] });
const emit = defineEmits<{ guardar: [Usuario]; cerrar: [] }>();
emit('guardar', usuario);

// v-model propio (Vue 3.4+)
const valor = defineModel<string>();
const nombre = defineModel<string>('nombre');    // v-model:nombre

// v-model propio (forma clásica)
defineProps<{ modelValue: string }>();
const emit = defineEmits<{ 'update:modelValue': [string] }>();
```

```vue
<!-- padre -->
<Hijo :titulo="t" :activo="true" @guardar="alGuardar" @cerrar="x = false" />
<Hijo v-model="texto" />
<Hijo v-model:nombre="n" v-model:edad="e" />
```

## Slots

```vue
<!-- hijo -->
<slot />                                   <!-- por defecto -->
<slot name="pie">respaldo</slot>           <!-- con nombre -->
<slot name="fila" :item="i" :indice="n" /> <!-- con datos -->
<footer v-if="$slots.pie"><slot name="pie" /></footer>

<!-- padre -->
<Panel>
  contenido del slot por defecto
  <template #pie><button>Cerrar</button></template>
  <template #fila="{ item, indice }">{{ indice }} {{ item.nombre }}</template>
</Panel>
```

## Composables

```ts
// composables/useAlgo.ts
export function useAlgo(inicial = 0) {
  const n = ref(inicial);                  // dentro → estado por componente
  const doble = computed(() => n.value * 2);
  function subir() { n.value++; }
  onUnmounted(() => { /* limpiar */ });
  return { n, doble, subir };
}

const { n, subir } = useAlgo();            // se desestructura sin problema
```

## Pinia

```ts
export const useXStore = defineStore('x', () => {
  const n = ref(0);                              // state
  const doble = computed(() => n.value * 2);     // getter
  function subir() { n.value++; }                // action
  return { n, doble, subir };                    // ← devolver TODO
});
```

```ts
const store = useXStore();
const { n, doble } = storeToRefs(store);   // state/getters: CON storeToRefs
const { subir } = store;                   // actions: directo
```

## Router

```ts
{ path: '/x', name: 'x', component: () => import('@/views/X.vue') }
{ path: '/x/:id', name: 'detalle', component: X, props: true }
{ path: '/:todo(.*)*', component: NoEncontrado }        // 404, al final
{ path: '/p', component: P, children: [{ path: 'hijo', component: H }] }
{ path: '/admin', component: A, meta: { requiereAuth: true } }
```

```vue
<RouterLink to="/x">Ir</RouterLink>
<RouterLink :to="{ name: 'detalle', params: { id } }">Ver</RouterLink>
<RouterView />
```

```ts
const router = useRouter();       // NAVEGAR
router.push('/x');  router.push({ name: 'x', params: { id } });  router.back();

const route = useRoute();         // LEER
Number(route.params.id);    route.query.q;    route.name;

router.beforeEach((hacia) => {
  if (hacia.meta.requiereAuth && !sesion.autenticado) return { name: 'login' };
});
onBeforeRouteLeave(() => confirm('¿Salir sin guardar?'));
```

## Patrón de pantalla (cópialo entero)

```vue
<script setup lang="ts">
const datos = ref<X[]>([]);
const cargando = ref(false);
const error = ref<string | null>(null);

async function cargar() {
  cargando.value = true;
  error.value = null;
  try {
    datos.value = await api.listar();
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Error';
  } finally {
    cargando.value = false;
  }
}
onMounted(cargar);
</script>

<template>
  <p v-if="cargando">Cargando...</p>
  <div v-else-if="error">
    <p>{{ error }}</p><button @click="cargar">Reintentar</button>
  </div>
  <p v-else-if="datos.length === 0">Sin datos.</p>
  <ul v-else><li v-for="d in datos" :key="d.id">{{ d.nombre }}</li></ul>
</template>
```

## Avanzado

```ts
provide(CLAVE, valor);     const v = inject(CLAVE);
defineAsyncComponent(() => import('./X.vue'));
```

```vue
<Teleport to="body">...</Teleport>
<KeepAlive><component :is="Comp" /></KeepAlive>
<Suspense><template #default><X /></template>
          <template #fallback>Cargando</template></Suspense>
<component :is="componente" />
```

## Comandos

```
npm run dev        # servidor local (localhost:5173)
npm run build      # compila a dist/
npm run preview    # sirve lo compilado
vue-tsc --noEmit   # revisar tipos (tsc solo NO lee los .vue)
```
