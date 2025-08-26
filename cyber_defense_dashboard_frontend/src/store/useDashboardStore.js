/* eslint-env browser */
import { create } from 'zustand'
import { v4 as uuid } from 'uuid'
import dayjs from 'dayjs'

const severities = ['critical', 'high', 'medium', 'low']
const sources = ['IDS', 'Firewall', 'SIEM', 'EDR', 'WAF', 'Proxy']

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generateAlert() {
  const severity = randomItem(severities)
  const source = randomItem(sources)
  const id = uuid()
  const ts = Date.now()
  const msg = `Detected ${severity.toUpperCase()} event from ${source}: ${Math.random()
    .toString(36)
    .slice(2, 8)}`
  return {
    id,
    timestamp: ts,
    severity,
    source,
    message: msg,
    acknowledged: false,
    muted: false,
  }
}

function generateActivity(type, detail) {
  return {
    id: uuid(),
    timestamp: Date.now(),
    type,
    detail,
  }
}

// PUBLIC_INTERFACE
export const useDashboardStore = create((set, get) => ({
  alerts: [],
  health: {
    cpu: 18,
    memory: 42,
    disk: 61,
    endpointsOnline: 124,
    endpointsTotal: 130,
    lastUpdated: Date.now(),
  },
  incidents: {
    top: [],
    trending: [],
  },
  activity: [],
  streaming: false,
  streamIntervalId: null,

  // PUBLIC_INTERFACE
  startStreaming: () => {
    if (get().streaming) return
    const interval = window.setInterval(() => {
      const alert = generateAlert()
      set((state) => ({
        alerts: [alert, ...state.alerts].slice(0, 200),
        activity: [
          generateActivity('ALERT', `${alert.severity.toUpperCase()} from ${alert.source}`),
          ...state.activity,
        ].slice(0, 500),
      }))
    }, 1500 + Math.random() * 1500)
    set({ streaming: true, streamIntervalId: interval })
  },

  // PUBLIC_INTERFACE
  stopStreaming: () => {
    const id = get().streamIntervalId
    if (id) window.clearInterval(id)
    set({ streaming: false, streamIntervalId: null })
  },

  // PUBLIC_INTERFACE
  acknowledgeAlert: (id) =>
    set((state) => ({
      alerts: state.alerts.map((a) => (a.id === id ? { ...a, acknowledged: true } : a)),
      activity: [generateActivity('ACK', `Alert ${id} acknowledged`), ...state.activity],
    })),

  // PUBLIC_INTERFACE
  muteAlert: (id) =>
    set((state) => ({
      alerts: state.alerts.map((a) => (a.id === id ? { ...a, muted: true } : a)),
      activity: [generateActivity('MUTE', `Alert ${id} muted`), ...state.activity],
    })),

  // PUBLIC_INTERFACE
  clearAlert: (id) =>
    set((state) => ({
      alerts: state.alerts.filter((a) => a.id !== id),
      activity: [generateActivity('CLEAR', `Alert ${id} cleared`), ...state.activity],
    })),

  // PUBLIC_INTERFACE
  updateHealth: (partial) =>
    set((state) => ({
      health: { ...state.health, ...partial, lastUpdated: Date.now() },
    })),

  // PUBLIC_INTERFACE
  seedIncidents: () =>
    set(() => {
      const now = dayjs()
      const top = Array.from({ length: 5 }).map((_, i) => ({
        id: uuid(),
        title: `Incident #${1000 + i}`,
        severity: randomItem(severities),
        count: 20 - i * 3,
        lastSeen: now.subtract(i * 2, 'hour').toISOString(),
      }))
      const trending = ['Phishing', 'Ransomware', 'DDoS', 'Privilege Escalation', 'SQL Injection'].map(
        (name) => ({
          id: uuid(),
          name,
          delta: (Math.random() * 100 - 50).toFixed(1),
        })
      )
      return { incidents: { top, trending } }
    }),

  // PUBLIC_INTERFACE
  clearAll: () =>
    set(() => ({
      alerts: [],
      activity: [],
    })),
}))
