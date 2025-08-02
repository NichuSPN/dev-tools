import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'

// Import tool components
import JsonEdnConverter from './pages/JsonEdnConverter'
import Jwt from './pages/Jwt'
import Base64Converter from './pages/Base64Converter'
import UuidGenerator from './pages/UuidGenerator'
import JsonFormatter from './pages/JsonFormatter'
import YamlFormatter from './pages/YamlFormatter'
import Home from './pages/Home'

import Navigation from './components/navigationBar'
import ComingSoon from './components/comingSoon'
import TimestampConverter from './pages/TimestampConverter'
import RegexTester from './pages/RegexTester.jsx'
import CronParser from './pages/CronParser.jsx'

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
      component: TimestampConverter,
      description: 'Convert between timestamps and readable dates'
    },
  ],
  'Formatters': [
    { 
      name: 'JSON Formatter', 
      path: '/json-formatter', 
      component: JsonFormatter,
      description: 'Format, validate, and visualize JSON data'
    },
    { 
      name: 'YAML Formatter', 
      path: '/yaml-formatter', 
      component: YamlFormatter,
      description: 'Format, validate, and convert YAML data'
    },
  ],
  'Web Tools': [
    { 
      name: 'JWT Encoder/Decoder', 
      path: '/jwt', 
      component: Jwt,
      description: 'Decode and inspect JSON Web Tokens'
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
      component: RegexTester,
      description: 'Test regular expressions with live matching'
    },
    { 
      name: 'Cron Parser', 
      path: '/cron', 
      component: CronParser,
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
        <footer style={{
          width: '100%',
          textAlign: 'center',
          padding: '2rem 0 1rem 0',
          color: 'var(--text-secondary)',
          fontSize: '1rem',
          background: 'none',
        }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <a href="https://github.com/NichuSPN/dev-tools" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--accent)', textDecoration: 'none', fontWeight: 600, fontSize: '1.1em', gap: '0.4em' }}>
              <svg height="22" width="22" viewBox="0 0 16 16" fill="currentColor" style={{ verticalAlign: 'middle' }} aria-hidden="true">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.19 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
              </svg>
              <span>Open Source on GitHub</span>
            </a>
            <span style={{ marginLeft: 8 }}>
              &mdash; Contributions welcome! Star or fork the repo to get involved.
            </span>
          </span>
        </footer>
      </div>
    </Router>
  )
}

export default App
