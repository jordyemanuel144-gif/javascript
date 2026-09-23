// Punto de entrada de la app. Esto es lo primero que corre.
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './estilos.css';

const app = createApp(App);   // 1) crea la app a partir del componente raíz
app.use(createPinia());       // 2) le enchufa Pinia (el store)
app.use(router);              // 3) y el router
app.mount('#app');            // 4) la pega en el <div id="app"> del index.html
