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

// Generate multiple UUIDs
export function generateMultipleUUIDs(count, version = 4) {
  const uuids = []
  for (let i = 0; i < count; i++) {
    switch (version) {
      case 4:
        uuids.push(generateUUIDv4())
        break
      default:
        uuids.push(generateUUIDv4())
    }
  }
  return uuids
}

// Validate UUID format
function validateUUID(uuid) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
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
