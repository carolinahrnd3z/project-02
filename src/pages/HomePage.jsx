import { Link } from 'react-router-dom'
import '../styles/HomePage.css'

const HomePage = () => {
  return (
    <main className="home">
      <section className="home-hero">
        <div className="home-text">
          <p className="home-tagline">Welcome to</p>
          <h1 className="home-title">Cozy Reads Blog</h1>
          <p className="home-subtitle">
            A soft, bookish corner of the internet where you can browse posts,
            react to your favorite stories, and share your thoughts.
          </p>

          <div className="home-buttons">
            <Link to="/login" className="home-btn primary">
              Log in
            </Link>
            <Link to="/posts" className="home-btn secondary">
              Explore Blog
            </Link>
          </div>

          <p className="home-note">
            New here? Use any username and a password (6+ characters) to log in and start commenting.
          </p>
        </div>

        <div className="home-card">
          <h2>What you can do</h2>
          <ul>
            <li>Browse cozy, fan-made blog posts</li>
            <li>Switch between light and dark themes</li>
            <li>Log in to leave comments on posts</li>
          </ul>
        </div>
      </section>
    </main>
  )
}

export default HomePage
