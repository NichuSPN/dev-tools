// Helper function to get current timestamp
export function getCurrentTimestamp() {
    return Math.floor(Date.now() / 1000)
  }
  
  // Helper function to add time to current timestamp
  export function addTimeToTimestamp(hours = 1) {
    return getCurrentTimestamp() + (hours * 3600)
  }