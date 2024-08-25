/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

type ServiceEnvType = 'dev' | 'test' | 'prod' | 'development'
interface ImportMetaEnv {
  /** Project base address */
  readonly RENDERER_VITE_BASE_URL: string
  /** Project title */
  readonly RENDERER_VITE_APP_NAME: string
  /** Enable request proxy */
  readonly RENDERER_VITE_HTTP_PROXY?: 'Y' | 'N'
  /** Whether to enable package compression */
  readonly RENDERER_VITE_BUILD_COMPRESS?: 'Y' | 'N'
  /** Compression algorithm type */
  readonly RENDERER_VITE_COMPRESS_TYPE?: 'gzip' | 'brotliCompress' | 'deflate' | 'deflateRaw'
  /** Routing mode */
  readonly RENDERER_VITE_ROUTE_MODE?: 'hash' | 'web'
  /** Routing loading mode */
  readonly RENDERER_VITE_ROUTE_LOAD_MODE: 'static' | 'dynamic'
  /** First page load */
  readonly RENDERER_VITE_HOME_PATH: string
  /** Copyright information */
  readonly RENDERER_VITE_COPYRIGHT_INFO: string
  /** Automatically refresh token */
  readonly RENDERER_VITE_AUTO_REFRESH_TOKEN: 'Y' | 'N'
  /** Default language */
  readonly RENDERER_VITE_DEFAULT_LANG: 'en_US'//App.lang
  /** Default storage prefix */
  readonly RENDERER_VITE_STORAGE_PREFIX: ''
  /** Environment type of backend service */
  readonly MODE: ServiceEnvType
}
interface ImportMeta {
  readonly env: ImportMetaEnv
}
