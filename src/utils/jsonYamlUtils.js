// JSON/YAML formatting utilities
import yaml from 'js-yaml'

// Validate JSON string
export function validateJSON(jsonString) {
  try {
    const parsed = JSON.parse(jsonString)
    return {
      isValid: true,
      parsed,
      error: null
    }
  } catch (error) {
    return {
      isValid: false,
      parsed: null,
      error: error.message
    }
  }
}

// Validate YAML string
export function validateYAML(yamlString) {
  try {
    const parsed = yaml.load(yamlString)
    return {
      isValid: true,
      parsed,
      error: null
    }
  } catch (error) {
    return {
      isValid: false,
      parsed: null,
      error: error.message
    }
  }
}

// Format JSON with different indentation options
export function formatJSON(data, indent = 2) {
  try {
    if (typeof data === 'string') {
      const validation = validateJSON(data)
      if (!validation.isValid) {
        throw new Error(validation.error)
      }
      data = validation.parsed
    }
    return JSON.stringify(data, null, indent)
  } catch (error) {
    throw new Error(`JSON formatting error: ${error.message}`)
  }
}

// Minify JSON (remove all whitespace)
export function minifyJSON(data) {
  try {
    if (typeof data === 'string') {
      const validation = validateJSON(data)
      if (!validation.isValid) {
        throw new Error(validation.error)
      }
      data = validation.parsed
    }
    return JSON.stringify(data)
  } catch (error) {
    throw new Error(`JSON minification error: ${error.message}`)
  }
}

// Convert JSON to YAML
export function jsonToYAML(jsonString) {
  try {
    const validation = validateJSON(jsonString)
    if (!validation.isValid) {
      throw new Error(validation.error)
    }
    return yaml.dump(validation.parsed, {
      indent: 2,
      lineWidth: 120,
      noRefs: true,
      sortKeys: false
    })
  } catch (error) {
    throw new Error(`JSON to YAML conversion error: ${error.message}`)
  }
}

// Convert YAML to JSON
export function yamlToJSON(yamlString, indent = 2) {
  try {
    const validation = validateYAML(yamlString)
    if (!validation.isValid) {
      throw new Error(validation.error)
    }
    return JSON.stringify(validation.parsed, null, indent)
  } catch (error) {
    throw new Error(`YAML to JSON conversion error: ${error.message}`)
  }
}

// Analyze JSON structure
export function analyzeJSON(jsonString) {
  try {
    const validation = validateJSON(jsonString)
    if (!validation.isValid) {
      throw new Error(validation.error)
    }

    const data = validation.parsed
    const stats = {
      isValid: true,
      size: jsonString.length,
      minifiedSize: JSON.stringify(data).length,
      type: Array.isArray(data) ? 'array' : typeof data,
      depth: 0,
      keys: 0,
      values: 0
    }

    // Calculate depth and count properties
    function analyze(obj, currentDepth = 0) {
      stats.depth = Math.max(stats.depth, currentDepth)
      
      if (obj && typeof obj === 'object') {
        if (Array.isArray(obj)) {
          stats.values += obj.length
          obj.forEach(item => analyze(item, currentDepth + 1))
        } else {
          const keys = Object.keys(obj)
          stats.keys += keys.length
          keys.forEach(key => {
            analyze(obj[key], currentDepth + 1)
          })
        }
      } else {
        stats.values++
      }
    }

    analyze(data)
    
    return stats
  } catch (error) {
    return {
      isValid: false,
      error: error.message
    }
  }
}

// Get data type of a value
export function getDataType(value) {
  if (value === null) return 'null'
  if (Array.isArray(value)) return 'array'
  if (typeof value === 'object') return 'object'
  if (typeof value === 'string') return 'string'
  if (typeof value === 'number') return 'number'
  if (typeof value === 'boolean') return 'boolean'
  return 'unknown'
}

// Convert value to display string
export function valueToString(value) {
  if (value === null) return 'null'
  if (value === undefined) return 'undefined'
  if (typeof value === 'string') return value
  if (typeof value === 'boolean') return value.toString()
  if (typeof value === 'number') return value.toString()
  if (Array.isArray(value)) return `[ ${value.length} items ]`
  if (typeof value === 'object') {
    const keys = Object.keys(value)
    return `{ ${keys.length} props }`
  }
  return String(value)
}
