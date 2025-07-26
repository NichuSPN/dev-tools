import { Link } from 'react-router-dom'

function ToolGrid ({tools}) {
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

export default ToolGrid;