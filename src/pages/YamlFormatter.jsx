import { useState, useCallback } from 'react'
import { 
  validateYAML, 
  yamlToJSON,
  jsonToYAML,
  analyzeJSON
} from '../utils/jsonYamlUtils'
import JsonViewer from '../components/JsonViewer'
import CustomDropdown from '../components/CustomDropdown'

function YamlFormatter() {
  // Mode: 'format', 'convert', 'view'
  const [mode, setMode] = useState('format')
  
  // Input and output
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  
  // Settings
  const [outputType, setOutputType] = useState('yaml') // 'yaml' or 'json'
  const [indentSize, setIndentSize] = useState(2)
  
  // State
  const [error, setError] = useState('')
  const [copySuccess, setCopySuccess] = useState('')
  const [parsedData, setParsedData] = useState(null)
  const [analysis, setAnalysis] = useState(null)

  // Sample data
  const sampleYAML = `array:
  - 1
  - 2
  - 3
boolean: true
color: gold
"null": null
number: 123
object:
  a: b
  c: d
  nested:
    deep: true
    items:
      - x
      - y
      - z
string: Hello World`

  // Format/Convert YAML
  const formatInput = useCallback(() => {
    if (!input.trim()) {
      setOutput('')
      setError('')
      setParsedData(null)
      setAnalysis(null)
      return
    }

    try {
      const validation = validateYAML(input)
      if (!validation.isValid) {
        throw new Error(validation.error)
      }
      
      if (mode === 'format' && outputType === 'yaml') {
        // Format YAML by converting to JSON and back to YAML
        const jsonString = yamlToJSON(input, 2)
        setOutput(jsonToYAML(jsonString))
      } else if (mode === 'convert' || outputType === 'json') {
        // Convert to JSON
        setOutput(yamlToJSON(input, parseInt(indentSize)))
      }
      
      setParsedData(validation.parsed)
      // Convert to JSON for analysis
      const jsonForAnalysis = yamlToJSON(input)
      setAnalysis(analyzeJSON(jsonForAnalysis))
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
      const validation = validateYAML(input)
      if (!validation.isValid) {
        throw new Error(validation.error)
      }
      
      setParsedData(validation.parsed)
      // Convert to JSON for analysis
      const jsonString = yamlToJSON(input)
      setAnalysis(analyzeJSON(jsonString))
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
    setInput(sampleYAML)
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
      setOutputType('yaml')
      setOutput('')
    } else if (newMode === 'convert') {
      setOutputType('json')
      setOutput('')
    }
  }

  return (
    <div className="container">
      <div className="tool-header">
        <h1>YAML Formatter</h1>
        <div className="tool-actions">
          <button onClick={loadSample}>Load Sample</button>
          <button onClick={clearAll}>Clear All</button>
        </div>
      </div>

      <p className="muted">
        Format, validate, convert, and visualize YAML data with syntax validation and interactive viewing.
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
          🔄 Convert to JSON
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
                { value: 'yaml', label: 'Formatted YAML' }
              ] : [
                { value: 'json', label: 'JSON' }
              ]}
              value={outputType}
              onChange={setOutputType}
            />
          </div>
          
          {outputType === 'json' && (
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
              {mode === 'format' ? 'Format YAML' : 'Convert to JSON'}
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
              <label htmlFor="input-data">YAML Input</label>
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
              placeholder="Enter your YAML data here..."
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
                    Enter valid YAML data and click "Parse & View"
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
                  {mode === 'format' ? 'Formatted Output' : 'JSON Output'}
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
                placeholder={mode === 'format' ? "Formatted YAML will appear here..." : "Converted JSON will appear here..."}
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
          <h3>Data Analysis</h3>
          <div className="analysis-grid">
            <div className="analysis-item">
              <span className="analysis-label">Type:</span>
              <span className="success">{analysis.type}</span>
            </div>
            <div className="analysis-item">
              <span className="analysis-label">YAML Size:</span>
              <span>{input.length} characters</span>
            </div>
            <div className="analysis-item">
              <span className="analysis-label">JSON Size:</span>
              <span>{analysis.size} characters</span>
            </div>
            <div className="analysis-item">
              <span className="analysis-label">Minified Size:</span>
              <span>{analysis.minifiedSize} characters</span>
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
        <h3>About YAML Formatting</h3>
        <p>
          Format, validate, and convert YAML data with comprehensive analysis and interactive viewing.
        </p>
        <ul style={{ textAlign: 'left', color: 'var(--text-secondary)' }}>
          <li><strong>Format & Validate:</strong> Clean up and validate YAML syntax</li>
          <li><strong>Convert to JSON:</strong> Convert YAML to JSON with customizable indentation</li>
          <li><strong>Interactive Viewer:</strong> Explore complex data structures with collapsible sections</li>
          <li><strong>Analysis:</strong> Get detailed insights about your data structure and size</li>
          <li><strong>Validation:</strong> Real-time syntax validation with detailed error messages</li>
          <li><strong>YAML Features:</strong> Supports comments, multi-line strings, and complex data types</li>
        </ul>
      </div>
    </div>
  )
}

export default YamlFormatter
