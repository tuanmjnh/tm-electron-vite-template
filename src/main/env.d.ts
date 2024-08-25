/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly MAIN_VITE_MONGODB: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
