import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import Header from '../layouts/Header'
import Footer from '../layouts/Footer'
import { useAuth } from '../context/AuthContext'
import '../styles/LoginPage.css'

const LoginPage = () => {
  const { isAuthenticated, login } = useAuth()
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})

  // If already logged in, this sends them to the protected page
  if (isAuthenticated) {
    return <Navigate to="/posts" replace />
  }

  const validate = () => {
    const newErrors = {}
    if (!username.trim()) {
      newErrors.username = 'Username is required'
    }
    if (!password.trim()) {
      newErrors.password = 'Password is required'
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    return newErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const validationErrors = validate()
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length === 0) {
      // “Successful” login
      login(username.trim())
      navigate('/posts')
    }
  }

  return (
    <div className="page-wrap">
      <Header />
      <main className="login-main">
        <section className="login-card kawaii">
          <h2>Login</h2>
          <p className="login-hint">
            Use any username and a password of at least 6 characters.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-control">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
              />
              {errors.username && (
                <p className="error">{errors.username}</p>
              )}
            </div>

            <div className="form-control">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              {errors.password && (
                <p className="error">{errors.password}</p>
              )}
            </div>

            <button type="submit" className="kawaii-btn login-btn">
              Log in
            </button>
          </form>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default LoginPage
