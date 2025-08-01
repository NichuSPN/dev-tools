import React, { useState, useEffect } from 'react'

function TimestampConverter() {
  const [timestamp, setTimestamp] = useState('')
  // Prefill timestamp with current Unix timestamp (seconds) on mount
  useEffect(() => {
    const ts = Date.now()
    const now = Math.floor(ts / 1000)
    let date = new Date(ts) 
    setTimestamp(now.toString())
    setUtcDateString(date.toISOString())
    setLocalDateString(date.toLocaleString())
    // Set default value for date-time picker (local time, formatted for input)
    const local = new Date()
    const pad = n => n.toString().padStart(2, '0')
    const yyyy = local.getFullYear()
    const mm = pad(local.getMonth() + 1)
    const dd = pad(local.getDate())
    const hh = pad(local.getHours())
    const min = pad(local.getMinutes())
    setPickerValue(`${yyyy}-${mm}-${dd}T${hh}:${min}`)
  }, [])
  const [utcDateString, setUtcDateString] = useState('')
  const [localDateString, setLocalDateString] = useState('')
  const [mode, setMode] = useState('toDate') // 'toDate' or 'toTimestamp'
  const [error, setError] = useState('')
  const [pickerValue, setPickerValue] = useState('')

  // Convert timestamp to date
  const handleTimestampChange = (e) => {
    const value = e.target.value.trim()
    setTimestamp(value)
    setError('')
    setUtcDateString('')
    setLocalDateString('')
    if (!value) return
    let ts = Number(value)
    if (isNaN(ts)) {
      setError('Invalid timestamp')
      return
    }
    // Support both seconds and milliseconds
    if (value.length <= 10) ts *= 1000
    try {
      const date = new Date(ts)
      if (isNaN(date.getTime())) throw new Error('Invalid date')
      setUtcDateString(date.toISOString())
      setLocalDateString(date.toLocaleString())
    } catch {
      setError('Invalid timestamp')
    }
  }

  // Convert date to timestamp (local)
  const handlePickerChange = (e) => {
    const value = e.target.value
    setPickerValue(value)
    setError('')
    setTimestamp('')
    setLocalDateString('')
    setUtcDateString('')
    if (!value) return
    try {
      // value is in 'YYYY-MM-DDTHH:mm' format, local time
      const date = new Date(value)
      if (isNaN(date.getTime())) throw new Error('Invalid date')
      setTimestamp(Math.floor(date.getTime() / 1000).toString())
      setLocalDateString(date.toLocaleString())
      setUtcDateString(date.toISOString())
    } catch {
      setError('Invalid date')
    }
  }

  return (
    <div className="container">
      <div className="tool-header">
        <h1>Timestamp Converter</h1>
        <div className="tool-actions">
          <button className={mode === 'toDate' ? 'primary' : 'inactive'} onClick={() => setMode('toDate')}>Timestamp → Date</button>
          <button className={mode === 'toTimestamp' ? 'primary' : 'inactive'} onClick={() => setMode('toTimestamp')}>Date → Timestamp</button>
        </div>
      </div>
      <p className="muted">Convert between Unix timestamps and human-readable dates (UTC & Local).</p>
      {mode === 'toDate' ? (
        <div className="tool-section">
          <label htmlFor="timestamp-input">Unix Timestamp</label>
          <input
            id="timestamp-input"
            type="text"
            value={timestamp}
            onChange={handleTimestampChange}
            placeholder="e.g., 1627846261 or 1627846261000"
            style={{ fontFamily: 'var(--font-mono)' }}
          />
          <div className="output-group">
            <label>UTC Date (ISO 8601)</label>
            <input
              type="text"
              value={utcDateString}
              readOnly
              style={{ fontFamily: 'var(--font-mono)' }}
              placeholder="Result will appear here"
            />
          </div>
          <div className="output-group">
            <label>Local Date & Time</label>
            <input
              type="text"
              value={localDateString}
              readOnly
              style={{ fontFamily: 'var(--font-mono)' }}
              placeholder="Result will appear here"
            />
          </div>
        </div>
      ) : (
        <div className="tool-section">
          <label htmlFor="date-picker">Local Date & Time</label>
          <input
            id="date-picker"
            type="datetime-local"
            value={pickerValue}
            onChange={handlePickerChange}
            style={{ fontFamily: 'var(--font-mono)' }}
          />
          <div className="output-group">
            <label>Unix Timestamp (seconds)</label>
            <input
              type="text"
              value={timestamp}
              readOnly
              style={{ fontFamily: 'var(--font-mono)' }}
              placeholder="Result will appear here"
            />
          </div>
        </div>
      )}
      {error && <div className="error-message">{error}</div>}
      <div className="card" style={{ marginTop: '2rem' }}>
        <h3>About Unix Timestamps</h3>
        <p>
          Unix timestamps represent the number of seconds (or milliseconds) since January 1, 1970 (UTC). ISO 8601 is a standard format for date strings.<br />
          <strong>Note:</strong> Date to timestamp conversion uses your local time.
        </p>
      </div>
    </div>
  )
}

export default TimestampConverter
