import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin, loadEnv } from 'electron-vite'
// import vue from '@vitejs/plugin-vue'
// import AutoImport from 'unplugin-auto-import/vite'
// import Components from 'unplugin-vue-components/vite'
// import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import { createVitePlugins } from './src/renderer/build/plugins'
import { createViteProxy } from './src/renderer/build/proxy'
import { serviceConfig } from './src/renderer/build/service.config'

export default defineConfig(({ command, mode }) => {
  // const env = loadEnv(mode)
  const env = loadEnv(mode, __dirname, '') as ImportMetaEnv
  const envConfig = serviceConfig[mode]// as ServiceEnvType
  return {
    main: {
      plugins: [externalizeDepsPlugin()],
      resolve: {
        alias: {
          '@mongodb': resolve('src/main/mongodb'),
          '@services': resolve('src/services'),
          '@utils': resolve('src/utils'),
          '@interfaces': resolve('src/interfaces')
        }
      }
    },
    preload: {
      plugins: [externalizeDepsPlugin()]
    },
    renderer: {
      resolve: {
        alias: {
          '@': resolve('src/renderer/src'),
          '@src': resolve('src'),
          '@renderer': resolve('src/renderer/src'),
          '@services': resolve('src/services'),
          '@utils': resolve('src/utils'),
          '@interfaces': resolve('src/interfaces')
        },
        sqlite3: { type: 'cjs' }
      },
      // server: {
      //   host: '0.0.0.0',
      //   proxy: env.VITE_HTTP_PROXY === 'Y' ? createViteProxy(env) : undefined
      // },
      plugins: createVitePlugins(env), //[
      //   vue(),
      //   AutoImport({
      //     resolvers: [NaiveUiResolver()]
      //   }),
      //   Components({
      //     resolvers: [NaiveUiResolver()]
      //   })
      // ],
      define: {
        APP_VERSION: JSON.stringify(process.env.npm_package_version)
      },
      server: {
        host: '0.0.0.0',
        proxy: env.VITE_HTTP_PROXY === 'Y' ? createViteProxy(envConfig) : undefined
      },
      optimizeDeps: {
        include: ['echarts', 'md-editor-v3', 'quill']
      }
    }
  }
})
