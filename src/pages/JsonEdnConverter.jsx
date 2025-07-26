import { useState, useCallback } from 'react'
import { jsonToEdn, ednToJson } from '../utils/ednConverter'

function JsonEdnConverter() {
  const [jsonInput, setJsonInput] = useState('')
  const [ednInput, setEdnInput] = useState('')
  const [jsonError, setJsonError] = useState('')
  const [ednError, setEdnError] = useState('')
  const [copySuccess, setCopySuccess] = useState('')

  // Sample data for demonstration
  const sampleJson = `{
  "name": "John Doe",
  "age": 30,
  "isActive": true,
  "address": {
    "street": "123 Main St",
    "city": "Anytown",
    "zipCode": "12345"
  },
  "hobbies": ["reading", "swimming", "coding"],
  "metadata": null
}`

  const sampleEdn = `{:name "John Doe"
 :age 30
 :isActive true
 :address {:street "123 Main St"
           :city "Anytown"
           :zipCode "12345"}
 :hobbies ["reading" "swimming" "coding"]
 :metadata nil}`

  const convertJsonToEdn = useCallback(() => {
    if (!jsonInput.trim()) {
      setEdnInput('')
      setJsonError('')
      return
    }

    try {
      const result = jsonToEdn(jsonInput)
      setEdnInput(result)
      setJsonError('')
    } catch (error) {
      setJsonError(error.message)
    }
  }, [jsonInput])

  const convertEdnToJson = useCallback(() => {
    if (!ednInput.trim()) {
      setJsonInput('')
      setEdnError('')
      return
    }

    try {
      const result = ednToJson(ednInput)
      setJsonInput(result)
      setEdnError('')
    } catch (error) {
      setEdnError(error.message)
    }
  }, [ednInput])

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopySuccess(type)
      setTimeout(() => setCopySuccess(''), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const loadSample = (type) => {
    if (type === 'json') {
      setJsonInput(sampleJson)
      setJsonError('')
      try {
        const result = jsonToEdn(sampleJson)
        setEdnInput(result)
      } catch (error) {
        setJsonError(error.message)
      }
    } else {
      setEdnInput(sampleEdn)
      setEdnError('')
      try {
        const result = ednToJson(sampleEdn)
        setJsonInput(result)
      } catch (error) {
        setEdnError(error.message)
      }
    }
  }

  const clearAll = () => {
    setJsonInput('')
    setEdnInput('')
    setJsonError('')
    setEdnError('')
    setCopySuccess('')
  }

  return (
    <div className="container">
      <div className="tool-header">
        <h1>JSON ⇄ EDN Converter</h1>
        <div className="tool-actions">
          <button onClick={() => loadSample('json')}>Load JSON Sample</button>
          <button onClick={() => loadSample('edn')}>Load EDN Sample</button>
          <button onClick={clearAll}>Clear All</button>
        </div>
      </div>

      <p className="muted">
        Convert between JSON and EDN (Extensible Data Notation) formats. 
        EDN is a data format used primarily in Clojure that supports richer data types than JSON.
      </p>

      <div className="tool-container">
        <div className="tool-section">
          <div className="input-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label htmlFor="json-input">JSON Input</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={convertJsonToEdn}
                  className="primary"
                  disabled={!jsonInput.trim()}
                >
                  Convert to EDN →
                </button>
                <button
                  onClick={() => copyToClipboard(jsonInput, 'json')}
                  className={`copy-button ${copySuccess === 'json' ? 'copied' : ''}`}
                  disabled={!jsonInput.trim()}
                >
                  {copySuccess === 'json' ? '✓ Copied' : 'Copy'}
                </button>
              </div>
            </div>
            <textarea
              id="json-input"
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder="Enter your JSON here..."
              rows={15}
            />
            {jsonError && (
              <div className="error-message">
                {jsonError}
              </div>
            )}
          </div>
        </div>

        <div className="tool-section">
          <div className="input-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label htmlFor="edn-input">EDN Output</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={convertEdnToJson}
                  className="primary"
                  disabled={!ednInput.trim()}
                >
                  ← Convert to JSON
                </button>
                <button
                  onClick={() => copyToClipboard(ednInput, 'edn')}
                  className={`copy-button ${copySuccess === 'edn' ? 'copied' : ''}`}
                  disabled={!ednInput.trim()}
                >
                  {copySuccess === 'edn' ? '✓ Copied' : 'Copy'}
                </button>
              </div>
            </div>
            <textarea
              id="edn-input"
              value={ednInput}
              onChange={(e) => setEdnInput(e.target.value)}
              placeholder="EDN output will appear here..."
              rows={15}
            />
            {ednError && (
              <div className="error-message">
                {ednError}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <h3>About EDN (Extensible Data Notation)</h3>
        <p>
          EDN is a data format that extends the subset of Clojure used for data representation. 
          Key differences from JSON:
        </p>
        <ul style={{ textAlign: 'left', color: 'var(--text-secondary)' }}>
          <li><strong>Keywords:</strong> Identifiers prefixed with : (e.g., <code>:name</code>)</li>
          <li><strong>Nil:</strong> Uses <code>nil</code> instead of <code>null</code></li>
          <li><strong>Maps:</strong> Use curly braces <code>{}</code> like JSON objects</li>
          <li><strong>Vectors:</strong> Use square brackets <code>[]</code> like JSON arrays</li>
          <li><strong>Comments:</strong> Support for <code>;</code> line comments</li>
        </ul>
      </div>
    </div>
  )
}

export default JsonEdnConverter
