# 49 · Vue Router

> **Nivel 6 · Vue**
> Una app Vue es **una sola página HTML**. El router es el que decide qué
> componente mostrar según la URL, sin recargar nada.

---

## 49.1 · Declarar las rutas

```ts
// router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: Home },

    // carga diferida: este código se descarga recién al entrar
    { path: '/pedidos', name: 'pedidos', component: () => import('@/views/Pedidos.vue') },

    // con parámetro
    { path: '/pedidos/:id', name: 'pedido', component: () => import('@/views/Pedido.vue') },

    // parámetro opcional
    { path: '/buscar/:q?', name: 'buscar', component: () => import('@/views/Buscar.vue') },

    // 404: tiene que ir AL FINAL
    { path: '/:cualquiera(.*)*', name: '404', component: () => import('@/views/NoEncontrado.vue') },
  ],
});

export default router;
```

```ts
// main.ts
app.use(router);
```

* `createWebHistory()` da URLs limpias (`/pedidos`). Necesita que el servidor
  redirija todo a `index.html`, si no da 404 al recargar.
* `createWebHashHistory()` usa `/#/pedidos` y funciona en cualquier servidor
  sin configurar nada.
* `component: () => import(...)` es el import dinámico del tema 18: parte el
  bundle y la app carga mucho más rápido.

---

## 49.2 · Navegar

```vue
<template>
  <!-- con enlaces (genera un <a> de verdad) -->
  <RouterLink to="/pedidos">Pedidos</RouterLink>
  <RouterLink :to="`/pedidos/${id}`">Ver</RouterLink>
  <RouterLink :to="{ name: 'pedido', params: { id } }">Ver</RouterLink>

  <!-- donde se dibuja la vista de la ruta actual -->
  <RouterView />
</template>
```

```ts
// desde el código
import { useRouter } from 'vue-router';
const router = useRouter();

router.push('/pedidos');                                  // navegar
router.push({ name: 'pedido', params: { id: 7 } });       // por nombre
router.push({ path: '/buscar', query: { q: 'mouse' } });  // con ?q=mouse
router.replace('/login');   // sin dejar huella en el historial
router.back();              // atrás
```

**Usar `name` en vez de `path`** vale la pena: si mañana cambia la URL, tocas
solo el archivo de rutas.

`RouterLink` agrega solas las clases `router-link-active` y
`router-link-exact-active`, que se usan para marcar el menú.

---

## 49.3 · Leer parámetros y query

```ts
import { useRoute } from 'vue-router';
const route = useRoute();

route.params.id;        // '7'   ← SIEMPRE texto
route.query.q;          // 'mouse'
route.path;             // '/pedidos/7'
route.name;             // 'pedido'
```

> ⚠ **`route.params.id` es un string**, aunque la URL diga `/pedidos/7`. Si lo
> comparas con un número, nunca coincide:
> ```ts
> const id = Number(route.params.id);
> ```

> ⚠⚠ **`useRoute()` es para leer, `useRouter()` es para navegar.** Confundirlos
> es un clásico de los primeros días.

**El bug que le pasa a todo el mundo:** al ir de `/pedidos/1` a `/pedidos/2`,
Vue **reutiliza** el componente y `onMounted` no vuelve a ejecutarse:

```ts
// ✗ solo carga la primera vez
onMounted(cargar);

// ✓ reacciona al cambio de parámetro
watch(() => route.params.id, cargar, { immediate: true });
```

---

## 49.4 · Rutas anidadas

```ts
{
  path: '/ajustes',
  component: () => import('@/views/Ajustes.vue'),
  children: [
    { path: '', redirect: 'perfil' },
    { path: 'perfil', component: () => import('@/views/AjustesPerfil.vue') },
    { path: 'seguridad', component: () => import('@/views/AjustesSeguridad.vue') },
  ],
}
```

```vue
<!-- Ajustes.vue: el padre necesita SU propio RouterView -->
<template>
  <h1>Ajustes</h1>
  <nav>
    <RouterLink to="/ajustes/perfil">Perfil</RouterLink>
    <RouterLink to="/ajustes/seguridad">Seguridad</RouterLink>
  </nav>

  <RouterView />      <!-- aquí entra el hijo -->
</template>
```

* Las rutas hijas **no** llevan `/` al principio.
* Si el padre no pone `<RouterView />`, no se ve nada y no hay error: es de los
  despistes más difíciles de encontrar.

---

## 49.5 · Guards: proteger rutas

