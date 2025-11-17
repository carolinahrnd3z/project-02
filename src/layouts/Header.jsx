import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import '../styles/Header.css'

const Header = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="header kawaii">
      <div className="container">
        {/* Brand section with title and tagline */}
        <div className="brand-wrap">
          <h1 className="brand">Brandon Sanderson's Books! ✨</h1>
          <p className="tagline"> • Cozy Magic • Fantasic Worldbuilding • </p>
        </div>

        {/* Navigation links */}
        <nav className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/posts" className="nav-link">Posts</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
          <button 
            onClick={toggleTheme} 
            className="theme-toggle kawaii-btn"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </nav>
      </div>
    </header>
  )
}

export default Header
