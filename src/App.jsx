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
      </div>
    </Router>
  )
}

export default App
