import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import '../styles/Header.css'

const Header = () => {
  const { theme, toggleTheme } = useTheme()
  const { isAuthenticated, user, logout } = useAuth()

  return (
    <header className={`header ${theme}`}>
      <div className="header-content">
        {/* Logo / Brand */}
        <Link to="/" className="logo">
          Kawaii Blog
        </Link>

        {/* Navigation */}
        <nav className="nav-links">
          <Link to="/posts" className="nav-link">
            Posts
          </Link>

          <Link to="/contact" className="nav-link">
            Contact
          </Link>

          {/* Auth UI */}
          {isAuthenticated ? (
            <>
              <span className="nav-user">
                Hi, {user?.username || 'Reader'}!
              </span>

              <button
                type="button"
                className="kawaii-btn nav-btn"
                onClick={logout}
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="kawaii-btn nav-btn">
              Login
            </Link>
          )}

          {/* Theme toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="theme-toggle kawaii-btn"
            aria-label={`Switch to ${
              theme === 'light' ? 'dark' : 'light'
            } mode`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </nav>
      </div>
    </header>
  )
}

export default Header
