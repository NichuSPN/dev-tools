import React, { useState } from 'react'

function RegexTester() {
  const [pattern, setPattern] = useState('')
  const flagOptions = [
    { label: 'i (ignore case)', value: 'i' },
    { label: 'm (multiline)', value: 'm' },
    { label: 's (dotAll)', value: 's' },
    { label: 'u (unicode)', value: 'u' },
    { label: 'y (sticky)', value: 'y' },
  ]
  const [flags, setFlags] = useState('')
  const [testString, setTestString] = useState('')
  const [error, setError] = useState('')
  const [matches, setMatches] = useState([])

  // Live highlight and match calculation
  React.useEffect(() => {
    setError('')
    setMatches([])
    if (!pattern) return
    try {
      const regex = new RegExp(pattern, 'g' + flags)
      const result = [...testString.matchAll(regex)]
      setMatches(result)
    } catch (e) {
      setError(e.message)
    }
  }, [pattern, flags, testString])

  // Highlight matches in test string
  function getHighlightedText() {
    if (!pattern || error || !testString) return testString
    try {
      const regex = new RegExp(pattern, 'g' + flags)
      let lastIndex = 0
      let elements = []
      let match
      let idx = 0
      while ((match = regex.exec(testString)) !== null) {
        if (match.index > lastIndex) {
          elements.push(
            <span key={"text-" + idx}>{testString.slice(lastIndex, match.index)}</span>
          )
        }
        elements.push(
          <span key={"hl-" + idx} style={{ background: 'var(--accent)', color: 'var(--bg-primary)', borderRadius: '3px', padding: '0 2px' }}>{match[0]}</span>
        )
        lastIndex = match.index + match[0].length
        idx++
        // Prevent infinite loop for zero-length matches
        if (regex.lastIndex === match.index) regex.lastIndex++
      }
      if (lastIndex < testString.length) {
        elements.push(
          <span key={"text-end"}>{testString.slice(lastIndex)}</span>
        )
      }
      return elements
    } catch {
      return testString
    }
  }

  return (
    <div className="container">
      <div className="tool-header">
        <h1>Regex Tester</h1>
      </div>
      <p className="muted">Test regular expressions with live highlighting and match details.</p>
      <div className="tool-section">
        <label htmlFor="regex-pattern">Regex Pattern</label>
        <input
          id="regex-pattern"
          type="text"
          value={pattern}
          onChange={e => setPattern(e.target.value)}
          placeholder="e.g., ^[a-zA-Z0-9]+$"
          style={{ fontFamily: 'var(--font-mono)' }}
        />
        <label>Flags</label>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
          {flagOptions.map(opt => (
            <label key={opt.value} className="checkbox-label">
              <input
                type="checkbox"
                checked={flags.includes(opt.value)}
                onChange={e => {
                  if (e.target.checked) {
                    setFlags(f => f.includes(opt.value) ? f : f + opt.value)
                  } else {
                    setFlags(f => f.replace(opt.value, ''))
                  }
                }}
              />
              {opt.label}
            </label>
          ))}
        </div>
        <label htmlFor="regex-test-string">Test String</label>
        <textarea
          id="regex-test-string"
          value={testString}
          onChange={e => setTestString(e.target.value)}
          rows={6}
          style={{ fontFamily: 'var(--font-mono)' }}
          placeholder="Enter text to test your regex against..."
        />
        <label>Live Highlight</label>
        <div
          className="json-viewer"
          style={{ minHeight: '3em', marginTop: '0.5rem', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
        >
          {getHighlightedText()}
        </div>
      </div>
      {error && <div className="error-message">{error}</div>}
      {matches.length > 0 && (
        <div className="card" style={{ marginTop: '2rem', overflowX: 'auto' }}>
          <h3>Matches</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)' }}>
            <thead>
              <tr style={{ background: 'var(--bg-secondary)' }}>
                <th style={{ textAlign: 'left', padding: '0.5rem', color: 'var(--text-primary)' }}>#</th>
                <th style={{ textAlign: 'left', padding: '0.5rem', color: 'var(--text-primary)' }}>Match</th>
                <th style={{ textAlign: 'left', padding: '0.5rem', color: 'var(--text-primary)' }}>Index</th>
                <th style={{ textAlign: 'left', padding: '0.5rem', color: 'var(--text-primary)' }}>Groups</th>
              </tr>
            </thead>
            <tbody>
              {matches.map((m, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-secondary)' }}>
                  <td style={{ padding: '0.5rem', color: 'var(--text-secondary)' }}>{i + 1}</td>
                  <td style={{ padding: '0.5rem' }}>{m[0]}</td>
                  <td style={{ padding: '0.5rem' }}>{m.index}</td>
                  <td style={{ padding: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.95em' }}>
                    {m.length > 1 ? m.slice(1).map((g, gi) => <span key={gi}>[{g}] </span>) : <span style={{ color: 'var(--text-muted)' }}>-</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="card" style={{ marginTop: '2rem' }}>
        <h3>About Regex</h3>
        <p>
          Regular expressions (regex) are patterns for matching text. Use flags for global (g), case-insensitive (i), multiline (m), etc.<br />
          <strong>Tip:</strong> Use parentheses <code>()</code> for capturing groups.
        </p>
      </div>
    </div>
  )
}

export default RegexTester
