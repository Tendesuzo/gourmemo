/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE: string
  // 他に必要な環境変数があればここに追記
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
