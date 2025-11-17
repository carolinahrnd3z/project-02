import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../layouts/Header'
import Footer from '../layouts/Footer'
import { posts as localPosts } from '../data/posts'
import '../styles/BlogPost.css'
import '../styles/BlogPage.css'

const truncate = (text = '', n = 160) =>
  text.length > n ? text.slice(0, n) + '…' : text

const BlogPostsPage = () => {
  const [posts, setPosts] = useState(localPosts)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true)
        setError(null)

        const res = await fetch('https://jsonplaceholder.typicode.com/posts')
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()

        // normalize like your other pages
        const normalized = data.map((p) => ({
          id: p.id,
          title: p.title,
          author: `User ${p.userId}`,
          date: new Date(2023, p.id % 12, (p.id % 28) + 1).toLocaleDateString(),
          content: p.body,
        }))

        setPosts(normalized)
      } catch (err) {
        // real error → show message + keep local posts
        setError(err?.message || 'Failed to fetch posts')
        setPosts(localPosts)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  return (
    <div className="blog-page">
      <Header />
      <main className="main-content">
        <h2 style={{ marginBottom: '1rem' }}>All Blog Posts</h2>

        {loading && <p>Loading posts…</p>}

        {error && (
          <p style={{ color: 'crimson', marginBottom: '0.75rem' }}>
            Error fetching posts: {error}. Showing local posts instead.
          </p>
        )}

        <ul style={{ listStyle: 'none', padding: 0 }}>
          {posts.map((p) => (
            <li key={p.id} className="post-card">
              <h3 className="post-title">
                <Link to={`/posts/${p.id}`}>{p.title}</Link>
              </h3>
              <div className="post-meta">
                {p.author} • {p.date}
              </div>
              <p style={{ whiteSpace: 'pre-wrap', marginBottom: '.5rem' }}>
                {truncate((p.content || '').replace(/\n/g, ' '), 220)}
              </p>
              <Link to={`/posts/${p.id}`}>Read more →</Link>
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </div>
  )
}

export default BlogPostsPage
