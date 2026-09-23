# 51 · Patrones que aparecen en proyectos grandes

> **Nivel 6 · Vue**
> `provide/inject`, `Teleport`, `Suspense`, componentes asíncronos,
> `KeepAlive`, `<component :is>` y directivas propias. No los vas a escribir
> todos los días, pero los vas a **encontrar**.

---

## 51.1 · `provide` / `inject`

Pasar una prop por cuatro niveles para que llegue abajo se llama *prop
drilling*. `provide/inject` lo salta:

```ts
// componente ANCESTRO
import { provide, ref, readonly } from 'vue';

const tema = ref<'claro' | 'oscuro'>('claro');
function alternar() { tema.value = tema.value === 'claro' ? 'oscuro' : 'claro'; }

provide('tema', { tema: readonly(tema), alternar });
```

```ts
// cualquier DESCENDIENTE, por profundo que esté
import { inject } from 'vue';

const { tema, alternar } = inject('tema')!;
```

Con tipos de verdad se usa una **clave inyectable**:

```ts
// tipos/claves.ts
import type { InjectionKey, Ref } from 'vue';

export interface ContextoTema {
  tema: Readonly<Ref<'claro' | 'oscuro'>>;
  alternar: () => void;
}

export const CLAVE_TEMA: InjectionKey<ContextoTema> = Symbol('tema');
```

```ts
provide(CLAVE_TEMA, { tema: readonly(tema), alternar });   // ancestro
const ctx = inject(CLAVE_TEMA);                            // descendiente: ya tipado
```

| | `provide/inject` | Pinia |
|---|---|---|
| Alcance | el subárbol de componentes | toda la app |
| Devtools | no | sí |
| Ideal para | librerías de componentes, temas, formularios compuestos | estado de negocio |

Se usa sobre todo **dentro de un componente compuesto**: un `<Tabs>` que
comparte el estado con sus `<Tab>` sin props.

---

## 51.2 · `Teleport` — sacar HTML de su sitio

```vue
<template>
  <div class="tarjeta">
    <button @click="abierto = true">Abrir</button>

    <Teleport to="body">
      <div v-if="abierto" class="modal-fondo" @click.self="abierto = false">
        <div class="modal">...</div>
      </div>
    </Teleport>
  </div>
</template>
```

El modal se declara aquí (con acceso al estado local) pero se **dibuja** como
hijo de `<body>`. Es la solución al clásico "mi modal queda cortado o detrás de
otra cosa" por culpa de `overflow: hidden` o del `z-index` del padre.

Se usa para modales, tooltips, notificaciones y menús desplegables.

---

## 51.3 · Componentes asíncronos y `Suspense`

```ts
import { defineAsyncComponent } from 'vue';

const GraficoPesado = defineAsyncComponent(
  () => import('@/components/GraficoPesado.vue'),
);
```

El código de ese componente se descarga **cuando se usa**, no al abrir la app.
Ideal para gráficos, editores de texto enriquecido o mapas.

Con estados de carga y error:

```ts
const Grafico = defineAsyncComponent({
  loader: () => import('@/components/Grafico.vue'),
  loadingComponent: Cargando,
  errorComponent: ErrorCarga,
  delay: 200,       // no muestra el "cargando" si tarda menos de 200 ms
  timeout: 10000,
});
```

`<Suspense>` deja esperar a componentes con `await` en el nivel superior:

```vue
<Suspense>
  <template #default>
    <PanelConDatos />     <!-- usa await arriba del script -->
  </template>
  <template #fallback>
    <p>Cargando panel...</p>
  </template>
</Suspense>
```

```vue
<!-- PanelConDatos.vue -->
<script setup lang="ts">
const datos = await api.traer();     // top-level await: solo dentro de Suspense
</script>
```

> `Suspense` sigue marcado como experimental. Muchos equipos prefieren el
> patrón manual de `cargando / error / datos` del tema 50, que es más
> predecible.

---

## 51.4 · `KeepAlive` — no destruir al cambiar

```vue
<RouterView v-slot="{ Component }">
  <KeepAlive>
    <component :is="Component" />
  </KeepAlive>
</RouterView>
```

Con `KeepAlive`, el componente **no se destruye** al salir: conserva scroll,
filtros y texto escrito. Al volver no recarga nada.

Sus hooks propios:

```ts
onActivated(() => { /* volvió a la pantalla */ });
onDeactivated(() => { /* se fue, pero sigue vivo */ });
```

```vue
<KeepAlive :include="['Listado', 'Buscador']" :max="5">
```

> ⚠ Lo que queda en caché **no** se refresca solo. Si los datos cambian seguido,
> recarga en `onActivated`.

---

## 51.5 · `<component :is>` — componentes dinámicos

