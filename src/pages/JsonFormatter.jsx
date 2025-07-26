import { useState, useCallback } from 'react'
import {
  validateJSON,
  formatJSON,
  minifyJSON,
  analyzeJSON,
  jsonToYAML
} from '../utils/jsonYamlUtils'
import JsonViewer from '../components/JsonViewer'
import CustomDropdown from '../components/CustomDropdown'

function JsonFormatter() {
  // Mode: 'format', 'convert', 'view'
  const [mode, setMode] = useState('format')
  
  // Input and output
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  
  // Settings
  const [outputType, setOutputType] = useState('formatted') // 'formatted', 'minified', or 'yaml'
  const [indentSize, setIndentSize] = useState(2)
  
  // State
  const [error, setError] = useState('')
  const [copySuccess, setCopySuccess] = useState('')
  const [parsedData, setParsedData] = useState(null)
  const [analysis, setAnalysis] = useState(null)

  // Sample data
  const sampleJSON = `{
  "array": [1, 2, 3],
  "boolean": true,
  "color": "gold",
  "null": null,
  "number": 123,
  "object": {
    "a": "b",
    "c": "d",
    "nested": {
      "deep": true,
      "items": ["x", "y", "z"]
    }
  },
  "string": "Hello World"
}`

  // Format/Minify JSON
  const formatInput = useCallback(() => {
    if (!input.trim()) {
      setOutput('')
      setError('')
      setParsedData(null)
      setAnalysis(null)
      return
    }

    try {
      const validation = validateJSON(input)
      if (!validation.isValid) {
        throw new Error(validation.error)
      }
      
      if (mode === 'format' && outputType === 'minified') {
        setOutput(minifyJSON(input))
      } else if (mode === 'format' && outputType === 'formatted') {
        setOutput(formatJSON(input, parseInt(indentSize)))
      } else if (mode === 'convert' || outputType === 'yaml') {
        setOutput(jsonToYAML(input))
      }
      
      setParsedData(validation.parsed)
      setAnalysis(analyzeJSON(input))
      setError('')
    } catch (error) {
      setError(error.message)
      setOutput('')
      setParsedData(null)
      setAnalysis(null)
    }
  }, [input, outputType, indentSize, mode])

  // Validate input only
  const validateInput = useCallback(() => {
    if (!input.trim()) {
      setError('')
      setParsedData(null)
      setAnalysis(null)
      return
    }

    try {
      const validation = validateJSON(input)
      if (!validation.isValid) {
        throw new Error(validation.error)
      }
      
      setParsedData(validation.parsed)
      setAnalysis(analyzeJSON(input))
      setError('')
    } catch (error) {
      setError(error.message)
      setParsedData(null)
      setAnalysis(null)
    }
  }, [input])

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopySuccess(type)
      setTimeout(() => setCopySuccess(''), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const loadSample = () => {
    setError('')
    setCopySuccess('')
    setInput(sampleJSON)
  }

  const clearAll = () => {
    setInput('')
    setOutput('')
    setError('')
    setCopySuccess('')
    setParsedData(null)
    setAnalysis(null)
  }

  const switchMode = (newMode) => {
    setMode(newMode)
    setError('')
    setCopySuccess('')
    
    // Reset output when switching modes and adjust outputType
    if (newMode === 'view') {
      validateInput()
    } else if (newMode === 'format') {
      setOutputType('formatted')
      setOutput('')
    } else if (newMode === 'convert') {
      setOutputType('yaml')
      setOutput('')
    }
  }

  return (
    <div className="container">
      <div className="tool-header">
        <h1>JSON Formatter</h1>
        <div className="tool-actions">
          <button onClick={loadSample}>Load Sample</button>
          <button onClick={clearAll}>Clear All</button>
        </div>
      </div>

      <p className="muted">
        Format, validate, and visualize JSON data with syntax highlighting and interactive viewing.
      </p>

      {/* Mode Selection */}
      <div className="format-mode-selector">
        <button 
          className={mode === 'format' ? 'primary' : 'inactive'}
          onClick={() => switchMode('format')}
        >
          📄 Format & Validate
        </button>
        <button 
          className={mode === 'convert' ? 'primary' : 'inactive'}
          onClick={() => switchMode('convert')}
        >
          🔄 Convert to YAML
        </button>
        <button 
          className={mode === 'view' ? 'primary' : 'inactive'}
          onClick={() => switchMode('view')}
        >
          👁️ Interactive Viewer
        </button>
      </div>

      {/* Format Options */}
      {mode !== 'view' && (
        <div className="format-options">
          <div className="format-option-group">
            <label>Output:</label>
            <CustomDropdown
              options={mode === 'format' ? [
                { value: 'formatted', label: 'Formatted' },
                { value: 'minified', label: 'Minified' }
              ] : [
                { value: 'yaml', label: 'YAML' }
              ]}
              value={outputType}
              onChange={setOutputType}
            />
          </div>
          
          {outputType === 'formatted' && (
            <div className="format-option-group">
              <label>Indent:</label>
              <CustomDropdown
                options={[
                  { value: 2, label: '2 spaces' },
                  { value: 4, label: '4 spaces' },
                  { value: 8, label: '8 spaces' }
                ]}
                value={indentSize}
                onChange={setIndentSize}
              />
            </div>
          )}
          
          <div className="format-actions">
            <button onClick={formatInput} className="primary">
              {mode === 'format' ? 'Format JSON' : 'Convert to YAML'}
            </button>
            <button onClick={validateInput}>
              Validate Only
            </button>
          </div>
        </div>
      )}

      {/* Input Section */}
      <div className={mode === 'view' ? 'tool-container' : 'tool-container'} style={mode === 'view' ? { gridTemplateColumns: '1fr 1fr' } : {}}>
        <div className="tool-section">
          <div className="input-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label htmlFor="input-data">JSON Input</label>
              <button
                onClick={() => copyToClipboard(input, 'input')}
                className={`copy-button ${copySuccess === 'input' ? 'copied' : ''}`}
                disabled={!input.trim()}
              >
                {copySuccess === 'input' ? '✓ Copied' : 'Copy'}
              </button>
            </div>
            <textarea
              id="input-data"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter your JSON data here..."
              rows={mode === 'view' ? 20 : 15}
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}
            />
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Output/Viewer Section */}
        {mode === 'view' ? (
          <div className="tool-section">
            <div className="viewer-section">
              <div className="viewer-header">
                <h3>Interactive Viewer</h3>
                <div className="viewer-actions">
                  <button onClick={validateInput} className="primary">
                    Parse & View
                  </button>
                </div>
              </div>
              {parsedData ? (
                <JsonViewer data={parsedData} />
              ) : (
                <div className="json-viewer">
                  <div className="json-viewer-empty">
                    Enter valid JSON data and click "Parse & View"
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="tool-section">
            <div className="input-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label htmlFor="output-data">
                  {mode === 'format' ? 'Formatted Output' : 'YAML Output'}
                </label>
                <button
                  onClick={() => copyToClipboard(output, 'output')}
                  className={`copy-button ${copySuccess === 'output' ? 'copied' : ''}`}
                  disabled={!output.trim()}
                >
                  {copySuccess === 'output' ? '✓ Copied' : 'Copy'}
                </button>
              </div>
              <textarea
                id="output-data"
                value={output}
                readOnly
                placeholder={mode === 'format' ? "Formatted JSON will appear here..." : "Converted YAML will appear here..."}
                rows={15}
                style={{ 
                  fontFamily: 'var(--font-mono)', 
                  fontSize: '0.875rem',
                  backgroundColor: 'var(--bg-secondary)'
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Analysis Section */}
      {analysis && analysis.isValid && (
        <div className="base64-analysis card">
          <h3>JSON Analysis</h3>
          <div className="analysis-grid">
            <div className="analysis-item">
              <span className="analysis-label">Type:</span>
              <span className="success">{analysis.type}</span>
            </div>
            <div className="analysis-item">
              <span className="analysis-label">Size:</span>
              <span>{analysis.size} characters</span>
            </div>
            <div className="analysis-item">
              <span className="analysis-label">Minified Size:</span>
              <span>{analysis.minifiedSize} characters</span>
            </div>
            <div className="analysis-item">
              <span className="analysis-label">Compression:</span>
              <span className="success">{Math.round((1 - analysis.minifiedSize / analysis.size) * 100)}%</span>
            </div>
            <div className="analysis-item">
              <span className="analysis-label">Depth:</span>
              <span>{analysis.depth} levels</span>
            </div>
            <div className="analysis-item">
              <span className="analysis-label">Keys:</span>
              <span>{analysis.keys}</span>
            </div>
            <div className="analysis-item">
              <span className="analysis-label">Values:</span>
              <span>{analysis.values}</span>
            </div>
          </div>
        </div>
      )}

      {/* About Section */}
      <div className="card" style={{ marginTop: '2rem' }}>
        <h3>About JSON Formatting</h3>
        <p>
          Format, validate, and explore JSON data structures with comprehensive analysis and interactive viewing.
        </p>
        <ul style={{ textAlign: 'left', color: 'var(--text-secondary)' }}>
          <li><strong>Format & Validate:</strong> Clean up JSON syntax with customizable indentation</li>
          <li><strong>Minify:</strong> Remove all whitespace for compact JSON transmission</li>
          <li><strong>Interactive Viewer:</strong> Explore complex data structures with collapsible sections</li>
          <li><strong>Analysis:</strong> Get detailed insights about your JSON structure and size</li>
          <li><strong>Validation:</strong> Real-time syntax validation with detailed error messages</li>
          <li><strong>Copy Support:</strong> Easy copying of input and output with visual feedback</li>
        </ul>
      </div>
    </div>
  )
}

export default JsonFormatter
