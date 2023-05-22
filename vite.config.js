import {defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default ({ mode }) => {
  const root = process.cwd();
  const env = loadEnv(mode, root);

  return {
    base: env.VITE_APP_PUBLIC_PATH,
    server: {
      port: 8001
    },
    plugins: [vue()],
  }
}
