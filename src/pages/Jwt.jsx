import { useState, useCallback } from 'react'
import { 
  decodeJWT, 
  encodeJWT, 
  verifyJWT, 
  validateJWTFormat,
} from '../utils/jwtUtils'
import {
  getCurrentTimestamp,
  addTimeToTimestamp
} from '../utils/general'

function JwtDecoder() {
  // Modes: 'decode', 'encode', 'verify'
  const [mode, setMode] = useState('decode')
  
  // Decode mode state
  const [tokenInput, setTokenInput] = useState('')
  const [decodeSecret, setDecodeSecret] = useState('')
  const [decodedToken, setDecodedToken] = useState(null)
  
  // Encode mode state
  const [headerInput, setHeaderInput] = useState('')
  const [payloadInput, setPayloadInput] = useState('')
  const [secretInput, setSecretInput] = useState('')
  const [algorithm, setAlgorithm] = useState('HS256')
  const [encodedToken, setEncodedToken] = useState('')
  
  // Verify mode state
  const [verifyToken, setVerifyToken] = useState('')
  const [verifySecret, setVerifySecret] = useState('')
  const [verificationResult, setVerificationResult] = useState(null)
  
  // Common state
  const [error, setError] = useState('')
  const [copySuccess, setCopySuccess] = useState('')

  // Sample data
  const sampleJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE3MDY3Mzk4MjIsImF1ZCI6ImV4YW1wbGUuY29tIiwiaXNzIjoiaHR0cHM6Ly9leGFtcGxlLmNvbSIsInJvbGUiOiJ1c2VyIn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
  
  const sampleHeader = {
    "alg": "HS256",
    "typ": "JWT"
  }
  
  const samplePayload = {
    "sub": "1234567890",
    "name": "John Doe",
    "iat": getCurrentTimestamp(),
    "exp": addTimeToTimestamp(24)
  }

  // Decode functions
  const decodeToken = useCallback(() => {
    if (!tokenInput.trim()) {
      setDecodedToken(null)
      setError('')
      return
    }

    try {
      // First validate the JWT format
      const formatValidation = validateJWTFormat(tokenInput)
      if (!formatValidation.isValid) {
        setError(`Invalid JWT format: ${formatValidation.error}`)
        setDecodedToken(null)
        return
      }

      // Verify signature if secret is provided
      let signatureVerification = null
      if (decodeSecret.trim()) {
        try {
          signatureVerification = verifyJWT(tokenInput, decodeSecret, 'HS256')
        } catch (verifyError) {
          signatureVerification = {
            isValid: false,
            error: verifyError.message
          }
        }
      }

      // Then decode the JWT
      const result = decodeJWT(tokenInput)
      setDecodedToken({
        ...result,
        formatValidation,
        signatureVerification
      })
      setError('')
    } catch (error) {
      setError(error.message)
      setDecodedToken(null)
    }
  }, [tokenInput, decodeSecret])

  // Encode functions
  const encodeToken = useCallback(() => {
    try {
      if (!headerInput.trim() || !payloadInput.trim()) {
        setError('Both header and payload are required')
        return
      }

      const header = JSON.parse(headerInput)
      const payload = JSON.parse(payloadInput)
      
      const token = encodeJWT(header, payload, secretInput, algorithm)
      setEncodedToken(token)
      setError('')
    } catch (error) {
      setError(error.message)
      setEncodedToken('')
    }
  }, [headerInput, payloadInput, secretInput, algorithm])

  // Verify functions
  const verifyTokenFunc = useCallback(() => {
    if (!verifyToken.trim()) {
      setVerificationResult(null)
      setError('')
      return
    }

    try {
      const result = verifyJWT(verifyToken, verifySecret, 'HS256')
      setVerificationResult(result)
      setError('')
    } catch (error) {
      setError(error.message)
      setVerificationResult(null)
    }
  }, [verifyToken, verifySecret])

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopySuccess(type)
      setTimeout(() => setCopySuccess(''), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const loadSample = (sampleType = 'decode') => {
    setError('')
    setCopySuccess('')
    
    if (sampleType === 'decode') {
      setTokenInput(sampleJWT)
      setDecodeSecret('your-256-bit-secret')
      try {
        const result = decodeJWT(sampleJWT)
        setDecodedToken(result)
      } catch (error) {
        setError(error.message)
      }
    } else if (sampleType === 'encode') {
      setHeaderInput(JSON.stringify(sampleHeader, null, 2))
      setPayloadInput(JSON.stringify(samplePayload, null, 2))
      setSecretInput('your-256-bit-secret')
    } else if (sampleType === 'verify') {
      setVerifyToken(sampleJWT)
      setVerifySecret('your-256-bit-secret')
    }
  }

  const clearAll = () => {
    // Clear all states
    setTokenInput('')
    setDecodeSecret('')
    setDecodedToken(null)
    setHeaderInput('')
    setPayloadInput('')
    setSecretInput('')
    setEncodedToken('')
    setVerifyToken('')
    setVerifySecret('')
    setVerificationResult(null)
    setError('')
    setCopySuccess('')
  }

  const switchMode = (newMode) => {
    setMode(newMode)
    clearAll()
  }

  return (
    <div className="container">
      <div className="tool-header">
        <h1>JWT Encoder/Decoder</h1>
        <div className="tool-actions">
          <button onClick={() => loadSample(mode)}>Load Sample</button>
          <button onClick={clearAll}>Clear All</button>
        </div>
      </div>

      <p className="muted">
        Encode, decode, and verify JSON Web Tokens (JWT). Create new tokens with signatures 
        or decode existing ones to inspect their contents.
      </p>

      {/* Mode Selection */}
      <div className="jwt-mode-selector">
        <button 
          className={mode === 'decode' ? 'active' : ''}
          onClick={() => switchMode('decode')}
        >
          🔍 Decode JWT
        </button>
        <button 
          className={mode === 'encode' ? 'active' : ''}
          onClick={() => switchMode('encode')}
        >
          🔧 Encode JWT
        </button>
        <button 
          className={mode === 'verify' ? 'active' : ''}
          onClick={() => switchMode('verify')}
        >
          ✅ Verify JWT
        </button>
      </div>

      {/* Decode Mode */}
      {mode === 'decode' && (
        <div className="jwt-mode-content">
          <div className="tool-container" style={{ gridTemplateColumns: '1fr' }}>
            <div className="tool-section">
              <div className="input-group">
                <label htmlFor="jwt-input">JWT Token</label>
                <textarea
                  id="jwt-input"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  placeholder="Paste your JWT token here..."
                  rows={4}
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}
                />
              </div>
              
              <div className="input-group">
                <label htmlFor="decode-secret-input">Secret Key (Optional)</label>
                <input
                  id="decode-secret-input"
                  type="text"
                  value={decodeSecret}
                  onChange={(e) => setDecodeSecret(e.target.value)}
                  placeholder="Enter secret to verify signature"
                  style={{ fontFamily: 'var(--font-mono)' }}
                />
                <small className="muted">Leave empty to decode without signature verification</small>
              </div>
              
              <button 
                onClick={decodeToken}
                className="primary"
                disabled={!tokenInput.trim()}
                style={{ marginTop: '1rem' }}
              >
                Decode JWT
              </button>
            </div>

            {decodedToken && (
              <>
                <div className="jwt-section">
                  <div className="jwt-status">
                    <div className={`jwt-validity ${decodedToken.isValid ? 'valid' : 'invalid'}`}>
                      ✓ Valid JWT Structure
                    </div>
                    {decodedToken.signatureVerification && (
                      <div className={`jwt-signature-status ${decodedToken.signatureVerification.isValid ? 'valid' : 'invalid'}`}>
                        {decodedToken.signatureVerification.isValid ? '✓ Signature Valid' : '❌ Signature Invalid'}
                      </div>
                    )}
                    {decodedToken.isExpired && (
                      <div className="jwt-expired">
                        ⚠️ Token Expired
                      </div>
                    )}
                  </div>
                </div>

                <div className="jwt-parts">
                  <div className="jwt-part">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <h3>Header</h3>
                      <button
                        onClick={() => copyToClipboard(JSON.stringify(decodedToken.header, null, 2), 'header')}
                        className={`copy-button ${copySuccess === 'header' ? 'copied' : ''}`}
                      >
                        {copySuccess === 'header' ? '✓ Copied' : 'Copy'}
                      </button>
                    </div>
                    <pre><code>{JSON.stringify(decodedToken.header, null, 2)}</code></pre>
                  </div>

                  <div className="jwt-part">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <h3>Payload</h3>
                      <button
                        onClick={() => copyToClipboard(JSON.stringify(decodedToken.payload, null, 2), 'payload')}
                        className={`copy-button ${copySuccess === 'payload' ? 'copied' : ''}`}
                      >
                        {copySuccess === 'payload' ? '✓ Copied' : 'Copy'}
                      </button>
                    </div>
                    <pre><code>{JSON.stringify(decodedToken.payload, null, 2)}</code></pre>
                  </div>

                  <div className="jwt-part">
                    <h3>Signature</h3>
                    <div className="signature-info">
                      <p className="muted">
                        Signature: <code style={{ wordBreak: 'break-all' }}>{decodedToken.signature}</code>
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Encode Mode */}
      {mode === 'encode' && (
        <div className="jwt-mode-content">
          <div className="tool-container">
            <div className="tool-section">
              <div className="input-group">
                <label htmlFor="header-input">Header (JSON)</label>
                <textarea
                  id="header-input"
                  value={headerInput}
                  onChange={(e) => setHeaderInput(e.target.value)}
                  placeholder='e.g., {"alg": "HS256", "typ": "JWT"}'
                  rows={6}
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}
                />
              </div>
              
              <div className="input-group">
                <label htmlFor="payload-input">Payload (JSON)</label>
                <textarea
                  id="payload-input"
                  value={payloadInput}
                  onChange={(e) => setPayloadInput(e.target.value)}
                  placeholder='e.g., {"sub": "user123", "name": "John Doe"}'
                  rows={8}
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}
                />
              </div>
            </div>

            <div className="tool-section">
              <div className="input-group">
                <label htmlFor="secret-input">Secret Key</label>
                <input
                  id="secret-input"
                  type="text"
                  value={secretInput}
                  onChange={(e) => setSecretInput(e.target.value)}
                  placeholder="your-256-bit-secret"
                  style={{ fontFamily: 'var(--font-mono)' }}
                />
                <small className="muted">Keep this secret safe! It's used to sign your JWT.</small>
              </div>

              <div className="input-group">
                <label htmlFor="algorithm-select">Algorithm</label>
                <select
                  id="algorithm-select"
                  value={algorithm}
                  onChange={(e) => setAlgorithm(e.target.value)}
                >
                  <option value="HS256">HS256</option>
                  <option value="none">none (unsigned)</option>
                </select>
              </div>

              <button 
                onClick={encodeToken}
                className="primary"
                disabled={!headerInput.trim() || !payloadInput.trim()}
                style={{ marginTop: '1rem' }}
              >
                Generate JWT
              </button>
            </div>
          </div>

          {encodedToken && (
            <div className="jwt-result">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3>Generated JWT</h3>
                <button
                  onClick={() => copyToClipboard(encodedToken, 'encoded')}
                  className={`copy-button ${copySuccess === 'encoded' ? 'copied' : ''}`}
                >
                  {copySuccess === 'encoded' ? '✓ Copied' : 'Copy JWT'}
                </button>
              </div>
              <textarea
                value={encodedToken}
                readOnly
                rows={4}
                style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', backgroundColor: 'var(--bg-secondary)' }}
              />
            </div>
          )}
        </div>
      )}

      {/* Verify Mode */}
      {mode === 'verify' && (
        <div className="jwt-mode-content">
          <div className="tool-container">
            <div className="tool-section">
              <div className="input-group">
                <label htmlFor="verify-token-input">JWT Token to Verify</label>
                <textarea
                  id="verify-token-input"
                  value={verifyToken}
                  onChange={(e) => setVerifyToken(e.target.value)}
                  placeholder="Paste JWT token here..."
                  rows={4}
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}
                />
              </div>
            </div>

            <div className="tool-section">
              <div className="input-group">
                <label htmlFor="verify-secret-input">Secret Key</label>
                <input
                  id="verify-secret-input"
                  type="text"
                  value={verifySecret}
                  onChange={(e) => setVerifySecret(e.target.value)}
                  placeholder="Enter the secret key used to sign this JWT"
                  style={{ fontFamily: 'var(--font-mono)' }}
                />
              </div>

              <button 
                onClick={verifyTokenFunc}
                className="primary"
                disabled={!verifyToken.trim() || !verifySecret.trim()}
                style={{ marginTop: '1rem' }}
              >
                Verify Signature
              </button>
            </div>
          </div>

          {verificationResult && (
            <div className="verification-result">
              <div className={`verification-status ${verificationResult.isValid ? 'valid' : 'invalid'}`}>
                {verificationResult.isValid ? (
                  <>
                    <span className="status-icon">✅</span>
                    <span>Signature is valid</span>
                  </>
                ) : (
                  <>
                    <span className="status-icon">❌</span>
                    <span>Signature verification failed</span>
                  </>
                )}
              </div>
              {verificationResult.error && (
                <p className="verification-error">{verificationResult.error}</p>
              )}
              {verificationResult.message && (
                <p className="verification-message">{verificationResult.message}</p>
              )}
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="error-message" style={{ marginTop: '1rem' }}>
          {error}
        </div>
      )}

      <div className="card" style={{ marginTop: '2rem' }}>
        <h3>About JWT (JSON Web Tokens)</h3>
        <p>
          JWT is a compact, URL-safe means of representing claims between two parties. 
          It consists of three parts separated by dots (.):
        </p>
        <ul style={{ textAlign: 'left', color: 'var(--text-secondary)' }}>
          <li><strong>Header:</strong> Contains the type of token and signing algorithm</li>
          <li><strong>Payload:</strong> Contains the claims (statements about the entity)</li>
          <li><strong>Signature:</strong> Used to verify the sender and ensure integrity</li>
        </ul>
        <p className="muted">
          <strong>Security Note:</strong> Never share secret keys publicly. This tool runs entirely in your browser.
        </p>
      </div>
    </div>
  )
}

export default JwtDecoder
