import React, { useMemo, useRef, useState } from 'react'
import dayjs from 'dayjs'

/**
 * This page provides an in-browser log analyzer. Users can upload .txt/.log/.csv files,
 * which are parsed client-side to extract metrics:
 * - total lines, errors, warnings
 * - detected threats via basic heuristics
 * - time range inferred from timestamps
 * It displays real-time parsing progress, a summary, a table preview, and simple charts.
 */

const MAX_PREVIEW_ROWS = 2000
const timestampRegexes = [
  // ISO 8601
  /\b(\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})?)\b/,
  // Common log format: 2025-08-26 12:34:56
  /\b(\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}:\d{2})\b/,
  // Syslog-ish: Aug 26 12:34:56
  /\b([A-Z][a-z]{2}\s+\d{1,2}\s+\d{2}:\d{2}:\d{2})\b/,
]

// PUBLIC_INTERFACE
export default function LogAnalyzer() {
  /** Log Analyzer page component: handles file upload, parsing, and visualization. */
  const [status, setStatus] = useState('idle') // idle | parsing | done | error
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const [results, setResults] = useState(null)
  const [filter, setFilter] = useState('all') // all|error|warn|threat
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)

  const onFilesSelected = async (files) => {
    if (!files || files.length === 0) return
    setStatus('parsing')
    setError('')
    setProgress(0)
    try {
      const aggregated = {
        totalLines: 0,
        errorLines: 0,
        warnLines: 0,
        threatLines: 0,
        firstTs: null,
        lastTs: null,
        sampleRows: [],
        levelCounts: { error: 0, warn: 0, info: 0, debug: 0, other: 0 },
        threatCounts: {},
        timeline: {}, // key by minute string
      }

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const text = await file.text()
        parseText(text, (update) => {
          mergeAgg(aggregated, update)
          // Approximate progress by file index; for large files, chunk updates set internal progress
          const base = (i / files.length) * 100
          setProgress(Math.min(99, Math.round(base + update.partialProgress / files.length)))
        })
      }
      setResults(finalizeAgg(aggregated))
      setProgress(100)
      setStatus('done')
    } catch (e) {
      console.error(e)
      setError(e?.message || 'Failed to parse files')
      setStatus('error')
    }
  }

  const onDrop = (e) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    onFilesSelected(files)
  }

  const filteredRows = useMemo(() => {
    if (!results) return []
    return results.sampleRows.filter((r) => {
      const levelOk =
        filter === 'all'
          ? true
          : filter === 'error'
          ? r.level === 'error'
          : filter === 'warn'
          ? r.level === 'warn'
          : filter === 'threat'
          ? r.isThreat
          : true
      const qOk = !query || r.raw.toLowerCase().includes(query.toLowerCase())
      return levelOk && qOk
    })
  }, [results, filter, query])

  return (
    <div className="section">
      <section className="card">
        <div className="card-header">
          <h1 className="card-title">Log Analyzer</h1>
          <div className="flex items-center gap-2">
            <button
              className="btn-secondary h-9"
              onClick={() => {
                setStatus('idle')
                setResults(null)
                setError('')
                setProgress(0)
                if (inputRef.current) inputRef.current.value = ''
              }}
            >
              Reset
            </button>
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Upload .txt, .log, or .csv files. Parsing occurs entirely in your browser. No data leaves
          your device. This is a heuristic analyzer for demo purposes.
        </p>
        <div
          className="mt-4 grid gap-4 lg:grid-cols-3"
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
        >
          <div className="rounded-lg border border-dashed border-gray-300 p-4 dark:border-gray-700">
            <label className="mb-2 block text-sm font-medium">Select files</label>
            <input
              ref={inputRef}
              type="file"
              accept=".txt,.log,.csv,text/plain,text/csv"
              multiple
              className="input"
              onChange={(e) => onFilesSelected(e.target.files)}
            />
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              You can also drag & drop files into this area.
            </p>
            {status === 'parsing' && (
              <div className="mt-3">
                <div className="mb-1 flex items-center justify-between text-xs text-gray-600 dark:text-gray-300">
                  <span>Parsing…</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 w-full rounded bg-gray-200 dark:bg-gray-800">
                  <div
                    className="h-2 rounded bg-brand-600 transition-all"
                    style={{ width: `${progress}%` }}
                    role="progressbar"
                    aria-valuenow={progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  />
                </div>
              </div>
            )}
            {status === 'error' && (
              <p className="mt-3 text-sm text-red-600 dark:text-red-400" role="alert">
                {error}
              </p>
            )}
          </div>

          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/60">
            <h3 className="mb-2 text-sm font-semibold">Quick Filters</h3>
            <div className="flex flex-wrap items-center gap-2">
              <select
                aria-label="Filter level"
                className="input h-9 w-44"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All lines</option>
                <option value="error">Errors</option>
                <option value="warn">Warnings</option>
                <option value="threat">Threats</option>
              </select>
              <div className="input-icon">
                <span className="icon">🔎</span>
                <input
                  aria-label="Search text"
                  className="input h-9 w-64"
                  placeholder="Search text…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Filters apply to the preview table for quick inspection.
            </p>
          </div>

          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/60">
            <h3 className="mb-2 text-sm font-semibold">Tips</h3>
            <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-300">
              <li>Recognized levels: error, warn, info, debug.</li>
              <li>Threat heuristics: keywords like attack, exploit, malware, intrusion, sql injection, xss.</li>
              <li>Timestamps detected from common formats to calculate time ranges.</li>
            </ul>
          </div>
        </div>
      </section>

      {results && (
        <>
          <SummaryCards results={results} />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <LevelBarChart levelCounts={results.levelCounts} />
            <ThreatBarChart threatCounts={results.threatCounts} />
            <TimelineChart timeline={results.timeline} />
          </div>
          <PreviewTable rows={filteredRows} total={results.sampleRows.length} />
        </>
      )}
    </div>
  )
}

