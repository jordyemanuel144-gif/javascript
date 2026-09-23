/// <reference types="vite/client" />

// Sin esto, TypeScript no sabe qué es un archivo .vue y da el error
// "Cannot find module './Algo.vue' or its corresponding type declarations".
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const componente: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>;
  export default componente;
}

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
