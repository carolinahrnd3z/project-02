import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import BlogPostsPage from './pages/BlogPostsPage'
import IndividualPostPage from './pages/IndividualPostPage'
import ContactPage from './pages/ContactPage'
import LoginPage from './pages/LoginPage'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import HomePage from './pages/HomePage'

// this is a wrapper component for protected routes
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public route */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Public blog routes (accessible without login) */}
            <Route path="/posts" element={<BlogPostsPage />} />
            <Route path="/posts/:id" element={<IndividualPostPage />} />

            {/* Protected route(s) */}
            <Route
              path="/contact"
              element={
                <PrivateRoute>
                  <ContactPage />
                </PrivateRoute>
              }
            />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
