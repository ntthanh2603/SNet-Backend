/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly BACKEND_PORT: string;
  readonly BACKEND_HOST: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
