// Base64 encoding/decoding utilities

export function encodeBase64(input) {
  try {
    if (typeof input !== 'string') {
      throw new Error('Input must be a string')
    }
    
    // Encode to base64
    const encoded = btoa(unescape(encodeURIComponent(input)))
    
    return encoded
  } catch (error) {
    throw new Error(`Base64 encoding failed: ${error.message}`)
  }
}

export function decodeBase64(input) {
  try {
    if (typeof input !== 'string') {
      throw new Error('Input must be a string')
    }
    
    const cleanInput = input.trim()
    
    if (!cleanInput) {
      throw new Error('Input is empty')
    }
    
    // Validate base64 format
    if (!isValidBase64(cleanInput)) {
      throw new Error('Invalid base64 format')
    }
    
    // Decode from base64
    const decoded = atob(cleanInput)
    return decodeURIComponent(escape(decoded))
  } catch (error) {
    throw new Error(`Base64 decoding failed: ${error.message}`)
  }
}

function isValidBase64(str) {
  try {
    // Base64 regex pattern
    const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/
    
    if (!base64Regex.test(str)) {
      return false
    }
    
    // Check if length is multiple of 4
    if (str.length % 4 !== 0) {
      return false
    }
    
    // Try to decode to verify
    atob(str)
    return true
  } catch (e) {
    return false
  }
}

export function analyzeBase64(input) {
  const analysis = {
    length: input.length,
    isValid: false,
    padding: 0,
    estimatedSize: 0
  }
  
  if (!input) return analysis
  
  // Count padding
  const paddingMatch = input.match(/=+$/)
  analysis.padding = paddingMatch ? paddingMatch[0].length : 0
  
  // Validate format
  analysis.isValid = isValidBase64(input)
  
  // Estimate decoded size (roughly 3/4 of encoded size)
  analysis.estimatedSize = Math.floor((input.length * 3) / 4) - analysis.padding
  
  return analysis
}
