import { Link } from 'react-router-dom'

function ToolsGrid ({tools}) {
  return (
    <div className="tools-grid">
      {tools.map((tool) => (
        <Link key={tool.path} to={tool.path} className="tool-card">
          <h3>{tool.name}</h3>
          <p className="muted">
            {tool.description}
          </p>
          {!tool.component && (
            <span className="coming-soon-badge">Coming Soon</span>
          )}
        </Link>
      ))}
    </div>

   )
}

function Home({ tools }) {
  return (
    <div className="container">
      <div className="home-header">
        <h1>Developer Tools</h1>
        <p className="muted">
          A collection of useful utilities for developers. All tools run entirely in your browser - no data is sent to any server.
        </p>
      </div>
      
      <ToolsGrid tools={tools} />

    </div>
  )
}

export default Home