function parseText(text, onPartial) {
  // Stream-like parse by chunks to keep UI responsive.
  const lines = text.split(/\r?\n/)
  let errorLines = 0
  let warnLines = 0
  let threatLines = 0
  let firstTs = null
  let lastTs = null
  const levelCounts = { error: 0, warn: 0, info: 0, debug: 0, other: 0 }
  const threatCounts = {}
  const sampleRows = []
  const timeline = {}

  const total = lines.length
  const CHUNK = 2000
  for (let i = 0; i < total; i++) {
    const raw = lines[i]
    if (!raw) {
      // still track empty lines as part of total
    }
    const level = inferLevel(raw)
    levelCounts[level] = (levelCounts[level] || 0) + 1
    if (level === 'error') errorLines++
    if (level === 'warn') warnLines++

    const { ts, tsStr } = inferTimestamp(raw)
    if (ts) {
      firstTs = firstTs ? Math.min(firstTs, ts) : ts
      lastTs = lastTs ? Math.max(lastTs, ts) : ts
      const minuteKey = dayjs(ts).format('YYYY-MM-DD HH:mm')
      timeline[minuteKey] = (timeline[minuteKey] || 0) + 1
    }

    const threat = inferThreat(raw)
    if (threat) {
      threatLines++
      threatCounts[threat] = (threatCounts[threat] || 0) + 1
    }

    if (sampleRows.length < MAX_PREVIEW_ROWS) {
      sampleRows.push({
        idx: i + 1,
        level,
        timestamp: ts ? tsStr : '',
        isThreat: !!threat,
        threatType: threat || '',
        raw,
      })
    }

    // Emit partial updates by chunk to update progress bar and keep UI responsive.
    if ((i + 1) % CHUNK === 0 || i === total - 1) {
      onPartial({
        partialProgress: Math.round(((i + 1) / total) * 100),
        delta: {
          totalLines: i + 1,
          errorLines,
          warnLines,
          threatLines,
          firstTs,
          lastTs,
          levelCounts,
          threatCounts,
          sampleRows: [...sampleRows], // allow consumer to keep building
          timeline,
        },
      })
    }
  }
}