```ts
// router/index.ts
router.beforeEach((hacia, desde) => {
  const sesion = useSesionStore();      // ← adentro, no arriba del archivo

  if (hacia.meta.requiereAuth && !sesion.autenticado) {
    return { name: 'login', query: { volverA: hacia.fullPath } };
  }
  if (hacia.meta.soloAdmin && !sesion.esAdmin) {
    return { name: 'home' };
  }
  // sin return (o `return true`) = dejar pasar
});
```

```ts
{
  path: '/admin',
  component: Admin,
  meta: { requiereAuth: true, soloAdmin: true },
}
```

* Devolver un objeto de ruta = redirigir.
* Devolver `false` = cancelar la navegación.
* No devolver nada = seguir.

Guards por componente:

```ts
import { onBeforeRouteLeave } from 'vue-router';

onBeforeRouteLeave(() => {
  if (hayCambiosSinGuardar.value) {
    return confirm('Tienes cambios sin guardar. ¿Salir igual?');
  }
});
```

Y para el título de la pestaña:

```ts
router.afterEach((hacia) => {
  document.title = (hacia.meta.titulo as string) ?? 'Mi app';
});
```

---

## 49.6 · Props desde la ruta

En vez de leer `route.params` dentro del componente, se pueden inyectar como
props (queda más limpio y el componente se puede probar solo):

```ts
{ path: '/pedidos/:id', component: Pedido, props: true }
```

```vue
<script setup lang="ts">
const props = defineProps<{ id: string }>();
</script>
```

Con conversión a número:

```ts
{
  path: '/pedidos/:id',
  component: Pedido,
  props: (route) => ({ id: Number(route.params.id) }),
}
```

---

## Ejercicios

**E1.** Declara una ruta `/clientes` con nombre `clientes` y carga diferida de
`@/views/Clientes.vue`.

**E2.** Declara la ruta de detalle `/clientes/:id`.

**E3.** Escribe el `RouterLink` que lleva al cliente con id 5, usando el nombre
de la ruta.

**E4.** Escribe la navegación equivalente desde el script.

**E5.** Navega a `/buscar` con el query `q=mouse`.

**E6.** Lee el `id` de la ruta y conviértelo a número.

**E7.** ¿Por qué al pasar de `/clientes/1` a `/clientes/2` no se recargan los
datos, y cómo se arregla?

**E8.** Escribe un guard global que mande a `login` si la ruta tiene
`meta.requiereAuth` y no hay sesión.

**E9.** Marca la ruta `/admin` como protegida.

**E10.** Escribe la ruta 404 y di dónde tiene que ir.

**E11.** Declara `/ajustes` con dos hijas (`perfil` y `seguridad`) y di qué
tiene que tener el componente padre.

**E12.** Escribe un guard de componente que pida confirmación al salir si hay
cambios sin guardar.

---

## Soluciones

**E1.**
```ts
{ path: '/clientes', name: 'clientes', component: () => import('@/views/Clientes.vue') }
```

**E2.**
```ts
{ path: '/clientes/:id', name: 'cliente', component: () => import('@/views/Cliente.vue') }
```

**E3.** `<RouterLink :to="{ name: 'cliente', params: { id: 5 } }">Ver</RouterLink>`

**E4.** `router.push({ name: 'cliente', params: { id: 5 } });`

**E5.** `router.push({ path: '/buscar', query: { q: 'mouse' } });`

**E6.**
```ts
const route = useRoute();
const id = Number(route.params.id);
```

**E7.** Porque Vue reutiliza la misma instancia del componente al cambiar solo
el parámetro, así que `onMounted` no vuelve a correr. Se arregla con:
```ts
watch(() => route.params.id, cargar, { immediate: true });
```

**E8.**
```ts
router.beforeEach((hacia) => {
  const sesion = useSesionStore();
  if (hacia.meta.requiereAuth && !sesion.autenticado) {
    return { name: 'login', query: { volverA: hacia.fullPath } };
  }
});
```

**E9.** `{ path: '/admin', component: Admin, meta: { requiereAuth: true } }`

**E10.**
```ts
{ path: '/:cualquiera(.*)*', name: '404', component: () => import('@/views/NoEncontrado.vue') }
```
Va **al final** del array: las rutas se evalúan en orden y esta captura todo.

**E11.**
```ts
{
  path: '/ajustes',
  component: Ajustes,
  children: [
    { path: 'perfil', component: AjustesPerfil },
    { path: 'seguridad', component: AjustesSeguridad },
  ],
}
```
El componente `Ajustes.vue` tiene que incluir su propio `<RouterView />`.

**E12.**
```ts
import { onBeforeRouteLeave } from 'vue-router';

onBeforeRouteLeave(() => {
  if (hayCambiosSinGuardar.value) {
    return confirm('Tienes cambios sin guardar. ¿Salir igual?');
  }
});
```
