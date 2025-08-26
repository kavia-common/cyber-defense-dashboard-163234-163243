import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(() => {
  // Prefer import.meta.env for Vite; fallback to process.env for lints in config context
  const env = {
    VITE_APP_NAME: (process.env?.VITE_APP_NAME ?? undefined),
    VITE_SIM_ALERT_INTERVAL_MS: (process.env?.VITE_SIM_ALERT_INTERVAL_MS ?? undefined),
    VITE_SIM_METRICS_INTERVAL_MS: (process.env?.VITE_SIM_METRICS_INTERVAL_MS ?? undefined),
  }

  return {
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      allowedHosts: ['.kavia.ai'],
      port: 3000,
      strictPort: true,
      cors: true,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      watch: {
        usePolling: true
      }
    },
    define: {
      __APP_NAME__: JSON.stringify(env.VITE_APP_NAME || 'Cyber Defense Dashboard'),
      __SIM_ALERT_INTERVAL_MS__: JSON.stringify(Number(env.VITE_SIM_ALERT_INTERVAL_MS || 3500)),
      __SIM_METRICS_INTERVAL_MS__: JSON.stringify(Number(env.VITE_SIM_METRICS_INTERVAL_MS || 2500))
    }
  }
})
