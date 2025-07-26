import { useState, useCallback } from 'react'
import { 
  generateUUIDv4, 
  generateUUIDv7,
  generateMultipleUUIDs, 
  parseUUID,
  getUUIDStats
} from '../utils/uuidUtils'
import CustomDropdown from '../components/CustomDropdown'

function UuidGenerator() {
  const [generatedUUIDs, setGeneratedUUIDs] = useState([])
  const [count, setCount] = useState(1)
  const [version, setVersion] = useState(4)
  const [analyzeInput, setAnalyzeInput] = useState('')
  const [analysis, setAnalysis] = useState(null)
  const [copySuccess, setCopySuccess] = useState('')
  const [error, setError] = useState('')

  const generateUUIDs = useCallback(() => {
    try {
      const uuids = generateMultipleUUIDs(count, version)
      setGeneratedUUIDs(uuids)
      setError('')
    } catch (error) {
      setError(error.message)
    }
  }, [count, version])


  const analyzeUUID = useCallback(() => {
    if (!analyzeInput.trim()) {
      setAnalysis(null)
      setError('')
      return
    }

    try {
      const info = parseUUID(analyzeInput.trim())
      setAnalysis(info)
      setError('')
    } catch (error) {
      setError(error.message)
      setAnalysis(null)
    }
  }, [analyzeInput])

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopySuccess(type)
      setTimeout(() => setCopySuccess(''), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const copyAllUUIDs = async () => {
    const text = generatedUUIDs.join('\n')
    await copyToClipboard(text, 'all')
  }

  const clearAll = () => {
    setGeneratedUUIDs([])
    setAnalyzeInput('')
    setAnalysis(null)
    setError('')
    setCopySuccess('')
  }

  const stats = generatedUUIDs.length > 0 ? getUUIDStats(generatedUUIDs) : null

  return (
    <div className="container">
      <div className="tool-header">
        <h1>UUID Generator</h1>
        <div className="tool-actions">
          <button onClick={generateUUIDs} className="primary">Generate UUIDs</button>
          <button onClick={clearAll}>Clear All</button>
        </div>
      </div>

      <p className="muted">
        Generate UUIDs (Universally Unique Identifiers) in different versions. 
        Analyze existing UUIDs to extract version and variant information.
      </p>

      <div className="uuid-controls">
        <div className="control-group">
          <label htmlFor="version-select">UUID Version:</label>
          <CustomDropdown
            options={[
              { value: 4, label: 'Version 4 (Random)' },
              { value: 7, label: 'Version 7 (Time-ordered)' }
            ]}
            value={version}
            onChange={setVersion}
            placeholder="Select version"
          />
        </div>
        <div className="control-group">
          <label htmlFor="count">Number of UUIDs:</label>
          <input
            id="count"
            type="number"
            min="1"
            max="1000"
            value={count}
            onChange={(e) => setCount(Math.max(1, Math.min(1000, parseInt(e.target.value) || 1)))}
          />
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {generatedUUIDs.length > 0 && (
        <div className="uuid-results">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3>Generated UUIDs ({generatedUUIDs.length})</h3>
            <button
              onClick={copyAllUUIDs}
              className={`copy-button ${copySuccess === 'all' ? 'copied' : ''}`}
            >
              {copySuccess === 'all' ? '✓ Copied All' : 'Copy All'}
            </button>
          </div>
          
          <div className="uuid-list">
            {generatedUUIDs.map((uuid, index) => (
              <div key={index} className="uuid-item">
                <code className="uuid-display">{uuid}</code>
                <button
                  onClick={() => copyToClipboard(uuid, `uuid-${index}`)}
                  className={`copy-button-small ${copySuccess === `uuid-${index}` ? 'copied' : ''}`}
                >
                  {copySuccess === `uuid-${index}` ? '✓' : 'Copy'}
                </button>
              </div>
            ))}
          </div>

          {stats && (
            <div className="uuid-stats card">
              <h4>Statistics</h4>
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-label">Total:</span>
                  <span>{stats.total}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Versions:</span>
                  <span>{Object.entries(stats.versions).map(([v, count]) => `v${v}: ${count}`).join(', ')}</span>
                </div>
                {stats.duplicates > 0 && (
                  <div className="stat-item">
                    <span className="stat-label">Duplicates:</span>
                    <span className="warning">{stats.duplicates}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="uuid-analyzer">
        <h1>UUID Analyzer</h1>
        <div className="input-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label htmlFor="analyze-input">Enter UUID to analyze:</label>
            <button 
              onClick={analyzeUUID}
              className="primary"
              disabled={!analyzeInput.trim()}
            >
              Analyze
            </button>
          </div>
          <input
            id="analyze-input"
            type="text"
            value={analyzeInput}
            onChange={(e) => setAnalyzeInput(e.target.value)}
            placeholder="e.g., 550e8400-e29b-41d4-a716-446655440000"
            style={{ fontFamily: 'var(--font-mono)' }}
          />
        </div>

        {analysis && (
          <div className="uuid-analysis card">
            <h4>UUID Analysis</h4>
            <div className="analysis-result">
              <div className="analysis-section">
                <div className="analysis-item">
                  <strong>UUID:</strong> <code>{analysis.uuid}</code>
                </div>
                <div className="analysis-item">
                  <strong>Version:</strong> {analysis.version} ({analysis.type})
                </div>
                <div className="analysis-item">
                  <strong>Variant:</strong> {analysis.variant}
                </div>
                <div className="analysis-item">
                  <strong>Description:</strong> <span className="muted">{analysis.description}</span>
                </div>
                {analysis.generatedAt && (
                  <div className="analysis-item">
                    <strong>Generated At:</strong> <span className="muted">{analysis.generatedAt}</span>
                  </div>
                )}
                {analysis.timestamp && (
                  <div className="analysis-item">
                    <strong>Timestamp:</strong> <code>{analysis.timestamp}</code>
                  </div>
                )}
                {(analysis.isNil || analysis.isMax) && (
                  <div className="analysis-item">
                    <strong>Special:</strong> 
                    <span className="warning">
                      {analysis.isNil && 'NIL UUID (all zeros)'}
                      {analysis.isMax && 'MAX UUID (all ones)'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <h3>About UUIDs</h3>
        <p>
          UUIDs are 128-bit identifiers designed to be unique across space and time. 
          They are commonly used in software development for database keys, session IDs, and more.
        </p>
        <ul style={{ textAlign: 'left', color: 'var(--text-secondary)' }}>
          <li><strong>Version 4:</strong> Random UUIDs, most commonly used version</li>
          <li><strong>Version 7:</strong> Time-ordered UUIDs with embedded timestamp for better performance</li>
          <li><strong>Format:</strong> 8-4-4-4-12 hexadecimal digits separated by hyphens</li>
          <li><strong>Collision probability:</strong> Practically zero (1 in 5.3 x 10³⁶)</li>
          <li><strong>Use cases:</strong> Database keys, session IDs, distributed system identifiers</li>
          <li><strong>UUID v7 benefits:</strong> Better database performance, natural sorting, maintains temporal order</li>
        </ul>
      </div>
    </div>
  )
}

export default UuidGenerator
