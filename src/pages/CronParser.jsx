import React, { useState } from 'react'
// We'll use cron-parser for parsing cron expressions
// Install with: npm install cron-parser
import CronExpressionParser from 'cron-parser'

function CronParser() {
  const [fields, setFields] = useState({
    minute: '*',
    hour: '*',
    dayOfMonth: '*',
    month: '*',
    dayOfWeek: '*',
  })
  const [error, setError] = useState('')
  const [nextRuns, setNextRuns] = useState([])
  const [count, setCount] = useState(5)
  const [description, setDescription] = useState('')

  function getExpression() {
    // 5-field cron: minute hour dayOfMonth month dayOfWeek
    return `${fields.minute} ${fields.hour} ${fields.dayOfMonth} ${fields.month} ${fields.dayOfWeek}`
  }

  function describe(fields) {
    // Enhanced human readable description for common cron patterns
    function fieldDesc(label, val, unit) {
      if (val === '*' || val === undefined) return `every ${unit}`
      if (/^\*\/(\d+)$/.test(val)) {
        const n = val.match(/^\*\/(\d+)$/)[1]
        return `every ${n} ${unit}${n > 1 ? 's' : ''}`
      }
      if (/^\d+$/.test(val)) return `${unit} ${val}`
      return `${label} ${val}`
    }
    const min = fieldDesc('at minute', fields.minute, 'minute')
    const hr = fieldDesc('at hour', fields.hour, 'hour')
    const dom = fieldDesc('on day', fields.dayOfMonth, 'day')
    const mon = fieldDesc('in month', fields.month, 'month')
    let dow = ''
    if (fields.dayOfWeek && fields.dayOfWeek !== '*') {
      if (/^\*\/(\d+)$/.test(fields.dayOfWeek)) {
        const n = fields.dayOfWeek.match(/^\*\/(\d+)$/)[1]
        dow = `every ${n} days of week`
      } else if (/^\d+$/.test(fields.dayOfWeek)) {
        const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
        const idx = parseInt(fields.dayOfWeek, 10)
        dow = `on ${days[idx] || fields.dayOfWeek}`
      } else {
        dow = `on ${fields.dayOfWeek}`
      }
    }
    return [min, hr, dom, mon, dow].filter(Boolean).join(', ')
  }

  function handleParse() {
    setError('')
    setNextRuns([])
    setDescription('')
    const expr = getExpression()
    if (!expr.trim()) return
    try {
      const interval = CronExpressionParser.parse(expr)
      const runs = []
      for (let i = 0; i < count; i++) {
        runs.push(interval.next().toString())
      }
      setNextRuns(runs)
      setDescription(describe(fields))
    } catch (e) {
      setError(e.message)
    }
  }

  React.useEffect(() => {
    handleParse()
    // eslint-disable-next-line
  }, [fields, count])

  return (
    <div className="container">
      <div className="tool-header">
        <h1>Cron Parser</h1>
      </div>
      <p className="muted">Parse cron expressions and preview upcoming run times.</p>
      <div className="tool-section">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label htmlFor="cron-minute">Minute</label>
            <input
              id="cron-minute"
              type="text"
              value={fields.minute}
              onChange={e => setFields(f => ({ ...f, minute: e.target.value || '*' }))}
              placeholder="*"
              style={{ fontFamily: 'var(--font-mono)', width: '100%' }}
              maxLength={20}
            />
          </div>
          <div>
            <label htmlFor="cron-hour">Hour</label>
            <input
              id="cron-hour"
              type="text"
              value={fields.hour}
              onChange={e => setFields(f => ({ ...f, hour: e.target.value || '*' }))}
              placeholder="*"
              style={{ fontFamily: 'var(--font-mono)', width: '100%' }}
              maxLength={20}
            />
          </div>
          <div>
            <label htmlFor="cron-dayOfMonth">Day of Month</label>
            <input
              id="cron-dayOfMonth"
              type="text"
              value={fields.dayOfMonth}
              onChange={e => setFields(f => ({ ...f, dayOfMonth: e.target.value || '*' }))}
              placeholder="*"
              style={{ fontFamily: 'var(--font-mono)', width: '100%' }}
              maxLength={20}
            />
          </div>
          <div>
            <label htmlFor="cron-month">Month</label>
            <input
              id="cron-month"
              type="text"
              value={fields.month}
              onChange={e => setFields(f => ({ ...f, month: e.target.value || '*' }))}
              placeholder="*"
              style={{ fontFamily: 'var(--font-mono)', width: '100%' }}
              maxLength={20}
            />
          </div>
          <div>
            <label htmlFor="cron-dayOfWeek">Day of Week</label>
            <input
              id="cron-dayOfWeek"
              type="text"
              value={fields.dayOfWeek}
              onChange={e => setFields(f => ({ ...f, dayOfWeek: e.target.value || '*' }))}
              placeholder="*"
              style={{ fontFamily: 'var(--font-mono)', width: '100%' }}
              maxLength={20}
            />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', margin: '0.5rem 0' }}>
          <label htmlFor="cron-count" style={{ fontWeight: 500, color: 'var(--text-primary)' }}>Show next</label>
          <input
            id="cron-count"
            type="number"
            min={1}
            max={20}
            value={count}
            onChange={e => setCount(Math.max(1, Math.min(20, Number(e.target.value))))}
            style={{ width: 60, fontFamily: 'var(--font-mono)' }}
          />
          <span style={{ color: 'var(--text-secondary)' }}>runs</span>
        </div>
      </div>
      {description && (
        <div className="card" style={{ marginTop: '1rem', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
          <strong>In words:</strong> {description}
        </div>
      )}
      {error && <div className="error-message">{error}</div>}
      {nextRuns.length > 0 && (
        <div className="card" style={{ marginTop: '2rem', overflowX: 'auto' }}>
          <h3>Next Runs</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)' }}>
            <thead>
              <tr style={{ background: 'var(--bg-secondary)' }}>
                <th style={{ textAlign: 'left', padding: '0.5rem', color: 'var(--text-primary)' }}>#</th>
                <th style={{ textAlign: 'left', padding: '0.5rem', color: 'var(--text-primary)' }}>Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {nextRuns.map((run, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-secondary)' }}>
                  <td style={{ padding: '0.5rem', color: 'var(--text-secondary)' }}>{i + 1}</td>
                  <td style={{ padding: '0.5rem' }}>{run}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="card" style={{ marginTop: '2rem' }}>
        <h3>About Cron</h3>
        <p>
          Cron expressions define schedules for recurring tasks. Format: <code>minute hour day month weekday</code>.<br />
          <strong>Example:</strong> <code>0 9 * * 1-5</code> runs at 9:00 AM, Monday to Friday.<br />
          <strong>Tip:</strong> Use online tools or docs for more complex schedules.
        </p>
      </div>
    </div>
  )
}

export default CronParser
