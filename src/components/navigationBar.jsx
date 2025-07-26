import { Link, useLocation } from 'react-router-dom'

function Navigation ({ toolCategories }) {
    const location = useLocation()
    return (
        <nav className="nav">
            <div className="nav-container">
                <Link to="/" className="nav-logo">
                <span className="nav-title">Dev Tools</span>
                </Link>
                <div className="nav-groups">
                {Object.entries(toolCategories).map(([category, categoryTools]) => (
                    <div key={category} className="nav-group">
                    <button className="nav-group-toggle">
                        {category}
                        <span className="dropdown-arrow">▼</span>
                    </button>
                    <div className="nav-dropdown">
                        {categoryTools.map((tool) => (
                        <Link
                            key={tool.path}
                            to={tool.path}
                            className={`nav-dropdown-link ${location.pathname === tool.path ? 'active' : ''}`}
                        >
                            {tool.name}
                            {!tool.component && <span className="coming-soon-inline">Soon</span>}
                        </Link>
                        ))}
                    </div>
                    </div>
                ))}
                </div>
            </div>
        </nav>
    )
}

export default Navigation;