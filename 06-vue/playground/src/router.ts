// Las rutas de la app. Cada ruta dice qué componente mostrar.
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'lab', component: () => import('./views/Laboratorio.vue') },
    { path: '/lista', name: 'lista', component: () => import('./views/Lista.vue') },
    { path: '/contador', name: 'contador', component: () => import('./views/Contador.vue') },
    // ruta con parámetro: /lista/3
    { path: '/lista/:id', name: 'detalle', component: () => import('./views/Detalle.vue') },
  ],
});

export default router;