function mergeAgg(agg, update) {
  const u = update.delta
  agg.totalLines += (u.totalLines - (agg._lastTotalDelta || 0))
  agg._lastTotalDelta = u.totalLines

  agg.errorLines = u.errorLines
  agg.warnLines = u.warnLines
  agg.threatLines = u.threatLines

  agg.firstTs = minMaybe(agg.firstTs, u.firstTs)
  agg.lastTs = maxMaybe(agg.lastTs, u.lastTs)

  // Merge dictionaries
  for (const k of Object.keys(u.levelCounts)) {
    agg.levelCounts[k] = (agg.levelCounts[k] || 0) + (u.levelCounts[k] || 0) - (agg._lastLevelCounts?.[k] || 0)
  }
  agg._lastLevelCounts = { ...u.levelCounts }

  for (const k of Object.keys(u.threatCounts)) {
    agg.threatCounts[k] = (agg.threatCounts[k] || 0) + (u.threatCounts[k] || 0) - (agg._lastThreatCounts?.[k] || 0)
  }
  agg._lastThreatCounts = { ...u.threatCounts }

  // Keep sampleRows reference from latest
  agg.sampleRows = u.sampleRows

  // Merge timeline by replacing with latest snapshot (since it’s cumulative within this file)
  agg.timeline = { ...u.timeline }
}

function finalizeAgg(agg) {
  const range =
    agg.firstTs && agg.lastTs
      ? `${dayjs(agg.firstTs).format('YYYY-MM-DD HH:mm:ss')} → ${dayjs(agg.lastTs).format(
          'YYYY-MM-DD HH:mm:ss'
        )}`
      : 'N/A'
  return {
    totalLines: agg.totalLines,
    errorLines: agg.errorLines,
    warnLines: agg.warnLines,
    threatLines: agg.threatLines,
    firstTs: agg.firstTs,
    lastTs: agg.lastTs,
    timeRange: range,
    levelCounts: agg.levelCounts,
    threatCounts: agg.threatCounts,
    sampleRows: agg.sampleRows,
    timeline: agg.timeline,
  }
}

function inferLevel(line) {
  const l = line.toLowerCase()
  if (/\berror\b|\berr\b|\bfail\b/.test(l)) return 'error'
  if (/\bwarn(ing)?\b/.test(l)) return 'warn'
  if (/\binfo\b/.test(l)) return 'info'
  if (/\bdebug\b|\btrace\b/.test(l)) return 'debug'
  return 'other'
}

const THREAT_KEYWORDS = [
  'attack',
  'exploit',
  'intrusion',
  'malware',
  'ransomware',
  'phishing',
  'ddos',
  'sql injection',
  'xss',
  'exfiltration',
  'bruteforce',
  'trojan',
  'worm',
]

function inferThreat(line) {
  const l = line.toLowerCase()
  for (const k of THREAT_KEYWORDS) {
    if (l.includes(k)) return k
  }
  return ''
}

function inferTimestamp(line) {
  for (const rx of timestampRegexes) {
    const m = line.match(rx)
    if (m && m[1]) {
      const tsStr = m[1]
      // Attempt parse with dayjs; if month-name format without year, assume current year
      let d
      if (/^[A-Z][a-z]{2}\s+\d{1,2}\s+\d{2}:\d{2}:\d{2}$/.test(tsStr)) {
        const withYear = `${new Date().getFullYear()} ${tsStr}`
        d = dayjs(withYear, 'YYYY MMM DD HH:mm:ss')
      } else {
        d = dayjs(tsStr)
      }
      if (d.isValid()) {
        return { ts: d.valueOf(), tsStr: d.format('YYYY-MM-DD HH:mm:ss') }
      }
    }
  }
  return { ts: 0, tsStr: '' }
}

function minMaybe(a, b) {
  if (a && b) return Math.min(a, b)
  return a || b || null
}

function maxMaybe(a, b) {
  if (a && b) return Math.max(a, b)
  return a || b || null
}

