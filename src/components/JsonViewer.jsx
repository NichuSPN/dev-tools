import { useState } from 'react'
import { getDataType, valueToString } from '../utils/jsonYamlUtils'

function JsonViewer({ data, maxDepth = 10 }) {
  const [collapsed, setCollapsed] = useState(new Set())

  const toggleCollapse = (path) => {
    const newCollapsed = new Set(collapsed)
    if (newCollapsed.has(path)) {
      newCollapsed.delete(path)
    } else {
      newCollapsed.add(path)
    }
    setCollapsed(newCollapsed)
  }

  const renderValue = (value, key, path = '', depth = 0) => {
    const currentPath = path ? `${path}.${key}` : key
    const dataType = getDataType(value)
    const isCollapsed = collapsed.has(currentPath)

    if (depth > maxDepth) {
      return (
        <div className="json-viewer-item" style={{ marginLeft: `${depth * 20}px` }}>
          <span className="json-viewer-key">{key}:</span>
          <span className="json-viewer-value json-viewer-truncated">
            [Maximum depth reached]
          </span>
        </div>
      )
    }

    if (dataType === 'object' && value !== null) {
      const keys = Object.keys(value)
      const isEmpty = keys.length === 0

      return (
        <div key={currentPath} className="json-viewer-object">
          <div 
            className="json-viewer-item json-viewer-expandable"
            style={{ marginLeft: `${depth * 20}px` }}
            onClick={() => !isEmpty && toggleCollapse(currentPath)}
          >
            {!isEmpty && (
              <span className={`json-viewer-arrow ${isCollapsed ? 'collapsed' : 'expanded'}`}>
                ▶
              </span>
            )}
            <span className="json-viewer-key">{key}:</span>
            <span className="json-viewer-type json-viewer-object-type">
              {isEmpty ? '{}' : `{ ${keys.length} props }`}
            </span>
          </div>
          {!isEmpty && !isCollapsed && (
            <div className="json-viewer-children">
              {keys.map(objKey => 
                renderValue(value[objKey], objKey, currentPath, depth + 1)
              )}
            </div>
          )}
        </div>
      )
    }

    if (dataType === 'array') {
      const isEmpty = value.length === 0

      return (
        <div key={currentPath} className="json-viewer-array">
          <div 
            className="json-viewer-item json-viewer-expandable"
            style={{ marginLeft: `${depth * 20}px` }}
            onClick={() => !isEmpty && toggleCollapse(currentPath)}
          >
            {!isEmpty && (
              <span className={`json-viewer-arrow ${isCollapsed ? 'collapsed' : 'expanded'}`}>
                ▶
              </span>
            )}
            <span className="json-viewer-key">{key}:</span>
            <span className="json-viewer-type json-viewer-array-type">
              {isEmpty ? '[]' : `[ ${value.length} items ]`}
            </span>
          </div>
          {!isEmpty && !isCollapsed && (
            <div className="json-viewer-children">
              {value.map((item, index) => 
                renderValue(item, index, currentPath, depth + 1)
              )}
            </div>
          )}
        </div>
      )
    }

    // Primitive values
    return (
      <div key={currentPath} className="json-viewer-item" style={{ marginLeft: `${depth * 20}px` }}>
        <span className="json-viewer-key">{key}:</span>
        <span className={`json-viewer-value json-viewer-${dataType}`}>
          {dataType === 'string' && '"'}{valueToString(value)}{dataType === 'string' && '"'}
        </span>
      </div>
    )
  }

  if (!data) {
    return <div className="json-viewer-empty">No data to display</div>
  }

  const rootType = getDataType(data)
  
  return (
    <div className="json-viewer">
      <div className="json-viewer-root">
        {rootType === 'object' && data !== null ? (
          Object.keys(data).map(key => renderValue(data[key], key, '', 0))
        ) : rootType === 'array' ? (
          data.map((item, index) => renderValue(item, index, '', 0))
        ) : (
          <div className="json-viewer-item">
            <span className={`json-viewer-value json-viewer-${rootType}`}>
              {rootType === 'string' && '"'}{valueToString(data)}{rootType === 'string' && '"'}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export default JsonViewer
