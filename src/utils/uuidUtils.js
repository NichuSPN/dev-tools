// UUID (Universally Unique Identifier) utilities

// Generate UUID v4 (random)
export function generateUUIDv4() {
  // Use crypto.randomUUID if available (modern browsers)
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  
  // Fallback implementation
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

// Generate UUID v7 (time-ordered)
export function generateUUIDv7() {
  // Get current timestamp in milliseconds
  const timestamp = Date.now()
  
  // Convert timestamp to hex (48 bits)
  const timestampHex = timestamp.toString(16).padStart(12, '0')
  
  // Generate random bytes for the rest
  const randomBytes = new Uint8Array(10)
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(randomBytes)
  } else {
    // Fallback for environments without crypto.getRandomValues
    for (let i = 0; i < randomBytes.length; i++) {
      randomBytes[i] = Math.floor(Math.random() * 256)
    }
  }
  
  // Set version (7) and variant bits
  randomBytes[0] = (randomBytes[0] & 0x0f) | 0x70 // Version 7
  randomBytes[2] = (randomBytes[2] & 0x3f) | 0x80 // Variant 10
  
  // Convert random bytes to hex
  const randomHex = Array.from(randomBytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
  
  // Format as UUID: xxxxxxxx-xxxx-7xxx-xxxx-xxxxxxxxxxxx
  const uuid = [
    timestampHex.slice(0, 8),
    timestampHex.slice(8, 12),
    randomHex.slice(0, 4),
    randomHex.slice(4, 8),
    randomHex.slice(8, 20)
  ].join('-')
  
  return uuid
}

// Generate multiple UUIDs
export function generateMultipleUUIDs(count, version = 4) {
  const uuids = []
  for (let i = 0; i < count; i++) {
    switch (version) {
      case 4:
        uuids.push(generateUUIDv4())
        break
      case 7:
        uuids.push(generateUUIDv7())
        break
      default:
        uuids.push(generateUUIDv4())
    }
  }
  return uuids
}

// Validate UUID format
function validateUUID(uuid) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-7][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}

// Parse UUID and extract information
export function parseUUID(uuid) {
  if (!validateUUID(uuid)) {
    throw new Error('Invalid UUID format')
  }
  
  const cleanUuid = uuid.toLowerCase()
  const parts = cleanUuid.split('-')
  
  // Extract version
  const version = parseInt(parts[2].charAt(0), 16)
  
  // Extract variant
  const variantBits = parseInt(parts[3].charAt(0), 16)
  let variant = 'Unknown'
  
  if ((variantBits & 8) === 0) {
    variant = 'Reserved (NCS backward compatibility)'
  } else if ((variantBits & 12) === 8) {
    variant = 'RFC 4122'
  } else if ((variantBits & 14) === 12) {
    variant = 'Reserved (Microsoft Corporation)'
  } else {
    variant = 'Reserved (future definition)'
  }
  
  const info = {
    uuid: cleanUuid,
    version,
    variant,
    isNil: cleanUuid === '00000000-0000-0000-0000-000000000000',
    isMax: cleanUuid === 'ffffffff-ffff-ffff-ffff-ffffffffffff'
  }
  
  // Additional info for specific versions
  if (version === 1) {
    info.type = 'Time-based'
    info.description = 'Generated using timestamp, clock sequence, and MAC address'
  } else if (version === 4) {
    info.type = 'Random'
    info.description = 'Generated using random or pseudo-random numbers'
  } else if (version === 7) {
    info.type = 'Time-ordered'
    info.description = 'Generated using Unix timestamp with random data for sorting'
    
    // Extract timestamp from UUID v7
    try {
      const timestampHex = parts[0] + parts[1]
      const timestamp = parseInt(timestampHex, 16)
      info.timestamp = timestamp
      info.generatedAt = new Date(timestamp).toISOString()
    } catch (e) {
      // If timestamp extraction fails, continue without it
    }
  } else {
    info.type = `Version ${version}`
    info.description = 'Less commonly used UUID version'
  }
  
  return info
}

// Get UUID statistics
export function getUUIDStats(uuids) {
  const stats = {
    total: uuids.length,
    versions: {},
    variants: {},
    duplicates: 0,
    nil: 0,
    max: 0
  }
  
  const seen = new Set()
  
  uuids.forEach(uuid => {
    try {
      const info = parseUUID(uuid)
      
      // Count versions
      stats.versions[info.version] = (stats.versions[info.version] || 0) + 1
      
      // Count variants
      stats.variants[info.variant] = (stats.variants[info.variant] || 0) + 1
      
      // Count special UUIDs
      if (info.isNil) stats.nil++
      if (info.isMax) stats.max++
      
      // Count duplicates
      if (seen.has(uuid)) {
        stats.duplicates++
      } else {
        seen.add(uuid)
      }
    } catch (e) {
      // Skip invalid UUIDs
    }
  })
  
  return stats
}
