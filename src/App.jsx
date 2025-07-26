import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'

// Import tool components
import JsonEdnConverter from './pages/JsonEdnConverter'
import Jwt from './pages/Jwt'
import Base64Converter from './pages/Base64Converter'
import UuidGenerator from './pages/UuidGenerator'
import Home from './pages/Home'

import Navigation from './components/navigationBar'
import ComingSoon from './components/comingSoon'

const toolCategories = {
  'Converters': [
    { 
      name: 'JSON ⇄ EDN', 
      path: '/json-edn', 
      component: JsonEdnConverter ,
      description: 'Convert between JSON and EDN (Extensible Data Notation) formats'
    },
    { 
      name: 'Base64 Encoder/Decoder', 
      path: '/base64', 
      component: Base64Converter,
      description: 'Encode and decode Base64 strings'
    },
    { 
      name: 'Timestamp Converter', 
      path: '/timestamp', 
      component: null,
      description: 'Convert between timestamps and readable dates'
    },
    { 
      name: 'JSON/YAML Formatter', 
      path: '/formatter', 
      component: null,
      description: 'Format and validate JSON and YAML'
    },
  ],
  'Web Tools': [
    { 
      name: 'JWT Encoder/Decoder', 
      path: '/jwt', 
      component: Jwt,
      description: 'Decode and inspect JSON Web Tokens'
    },
    { 
      name: 'HTTP Converter', 
      path: '/http-converter', 
      component: null,
      description: 'Convert between curl, fetch, and HTTPie formats'
    },
  ],
  'Generators & Testers': [
    { 
      name: 'UUID Generator', 
      path: '/uuid', 
      component: UuidGenerator,
      description: 'Generate UUIDs in various formats'
    },
    { 
      name: 'Regex Tester', 
      path: '/regex', 
      component: null,
      description: 'Test regular expressions with live matching'
    },
    { 
      name: 'Cron Parser', 
      path: '/cron', 
      component: null,
      description: 'Parse and explain cron expressions'
    },
  ]
}

// Flatten for routing
const tools = Object.values(toolCategories).flat()

let routes = []

for (const tool of tools) {
  if (tool.component) {
    routes.push(
      <Route key={tool.path} path={tool.path} element={<tool.component />} />
    )
  } else { 
    routes.push(
      <Route key={tool.path} path={tool.path} element={<ComingSoon toolName={tool.name} />} />
    )
  }
}

function App() {
  return (
    <Router>
      <div className="app">
        <Navigation toolCategories={toolCategories} />
        <main className="main">
          <Routes>
            <Route path="/" element={<Home tools={tools} toolCategories={toolCategories} />} />
            {routes}
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