function SummaryCards({ results }) {
  const items = [
    { label: 'Total Lines', value: results.totalLines },
    { label: 'Errors', value: results.errorLines },
    { label: 'Warnings', value: results.warnLines },
    { label: 'Threats', value: results.threatLines },
    { label: 'Time Range', value: results.timeRange },
  ]
  return (
    <section className="card">
      <div className="card-header">
        <h2 className="card-title">Summary</h2>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {items.map((it) => (
          <div key={it.label} className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/60">
            <div className="text-sm text-gray-600 dark:text-gray-300">{it.label}</div>
            <div className="mt-1 text-2xl font-semibold">{it.value}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

function LevelBarChart({ levelCounts }) {
  const levels = ['error', 'warn', 'info', 'debug', 'other']
  const max = Math.max(1, ...levels.map((k) => levelCounts[k] || 0))
  return (
    <section className="card">
      <div className="card-header">
        <h2 className="card-title">Log Levels</h2>
      </div>
      <div className="space-y-2">
        {levels.map((k) => {
          const v = levelCounts[k] || 0
          const pct = Math.round((v / max) * 100)
          const color =
            k === 'error' ? 'bg-red-600' : k === 'warn' ? 'bg-yellow-500' : 'bg-brand-600'
          return (
            <div key={k}>
              <div className="flex items-center justify-between text-xs">
                <span className="capitalize">{k}</span>
                <span>{v}</span>
              </div>
              <div className="h-2 w-full rounded bg-gray-200 dark:bg-gray-800">
                <div className={`h-2 rounded ${color}`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function ThreatBarChart({ threatCounts }) {
  const entries = Object.entries(threatCounts).sort((a, b) => b[1] - a[1]).slice(0, 8)
  const max = Math.max(1, ...entries.map(([, v]) => v))
  return (
    <section className="card">
      <div className="card-header">
        <h2 className="card-title">Top Threat Keywords</h2>
      </div>
      {entries.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">No threats detected.</p>
      ) : (
        <div className="space-y-2">
          {entries.map(([k, v]) => {
            const pct = Math.round((v / max) * 100)
            return (
              <div key={k}>
                <div className="flex items-center justify-between text-xs">
                  <span className="capitalize">{k}</span>
                  <span>{v}</span>
                </div>
                <div className="h-2 w-full rounded bg-gray-200 dark:bg-gray-800">
                  <div className="h-2 rounded bg-green-600" style={{ width: `${pct}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}

function TimelineChart({ timeline }) {
  const entries = Object.entries(timeline).sort((a, b) => (a[0] < b[0] ? -1 : 1)).slice(-60)
  const max = Math.max(1, ...entries.map(([, v]) => v))
  return (
    <section className="card">
      <div className="card-header">
        <h2 className="card-title">Events Over Time (per minute)</h2>
      </div>
      {entries.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">No timestamps detected.</p>
      ) : (
        <div className="flex h-32 items-end gap-1">
          {entries.map(([k, v]) => {
            const h = Math.max(4, Math.round((v / max) * 100))
            return (
              <div key={k} className="group relative flex-1">
                <div
                  className="w-full rounded-t bg-brand-600"
                  style={{ height: `${h}%` }}
                  aria-label={`${k}: ${v} events`}
                />
                <div className="absolute inset-x-0 -bottom-6 hidden text-[10px] text-gray-500 group-hover:block">
                  {k.slice(5)}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}

function PreviewTable({ rows, total }) {
  return (
    <section className="card">
      <div className="card-header">
        <h2 className="card-title">Preview ({rows.length} of ~{total} rows)</h2>
        <a
          className="btn h-9"
          href={makeCSVBlobUrl(rows)}
          download={`log_preview_${Date.now()}.csv`}
          aria-label="Download preview as CSV"
        >
          Export CSV
        </a>
      </div>
      <div className="max-h-96 overflow-auto rounded-lg">
        <table className="table" role="table" aria-label="Parsed log preview">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Timestamp</th>
              <th scope="col">Level</th>
              <th scope="col">Threat</th>
              <th scope="col">Line</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.idx}>
                <td className="whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">
                  {r.idx}
                </td>
                <td className="whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">
                  {r.timestamp || ''}
                </td>
                <td>
                  <span
                    className={
                      'badge ' +
                      (r.level === 'error'
                        ? 'badge-danger'
                        : r.level === 'warn'
                        ? 'badge-warning'
                        : 'badge-neutral')
                    }
                  >
                    {r.level.toUpperCase()}
                  </span>
                </td>
                <td className="whitespace-nowrap text-xs">
                  {r.isThreat ? <span className="badge badge-success">{r.threatType}</span> : ''}
                </td>
                <td className="max-w-[0]">
                  <p className="truncate" title={r.raw}>
                    {r.raw}
                  </p>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                  No rows to display. Upload a file or adjust filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function makeCSVBlobUrl(rows) {
  const header = ['index', 'timestamp', 'level', 'isThreat', 'threatType', 'raw']
  const csv = [header, ...rows.map((r) => [
    r.idx,
    r.timestamp,
    r.level,
    r.isThreat,
    r.threatType,
    (r.raw || '').replaceAll(',', ';'),
  ])]
    .map((r) => r.join(','))
    .join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  return URL.createObjectURL(blob)
}