```vue
<script setup lang="ts">
import Texto from './campos/Texto.vue';
import Numero from './campos/Numero.vue';
import Fecha from './campos/Fecha.vue';

const mapa = { texto: Texto, numero: Numero, fecha: Fecha };

interface Campo { tipo: keyof typeof mapa; nombre: string }
defineProps<{ campos: Campo[] }>();
</script>

<template>
  <component
    v-for="c in campos"
    :key="c.nombre"
    :is="mapa[c.tipo]"
    :nombre="c.nombre"
  />
</template>
```

Es la base de los formularios definidos por configuración (el backend manda qué
campos hay y el front los dibuja).

También sirve para pestañas:

```vue
<component :is="pestanaActiva" />
```

---

## 51.6 · Directivas propias

```ts
// directivas/foco.ts
import type { Directive } from 'vue';

export const vFoco: Directive<HTMLInputElement> = {
  mounted(el) { el.focus(); },
};
```

```vue
<script setup lang="ts">
import { vFoco } from '@/directivas/foco';
</script>

<template>
  <input v-foco />
</template>
```

Una directiva sirve cuando necesitas tocar el DOM directamente en varios
lugares: foco, tooltips, "clic afuera", lazy loading de imágenes. Si lo que
quieres es lógica y estado, usa un composable.

Registro global:

```ts
app.directive('foco', vFoco);
```

---

## 51.7 · Errores y rendimiento

**Capturar errores de los hijos:**

```ts
onErrorCaptured((error, instancia, info) => {
  registrar(error, info);
  return false;     // false = el error no sigue subiendo
});
```

```ts
// main.ts — red de seguridad global
app.config.errorHandler = (error, instancia, info) => {
  console.error('Error global:', error, info);
};
```

**Rendimiento, en orden de utilidad real:**

1. Rutas y componentes pesados con `import()` dinámico.
2. `v-show` en vez de `v-if` para lo que alterna mucho.
3. `:key` correcta en los `v-for` (una key mala hace redibujar de más).
4. `computed` en vez de llamar funciones en el template.
5. `shallowRef` para estructuras grandes que solo se reemplazan enteras.
6. `v-memo` para listas enormes (último recurso).

No optimices sin medir: abre Vue DevTools → pestaña Performance.

---

## Ejercicios

**E1.** Un ancestro quiere compartir `{ usuario, salir }` con todos sus
descendientes. Escribe el `provide`.

**E2.** Escribe el `inject` correspondiente en un descendiente.

**E3.** Escribe la clave inyectable tipada (`InjectionKey`) para ese contexto.

**E4.** Escribe un modal que se dibuje directamente en el `<body>`.

**E5.** Importa `GraficoPesado.vue` de forma asíncrona.

**E6.** ¿Para qué sirve `delay: 200` en `defineAsyncComponent`?

**E7.** Escribe el `RouterView` que conserva el estado de las vistas.

**E8.** ¿Qué hook se ejecuta al volver a una vista que estaba en `KeepAlive`?

**E9.** Escribe un `<component :is>` que dibuje el componente guardado en la
variable `actual`.

**E10.** Escribe una directiva `v-foco` que ponga el foco al montarse.

**E11.** ¿`provide/inject` o Pinia? 1) el usuario logueado de toda la app,
2) el estado compartido entre un `<Tabs>` y sus `<Tab>`.

**E12.** Nombra tres cosas concretas que harías para que una app Vue cargue más
rápido.

---

## Soluciones

**E1.**
```ts
provide('sesion', { usuario: readonly(usuario), salir });
```

**E2.**
```ts
const { usuario, salir } = inject('sesion')!;
```

**E3.**
```ts
import type { InjectionKey, Ref } from 'vue';

export interface ContextoSesion {
  usuario: Readonly<Ref<Usuario | null>>;
  salir: () => void;
}
export const CLAVE_SESION: InjectionKey<ContextoSesion> = Symbol('sesion');
```

**E4.**
```vue
<Teleport to="body">
  <div v-if="abierto" class="modal-fondo" @click.self="abierto = false">
    <div class="modal">...</div>
  </div>
</Teleport>
```

**E5.**
```ts
const GraficoPesado = defineAsyncComponent(
  () => import('@/components/GraficoPesado.vue'),
);
```

**E6.** Para no mostrar el componente de "cargando" si la carga tarda menos de
200 ms: evita el parpadeo molesto.

**E7.**
```vue
<RouterView v-slot="{ Component }">
  <KeepAlive>
    <component :is="Component" />
  </KeepAlive>
</RouterView>
```

**E8.** `onActivated`.

**E9.** `<component :is="actual" />`

**E10.**
```ts
export const vFoco: Directive<HTMLInputElement> = {
  mounted(el) { el.focus(); },
};
```

**E11.** 1 → Pinia · 2 → `provide/inject`

**E12.** Cargar las rutas con `import()` dinámico; sacar los componentes
pesados a componentes asíncronos; revisar que los `v-for` tengan una `:key`
estable y que el filtrado esté en `computed` y no en el template.
