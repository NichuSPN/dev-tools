// Simple JSON to EDN converter
// EDN (Extensible Data Notation) is used primarily in Clojure

export function jsonToEdn(jsonStr) {
  try {
    const parsed = JSON.parse(jsonStr)
    return formatAsEdn(parsed, 0)
  } catch (error) {
    throw new Error(`Invalid JSON: ${error.message}`)
  }
}

export function ednToJson(ednStr) {
  try {
    // Simple EDN parser - handles basic cases
    const parsed = parseEdn(ednStr.trim())
    return JSON.stringify(parsed, null, 2)
  } catch (error) {
    throw new Error(`Invalid EDN: ${error.message}`)
  }
}

function formatAsEdn(value, indent = 0) {
  const spaces = '  '.repeat(indent)
  
  if (value === null) {
    return 'nil'
  }
  
  if (typeof value === 'boolean') {
    return value.toString()
  }
  
  if (typeof value === 'number') {
    return value.toString()
  }
  
  if (typeof value === 'string') {
    return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`
  }
  
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return '[]'
    }
    
    const items = value.map(item => formatAsEdn(item, indent + 1))
    
    if (items.join(' ').length <= 60) {
      return `[${items.join(' ')}]`
    }
    
    return `[${items.map(item => `\n${spaces}  ${item}`).join('')}\n${spaces}]`
  }
  
  if (typeof value === 'object' && value !== null) {
    const entries = Object.entries(value)
    
    if (entries.length === 0) {
      return '{}'
    }
    
    const pairs = entries.map(([key, val]) => {
      const keyStr = /^[a-zA-Z_][a-zA-Z0-9_-]*$/.test(key) ? `:${key}` : `"${key}"`
      return `${keyStr} ${formatAsEdn(val, indent + 1)}`
    })
    
    if (pairs.join(' ').length <= 60) {
      return `{${pairs.join(' ')}}`
    }
    
    return `{${pairs.map(pair => `\n${spaces}  ${pair}`).join('')}\n${spaces}}`
  }
  
  return String(value)
}

function parseEdn(str) {
  const tokens = tokenize(str)
  const result = parseValue(tokens)
  return result
}

function tokenize(str) {
  const tokens = []
  let i = 0
  
  while (i < str.length) {
    const char = str[i]
    
    // Skip whitespace
    if (/\s/.test(char)) {
      i++
      continue
    }
    
    // Comments
    if (char === ';') {
      while (i < str.length && str[i] !== '\n') {
        i++
      }
      continue
    }
    
    // Strings
    if (char === '"') {
      let value = ''
      i++ // skip opening quote
      while (i < str.length && str[i] !== '"') {
        if (str[i] === '\\' && i + 1 < str.length) {
          i++ // skip escape
          const next = str[i]
          if (next === 'n') value += '\n'
          else if (next === 't') value += '\t'
          else if (next === 'r') value += '\r'
          else if (next === '\\') value += '\\'
          else if (next === '"') value += '"'
          else value += next
        } else {
          value += str[i]
        }
        i++
      }
      i++ // skip closing quote
      tokens.push({ type: 'string', value })
      continue
    }
    
    // Keywords
    if (char === ':') {
      let value = ':'
      i++
      while (i < str.length && /[a-zA-Z0-9_-]/.test(str[i])) {
        value += str[i]
        i++
      }
      tokens.push({ type: 'keyword', value })
      continue
    }
    
    // Numbers
    if (/[-+]?[0-9]/.test(char)) {
      let value = ''
      if (char === '-' || char === '+') {
        value += char
        i++
      }
      while (i < str.length && /[0-9.]/.test(str[i])) {
        value += str[i]
        i++
      }
      const num = parseFloat(value)
      tokens.push({ type: 'number', value: num })
      continue
    }
    
    // Booleans and nil
    if (/[a-zA-Z]/.test(char)) {
      let value = ''
      while (i < str.length && /[a-zA-Z]/.test(str[i])) {
        value += str[i]
        i++
      }
      
      if (value === 'true') {
        tokens.push({ type: 'boolean', value: true })
      } else if (value === 'false') {
        tokens.push({ type: 'boolean', value: false })
      } else if (value === 'nil') {
        tokens.push({ type: 'nil', value: null })
      } else {
        tokens.push({ type: 'symbol', value })
      }
      continue
    }
    
    // Structural characters
    if ('{}[]'.includes(char)) {
      tokens.push({ type: char, value: char })
      i++
      continue
    }
    
    // Skip unknown characters
    i++
  }
  
  return tokens
}

function parseValue(tokens) {
  if (tokens.length === 0) {
    throw new Error('Unexpected end of input')
  }
  
  const token = tokens.shift()
  
  switch (token.type) {
    case 'string':
    case 'number':
    case 'boolean':
      return token.value
    
    case 'nil':
      return null
    
    case 'keyword':
      // Convert keyword to string key (remove :)
      return token.value.slice(1)
    
    case '[':
      const array = []
      while (tokens.length > 0 && tokens[0].type !== ']') {
        array.push(parseValue(tokens))
      }
      if (tokens.length === 0) {
        throw new Error('Unclosed array')
      }
      tokens.shift() // consume ']'
      return array
    
    case '{':
      const object = {}
      while (tokens.length > 0 && tokens[0].type !== '}') {
        let key = parseValue(tokens)
        
        // Handle keyword keys
        if (typeof key === 'string' && !key.startsWith(':')) {
          // Regular string key, keep as-is
        } else if (typeof key === 'string' && key.startsWith(':')) {
          key = key.slice(1) // Remove : from keyword
        }
        
        if (tokens.length === 0) {
          throw new Error('Expected value after key')
        }
        
        const value = parseValue(tokens)
        object[key] = value
      }
      if (tokens.length === 0) {
        throw new Error('Unclosed map')
      }
      tokens.shift() // consume '}'
      return object
    
    default:
      throw new Error(`Unexpected token: ${token.type}`)
  }
}
