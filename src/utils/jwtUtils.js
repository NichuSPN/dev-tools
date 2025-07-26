// JWT (JSON Web Token) utilities
import CryptoJS from 'crypto-js'

export function decodeJWT(token) {
  try {
    // Remove any whitespace
    const cleanToken = token.trim()
    
    // Split the token into parts
    const parts = cleanToken.split('.')
    
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format. Expected 3 parts separated by dots.')
    }
    
    const [headerEncoded, payloadEncoded, signature] = parts
    
    // Decode header
    const header = decodeBase64Url(headerEncoded)
    let headerObj
    try {
      headerObj = JSON.parse(header)
    } catch (e) {
      throw new Error('Invalid JWT header: not valid JSON')
    }
    
    // Decode payload
    const payload = decodeBase64Url(payloadEncoded)
    let payloadObj
    try {
      payloadObj = JSON.parse(payload)
    } catch (e) {
      throw new Error('Invalid JWT payload: not valid JSON')
    }
    
    // Process timestamps
    const processedPayload = processTimestamps(payloadObj)
    
    return {
      header: headerObj,
      payload: processedPayload,
      signature: signature,
      isExpired: isTokenExpired(payloadObj),
      isValid: true
    }
  } catch (error) {
    throw new Error(`JWT decode error: ${error.message}`)
  }
}

function decodeBase64Url(str) {
  // Add padding if needed
  let paddedStr = str
  while (paddedStr.length % 4) {
    paddedStr += '='
  }
  
  // Replace URL-safe characters
  paddedStr = paddedStr.replace(/-/g, '+').replace(/_/g, '/')
  
  try {
    // Decode base64
    const decoded = atob(paddedStr)
    // Convert to UTF-8
    return decodeURIComponent(escape(decoded))
  } catch (e) {
    throw new Error('Invalid base64 encoding')
  }
}

function processTimestamps(payload) {
  const processed = { ...payload }
  
  // Common JWT timestamp fields
  const timestampFields = ['exp', 'iat', 'nbf', 'auth_time']
  
  timestampFields.forEach(field => {
    if (processed[field] && typeof processed[field] === 'number') {
      processed[`${field}_readable`] = new Date(processed[field] * 1000).toISOString()
    }
  })
  
  return processed
}

function isTokenExpired(payload) {
  if (!payload.exp) return false
  
  const now = Math.floor(Date.now() / 1000)
  return payload.exp < now
}

export function encodeJWT(header, payload, secret = '', algorithm = 'HS256') {
  try {
    // Ensure header has required fields
    const fullHeader = {
      alg: algorithm,
      typ: 'JWT',
      ...header
    }
    
    // Encode header and payload
    const encodedHeader = encodeBase64Url(JSON.stringify(fullHeader))
    const encodedPayload = encodeBase64Url(JSON.stringify(payload))
    
    // Create signature
    const data = `${encodedHeader}.${encodedPayload}`
    let signature = ''
    
    if (secret && algorithm === 'HS256') {
      signature = createHS256SignatureSync(data, secret)
    } else if (algorithm === 'none') {
      signature = ''
    } else {
      // For demo purposes, create a placeholder signature
      signature = 'signature-placeholder-' + Math.random().toString(36).substring(2, 15)
    }
    
    return `${data}.${signature}`
  } catch (error) {
    throw new Error(`JWT encoding failed: ${error.message}`)
  }
}

export function verifyJWT(token, secret = '', algorithm = 'HS256') {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) {
      return { isValid: false, error: 'Invalid JWT format' }
    }
    
    const [headerEncoded, payloadEncoded, signatureProvided] = parts
    const data = `${headerEncoded}.${payloadEncoded}`
    
    if (!secret) {
      return { isValid: false, error: 'Secret key required for verification' }
    }
    
    if (algorithm === 'HS256') {
      const expectedSignature = createHS256SignatureSync(data, secret)
      const isValid = expectedSignature === signatureProvided
      
      return {
        isValid,
        error: isValid ? null : 'Signature verification failed',
        message: isValid ? 'Signature is valid' : 'Invalid signature'
      }
    } else {
      return { isValid: false, error: `Algorithm ${algorithm} not supported for verification` }
    }
  } catch (error) {
    return { isValid: false, error: `Verification failed: ${error.message}` }
  }
}

function encodeBase64Url(str) {
  return btoa(unescape(encodeURIComponent(str)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

// Proper HMAC-SHA256 implementation using crypto-js
function createHS256SignatureSync(data, secret) {
  try {
    // Use crypto-js for proper HMAC-SHA256
    const hash = CryptoJS.HmacSHA256(data, secret)
    const base64 = CryptoJS.enc.Base64.stringify(hash)
    
    // Convert to base64url format
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
  } catch (error) {
    console.error('HMAC-SHA256 failed:', error)
    // Fallback to a simple hash if crypto-js fails
    return createFallbackSignature(data, secret)
  }
}

// Fallback signature for environments where crypto-js might not work
function createFallbackSignature(data, secret) {
  const combined = data + secret
  let hash = 0
  
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  
  // Convert to base64url-like string
  const hashStr = Math.abs(hash).toString(36)
  return (hashStr + hashStr + hashStr).substring(0, 43)
}

export function validateJWTFormat(token) {
  const cleanToken = token.trim()
  
  if (!cleanToken) {
    return { isValid: false, error: 'Token is empty' }
  }
  
  const parts = cleanToken.split('.')
  
  if (parts.length !== 3) {
    return { isValid: false, error: 'JWT must have exactly 3 parts separated by dots' }
  }
  
  // Check if parts are base64url encoded
  const base64UrlRegex = /^[A-Za-z0-9_-]+$/
  
  if (!base64UrlRegex.test(parts[0])) {
    return { isValid: false, error: 'Header is not valid base64url' }
  }
  
  if (!base64UrlRegex.test(parts[1])) {
    return { isValid: false, error: 'Payload is not valid base64url' }
  }
  
  if (parts[2] && !base64UrlRegex.test(parts[2])) {
    return { isValid: false, error: 'Signature is not valid base64url' }
  }
  
  return { isValid: true }
}
