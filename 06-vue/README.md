# Nivel 6 · Vue 3 + TypeScript — cómo trabajar este nivel

A diferencia de los niveles 1–5, aquí no hay corrector automático: Vue necesita
un navegador. Cada lección es un archivo `.md` con **teoría + ejemplos +
ejercicios + soluciones**, todo en el mismo archivo, y un **playground** al lado
para probar de verdad lo que leas.

---

## Arrancar el playground

```
cd 06-vue/playground
npm run dev
```

Abre `http://localhost:5173`. Guarda cualquier archivo y la página se actualiza
sola.

> Las dependencias ya están instaladas. Si alguna vez falta algo:
> `npm install` dentro de `06-vue/playground`.

Otros comandos:

```
npm run tipos      # revisa los tipos (vue-tsc), sin ejecutar nada
npm run build      # compila a dist/, como en producción
```

---

## Qué hay dentro del playground

```
playground/
├── index.html                  la única página
├── vite.config.ts              plugins + alias @  + (aquí iría el proxy)
├── tsconfig.json               configuración de TypeScript
├── env.d.ts                    tipos de los .vue y de import.meta.env
└── src/
    ├── main.ts                 arranque: createApp + pinia + router
    ├── App.vue                 componente raíz con el menú
    ├── router.ts               las rutas
    ├── estilos.css             cuatro estilos para que no duela la vista
    ├── views/
    │   ├── Laboratorio.vue     ← TU HOJA EN BLANCO: pega aquí los ejemplos
    │   ├── Lista.vue           patrón completo: cargar / error / vacío / datos
    │   ├── Detalle.vue         ruta con parámetro (/lista/3)
    │   └── Contador.vue        Pinia en acción
    ├── components/
    │   └── TarjetaDemo.vue     props tipadas + emits + slot
    ├── composables/
    │   └── useUsuarios.ts      composable que llama a una API real
    └── stores/
        └── contador.ts         store de Pinia
```

**`views/Laboratorio.vue` es donde vas a trabajar.** Borra lo que hay y pega lo
que estés practicando. Los demás archivos son ejemplos de referencia: cuando
una lección hable de composables, abre `composables/useUsuarios.ts` y míralo.

---

## Orden de las lecciones

| # | Archivo | Qué se aprende |
|---|---|---|
| 38 | `38-anatomia-de-un-proyecto.md` | carpetas, main.ts, vite.config, `.env`, scripts |
| 39 | `39-sfc-y-script-setup.md` | los 3 bloques, `{{ }}`, `:atributo`, `@evento`, estilos |
| 40 | `40-reactividad-ref-reactive.md` | `ref`, `reactive`, `.value`, `toRefs` |
| 41 | `41-computed-y-watch.md` | valores derivados vs efectos |
| 42 | `42-directivas-y-listas.md` | `v-if`, `v-show`, `v-for` + `:key`, `v-model` |
| 43 | `43-props-tipadas.md` | `defineProps`, `withDefaults`, solo lectura |
| 44 | `44-emits-y-v-model.md` | `defineEmits`, `defineModel`, comunicación |
| 45 | `45-slots.md` | slots por defecto, con nombre y con datos |
| 46 | `46-ciclo-de-vida-y-refs.md` | `onMounted`, `onUnmounted`, template refs, `nextTick` |
| 47 | `47-composables.md` | reutilizar lógica, estado local vs compartido |
| 48 | `48-pinia.md` | stores, `storeToRefs`, acciones, getters |
| 49 | `49-vue-router.md` | rutas, params, guards, rutas anidadas |
| 50 | `50-http-y-formularios.md` | services, 4 estados, validación, debounce |
| 51 | `51-patrones-avanzados.md` | provide/inject, Teleport, Suspense, KeepAlive |
| 52 | `52-leer-un-proyecto-ajeno.md` | método para entender y depurar código ajeno |

Ve en orden. Cada lección asume la anterior.

---

## Cómo trabajar una lección

1. Léela de corrido (son 10 minutos).
2. Copia los ejemplos en `Laboratorio.vue` y **tócalos**: cambia valores, rompe
   cosas a propósito y mira el error. Aprender a leer los errores es la mitad
   del trabajo.
3. Haz los ejercicios del final.
4. Compara con las soluciones, que están en el mismo archivo.
5. Antes de pasar a la siguiente, corre `npm run tipos`: si pasa, no dejaste
   nada roto.

---

## Si el proyecto del trabajo usa otra cosa

Este playground usa Vue 3.5, Vite, Pinia y Vue Router "a secas". Si en el
trabajo hay una librería de componentes (Vuetify, PrimeVue, Element Plus), el
90% de lo que hay aquí sigue valiendo: esas librerías son **componentes** que
se usan con las mismas props, eventos y slots de la lección 43 a la 45.

Mira el `package.json` del proyecto y compara con la lección 52.1.
