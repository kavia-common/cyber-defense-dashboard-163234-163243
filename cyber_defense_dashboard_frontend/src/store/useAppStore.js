import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { format } from 'date-fns'

const ALERT_LEVELS = ['info', 'warning', 'danger']

function randChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generateAlert() {
  const threats = [
    'Port scan detected',
    'Brute-force attempt',
    'Malware signature match',
    'Suspicious login',
    'DDoS pattern anomaly',
    'Firewall rule triggered',
    'Exfiltration attempt',
    'Ransomware IOC found',
  ]
  const src = ['10.0.0.5', '172.16.4.8', '192.168.1.34', '8.8.8.8', '198.51.100.3']
  const sev = randChoice(ALERT_LEVELS)
  return {
    id: (globalThis.crypto && globalThis.crypto.randomUUID ? globalThis.crypto.randomUUID() : Math.random().toString(36).slice(2)),
    time: new Date().toISOString(),
    title: randChoice(threats),
    level: sev,
    source: randChoice(src),
    acknowledged: false,
  }
}

function generateMetrics(prev = null) {
  const jitter = (base, amplitude, min = 0, max = 100) => {
    const delta = (Math.random() - 0.5) * amplitude
    return Math.min(max, Math.max(min, Math.round((base + delta) * 10) / 10))
  }

  const baseCpu = prev?.cpu ?? 35
  const baseMem = prev?.memory ?? 58
  const baseNet = prev?.network ?? 120
  const baseDisk = prev?.disk ?? 61

  return {
    cpu: jitter(baseCpu, 12, 1, 100),
    memory: jitter(baseMem, 6, 1, 100),
    network: jitter(baseNet, 50, 10, 1000), // Mbps
    disk: jitter(baseDisk, 8, 1, 100),
    updatedAt: new Date().toISOString(),
  }
}

function generateActivity() {
  const actions = [
    'User login',
    'Policy updated',
    'Rule created',
    'Report exported',
    'Log archived',
    'Integration heartbeat',
  ]
  const users = ['analyst_a', 'analyst_b', 'system', 'admin']
  return {
    id: crypto.randomUUID(),
    time: new Date().toISOString(),
    user: randChoice(users),
    action: randChoice(actions),
  }
}

export const useAppStore = create(
  persist(
    (set, get) => ({
      // Theme
      darkMode: true,
      // Auth stub
      user: null,
      // Data
      alerts: [],
      metrics: generateMetrics(),
      incidents: [],
      activity: [],
      mutedLevels: [],

      // PUBLIC_INTERFACE
      toggleDarkMode: () =>
        set((s) => ({ darkMode: !s.darkMode })),

      // PUBLIC_INTERFACE
      login: (username) =>
        set(() => ({ user: { username, role: 'analyst', loggedInAt: new Date().toISOString() } })),

      // PUBLIC_INTERFACE
      logout: () => set(() => ({ user: null })),

      // PUBLIC_INTERFACE
      addAlert: (alert) =>
        set((s) => ({ alerts: [alert, ...s.alerts].slice(0, 200) })),

      // PUBLIC_INTERFACE
      ackAlert: (id) =>
        set((s) => ({
          alerts: s.alerts.map((a) => (a.id === id ? { ...a, acknowledged: true } : a)),
        })),

      // PUBLIC_INTERFACE
      clearAlerts: () => set(() => ({ alerts: [] })),

      // PUBLIC_INTERFACE
      muteLevel: (level) =>
        set((s) => ({ mutedLevels: Array.from(new Set([...s.mutedLevels, level])) })),

      // PUBLIC_INTERFACE
      unmuteLevel: (level) =>
        set((s) => ({ mutedLevels: s.mutedLevels.filter((l) => l !== level) })),

      // PUBLIC_INTERFACE
      setMetrics: (metrics) => set(() => ({ metrics })),

      // PUBLIC_INTERFACE
      pushIncident: (incident) =>
        set((s) => ({ incidents: [incident, ...s.incidents].slice(0, 50) })),

      // PUBLIC_INTERFACE
      addActivity: (entry) =>
        set((s) => ({ activity: [entry, ...s.activity].slice(0, 200) })),

      // Derived/public helpers
      // PUBLIC_INTERFACE
      getVisibleAlerts: () => {
        const { alerts, mutedLevels } = get()
        return alerts.filter((a) => !mutedLevels.includes(a.level))
      },

      // Simulation controls
      _simHandles: { alerts: null, metrics: null, activity: null },

      // PUBLIC_INTERFACE
      startSimulations: () => {
        const handles = get()._simHandles
        if (!handles.alerts) {
          handles.alerts = globalThis.setInterval(() => {
            const alert = generateAlert()
            get().addAlert(alert)
            // Also derive incident probability
            if (Math.random() > 0.6) {
              get().pushIncident({
                id: (globalThis.crypto && globalThis.crypto.randomUUID ? globalThis.crypto.randomUUID() : Math.random().toString(36).slice(2)),
                title: alert.title,
                severity: alert.level,
                count: Math.floor(Math.random() * 5) + 1,
                lastSeen: alert.time,
              })
            }
          }, (typeof __SIM_ALERT_INTERVAL_MS__ !== 'undefined' && typeof __SIM_ALERT_INTERVAL_MS__ === 'number') ? __SIM_ALERT_INTERVAL_MS__ : 3500)
        }
        if (!handles.metrics) {
          handles.metrics = globalThis.setInterval(() => {
            set({ metrics: generateMetrics(get().metrics) })
          }, (typeof __SIM_METRICS_INTERVAL_MS__ !== 'undefined' && typeof __SIM_METRICS_INTERVAL_MS__ === 'number') ? __SIM_METRICS_INTERVAL_MS__ : 2500)
        }
        if (!handles.activity) {
          handles.activity = globalThis.setInterval(() => {
            get().addActivity(generateActivity())
          }, 4500)
        }
        set({ _simHandles: handles })
      },

      // PUBLIC_INTERFACE
      stopSimulations: () => {
        const handles = get()._simHandles
        Object.values(handles).forEach((h) => h && globalThis.clearInterval(h))
        set({ _simHandles: { alerts: null, metrics: null, activity: null } })
      },

      // PUBLIC_INTERFACE
      formatTime: (iso) => format(new Date(iso), 'PP pp'),
    }),
    {
      name: 'cyber-defense-dashboard',
      version: 1,
      partialize: (state) => ({
        darkMode: state.darkMode,
        user: state.user,
        mutedLevels: state.mutedLevels,
      }),
    }
  )
)
