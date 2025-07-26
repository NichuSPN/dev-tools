import { useState, useCallback } from 'react'
import { encodeBase64, decodeBase64, analyzeBase64 } from '../utils/base64Utils'

function Base64Converter() {
  const [textInput, setTextInput] = useState('')
  const [base64Input, setBase64Input] = useState('')
  const [encodeError, setEncodeError] = useState('')
  const [decodeError, setDecodeError] = useState('')
  const [copySuccess, setCopySuccess] = useState('')

  const sampleText = 'Hello, World! This is a sample text for Base64 encoding demonstration. 🚀'
  const sampleBase64 = 'SGVsbG8sIFdvcmxkISBUaGlzIGlzIGEgc2FtcGxlIHRleHQgZm9yIEJhc2U2NCBlbmNvZGluZyBkZW1vbnN0cmF0aW9uLiDwn5qA'

  const encodeText = useCallback(() => {
    if (!textInput.trim()) {
      setBase64Input('')
      setEncodeError('')
      return
    }

    try {
      const encoded = encodeBase64(textInput)
      setBase64Input(encoded)
      setEncodeError('')
    } catch (error) {
      setEncodeError(error.message)
    }
  }, [textInput])

  const decodeBase64Text = useCallback(() => {
    if (!base64Input.trim()) {
      setTextInput('')
      setDecodeError('')
      return
    }

    try {
      // Remove line breaks for decoding
      const cleanInput = base64Input.replace(/\s/g, '')
      const decoded = decodeBase64(cleanInput)
      setTextInput(decoded)
      setDecodeError('')
    } catch (error) {
      setDecodeError(error.message)
    }
  }, [base64Input])

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
    if (type === 'text') {
      setTextInput(sampleText)
      setEncodeError('')
      try {
        const encoded = encodeBase64(sampleText)
        setBase64Input(encoded)
      } catch (error) {
        setEncodeError(error.message)
      }
    } else {
      setBase64Input(sampleBase64)
      setDecodeError('')
      try {
        const decoded = decodeBase64(sampleBase64)
        setTextInput(decoded)
      } catch (error) {
        setDecodeError(error.message)
      }
    }
  }

  const clearAll = () => {
    setTextInput('')
    setBase64Input('')
    setEncodeError('')
    setDecodeError('')
    setCopySuccess('')
  }

  const analysis = base64Input ? analyzeBase64(base64Input.replace(/\s/g, '')) : null

  return (
    <div className="container">
      <div className="tool-header">
        <h1>Base64 Encoder/Decoder</h1>
        <div className="tool-actions">
          <button onClick={() => loadSample('text')}>Load Sample Text</button>
          <button onClick={() => loadSample('base64')}>Load Sample Base64</button>
          <button onClick={clearAll}>Clear All</button>
        </div>
      </div>

      <p className="muted">
        Encode text to Base64 or decode Base64 back to text using standard Base64 encoding.
      </p>

      <div className="tool-container">
        <div className="tool-section">
          <div className="input-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label htmlFor="text-input">Text Input</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={encodeText}
                  className="primary"
                  disabled={!textInput.trim()}
                >
                  Encode to Base64 →
                </button>
                <button
                  onClick={() => copyToClipboard(textInput, 'text')}
                  className={`copy-button ${copySuccess === 'text' ? 'copied' : ''}`}
                  disabled={!textInput.trim()}
                >
                  {copySuccess === 'text' ? '✓ Copied' : 'Copy'}
                </button>
              </div>
            </div>
            <textarea
              id="text-input"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Enter your text here..."
              rows={10}
            />
            {encodeError && (
              <div className="error-message">
                {encodeError}
              </div>
            )}
          </div>
        </div>

        <div className="tool-section">
          <div className="input-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label htmlFor="base64-input">Base64 Output</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={decodeBase64Text}
                  className="primary"
                  disabled={!base64Input.trim()}
                >
                  ← Decode from Base64
                </button>
                <button
                  onClick={() => copyToClipboard(base64Input, 'base64')}
                  className={`copy-button ${copySuccess === 'base64' ? 'copied' : ''}`}
                  disabled={!base64Input.trim()}
                >
                  {copySuccess === 'base64' ? '✓ Copied' : 'Copy'}
                </button>
              </div>
            </div>
            <textarea
              id="base64-input"
              value={base64Input}
              onChange={(e) => setBase64Input(e.target.value)}
              placeholder="Base64 encoded text will appear here..."
              rows={10}
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}
            />
            {decodeError && (
              <div className="error-message">
                {decodeError}
              </div>
            )}
          </div>
        </div>
      </div>

      {analysis && (
        <div className="base64-analysis card">
          <h3>Base64 Analysis</h3>
          <div className="analysis-grid">
            <div className="analysis-item">
              <span className="analysis-label">Length:</span>
              <span>{analysis.length} characters</span>
            </div>
            <div className="analysis-item">
              <span className="analysis-label">Valid:</span>
              <span className={analysis.isValid ? 'success' : 'error'}>
                {analysis.isValid ? '✓ Valid' : '✗ Invalid'}
              </span>
            </div>
            <div className="analysis-item">
              <span className="analysis-label">Padding:</span>
              <span>{analysis.padding} characters</span>
            </div>
            <div className="analysis-item">
              <span className="analysis-label">Estimated Size:</span>
              <span>{analysis.estimatedSize} bytes</span>
            </div>
          </div>
        </div>
      )}

      <div className="card" style={{ marginTop: '2rem' }}>
        <h3>About Base64 Encoding</h3>
        <p>
          Base64 is a binary-to-text encoding scheme that represents binary data in an ASCII string format. 
          It's commonly used in web applications to encode data.
        </p>
        <ul style={{ textAlign: 'left', color: 'var(--text-secondary)' }}>
          <li><strong>Characters:</strong> Uses A-Z, a-z, 0-9, +, / with = padding</li>
          <li><strong>Use Cases:</strong> Email attachments, data URLs, JWT tokens, API responses</li>
          <li><strong>Size:</strong> Increases data size by approximately 33%</li>
        </ul>
      </div>
    </div>
  )
}

export default Base64Converter
