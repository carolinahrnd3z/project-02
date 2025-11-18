import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Header from '../layouts/Header'
import Footer from '../layouts/Footer'
import { posts as localPosts } from '../data/posts'
import '../styles/BlogPage.css'

// Inline helper component to render the comment form area and gate it by auth
function CommentFormArea({ posting, formError, commentName, setCommentName, commentBody, setCommentBody, handleCommentSubmit }) {
  const { isAuthenticated, user } = useAuth()

  // when user logs in, auto-fill the name field
  useEffect(() => {
    if (isAuthenticated && user?.username) {
      setCommentName(user.username)
    }
  }, [isAuthenticated, user, setCommentName])

  if (!isAuthenticated) {
    // anonymous users: prompt to log in instead of showing the form
    return (
      <div style={{ marginBottom: '1rem', maxWidth: '40rem' }}>
        <p style={{ marginBottom: '.5rem' }}>
          You must be logged in to post a comment. <Link to="/login">Log in</Link>
        </p>
      </div>
    )
  }

  // authenticated user: hide name input and show username label
  return (
    <form onSubmit={handleCommentSubmit} style={{ marginBottom: '1rem' }}>
      <div className="text-sm text-gray-700" style={{ marginBottom: '.5rem' }}>
        Commenting as <strong>{user?.username}</strong>
      </div>

      <div style={{ marginBottom: '.5rem' }}>
        <label style={{ display: 'block', fontSize: '.9rem', marginBottom: '.25rem' }} htmlFor="comment-body">Comment</label>
        <textarea
          id="comment-body"
          value={commentBody}
          onChange={(e) => setCommentBody(e.target.value)}
          style={{ width: '100%', padding: '.5rem', minHeight: '80px' }}
          placeholder="Write your comment here"
          disabled={posting}
        />
      </div>

      {formError && (
        <div role="alert" style={{ color: 'crimson', marginBottom: '.5rem' }}>{formError}</div>
      )}

      <button type="submit" disabled={posting} style={{ padding: '.5rem 1rem' }}>
        {posting ? 'Posting…' : 'Post comment'}
      </button>
    </form>
  )
}

const normalize = (p) => ({
  id: p.id,
  title: p.title,
  userId: p.userId,
  author: `User ${p.userId ?? '—'}`,
  date: new Date(2023, (p.id % 12), (p.id % 28) + 1).toLocaleDateString(),
  content: p.body,
})

const IndividualPostPage = () => {
  // support both /posts/:id and /posts/:postId routes
  const params = useParams()
  const postIdParam = params.postId ?? params.id
  const numericId = Number(postIdParam)

  const [post, setPost] = useState(
    localPosts.find((lp) => lp.id === numericId) || null
  )
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [userError, setUserError] = useState(null)
  const [comments, setComments] = useState([])
  const [commentsLoading, setCommentsLoading] = useState(false)
  const [commentsError, setCommentsError] = useState(null)
  const [commentName, setCommentName] = useState('')
  const [commentBody, setCommentBody] = useState('')
  const [posting, setPosting] = useState(false)
  const [formError, setFormError] = useState(null)
  const { isAuthenticated, user: authUser } = useAuth()

  useEffect(() => {
    const controller = new AbortController()

    async function fetchPostAndUser() {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch(
          `https://jsonplaceholder.typicode.com/posts/${numericId}`,
          { signal: controller.signal }
        )
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()

        const normalized = normalize(data)
        setPost(normalized)

        // fetch the user associated with the post
        try {
          setUserError(null)
          const ures = await fetch(
            `https://jsonplaceholder.typicode.com/users/${data.userId}`,
            { signal: controller.signal }
          )
          if (!ures.ok) throw new Error(`HTTP ${ures.status}`)
          const udata = await ures.json()
          setUser({
            id: udata.id,
            name: udata.name,
            username: udata.username,
            email: udata.email,
            phone: udata.phone,
            website: udata.website,
            company: udata.company?.name,
          })
        } catch (uErr) {
          // user fetch failed; show post but note the user error
          setUser(null)
          setUserError(uErr?.message || 'Failed to fetch user')
        }

        // fetch comments for the post
        try {
          setCommentsLoading(true)
          setCommentsError(null)
          const cres = await fetch(
            `https://jsonplaceholder.typicode.com/posts/${numericId}/comments`,
            { signal: controller.signal }
          )
          if (!cres.ok) throw new Error(`HTTP ${cres.status}`)
          const cdata = await cres.json()
          // normalize comments minimally
          setComments(
            cdata.map((c) => ({ id: c.id, name: c.name, email: c.email, body: c.body }))
          )
        } catch (cErr) {
          setComments([])
          setCommentsError(cErr?.message || 'Failed to fetch comments')
        } finally {
          setCommentsLoading(false)
        }
      } catch (err) {
        setError(err?.message || 'Failed to fetch post')
      } finally {
        setLoading(false)
      }
    }

    // numericId can be NaN if param missing; guard against that
    if (!Number.isNaN(numericId) && numericId > 0) {
      fetchPostAndUser()
    } else {
      setLoading(false)
      setError('Invalid post id')
    }
    return () => controller.abort()
  }, [numericId])

  // handle new comment submissions
  async function handleCommentSubmit(e) {
    e.preventDefault()
    setFormError(null)

    // simple validation: require name only for anonymous users
    if (!isAuthenticated && !commentName.trim()) {
      setFormError('Please enter your name')
      return
    }
    if (!commentBody.trim()) {
      setFormError('Please enter a comment')
      return
    }

    setPosting(true)
    try {
      const res = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${numericId}/comments`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            postId: numericId,
            name: isAuthenticated ? (authUser?.username || commentName.trim()) : commentName.trim(),
            body: commentBody.trim(),
          }),
        }
      )

      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const newComment = await res.json()

      // normalize and append the comment to the list (prepend so it's visible)
      const normalized = {
        id: newComment.id ?? Date.now(),
        name: newComment.name,
        email: newComment.email || '',
        body: newComment.body,
      }
      setComments((prev) => [normalized, ...prev])
  // clear name only for anonymous users; keep auth username populated
  if (!isAuthenticated) setCommentName('')
      setCommentBody('')
    } catch (err) {
      setFormError(err?.message || 'Failed to post comment')
    } finally {
      setPosting(false)
    }
  }

  return (
    <div className="blog-page">
      <Header />
      <main className="main-content">
        {loading && <p>Loading…</p>}

        {error && (
          <p role="alert" style={{ color: 'crimson' }}>
            Error fetching post: {error}. Showing any available local content.
          </p>
        )}

        {!loading && !post && (
          <>
            <p>Post not found.</p>
            <Link to="/posts">← Back to all posts</Link>
          </>
        )}

        {!loading && post && (
          <article className="blog-post">
            <header>
              <h1 style={{ marginBottom: '.5rem' }}>{post.title}</h1>
              <div style={{ fontSize: '.9rem', opacity: 0.8, marginBottom: '1rem' }}>
                <span>{post.author}</span> • <time>{post.date}</time>
              </div>
            </header>

            {/* Author details fetched from users API */}
            <div style={{ marginBottom: '1rem', padding: '.5rem', border: '1px solid #eee' }}>
              {user ? (
                <div style={{ fontSize: '.95rem' }}>
                  <strong>{user.name}</strong>
                  <div style={{ fontSize: '.9rem', opacity: 0.85 }}>{user.email}</div>
                </div>
              ) : (
                <div style={{ fontSize: '.9rem', opacity: 0.85 }}>
                  {userError ? (
                    <span style={{ color: 'crimson' }}>Failed to load author: {userError}</span>
                  ) : (
                    <span>Author information not available.</span>
                  )}
                </div>
              )}
            </div>

            <section className="content">
              <p style={{ whiteSpace: 'pre-wrap' }}>{post.content}</p>
            </section>

            {/* Comments section */}
            <section className="comments" style={{ marginTop: '1.5rem' }}>
                <h3 style={{ marginBottom: '.5rem' }}>Comments</h3>

                {/* comment form - only for authenticated users */}
                <CommentFormArea
                  posting={posting}
                  formError={formError}
                  commentName={commentName}
                  setCommentName={setCommentName}
                  commentBody={commentBody}
                  setCommentBody={setCommentBody}
                  handleCommentSubmit={handleCommentSubmit}
                />

                {commentsLoading && <p>Loading comments…</p>}

                {commentsError && (
                  <p role="alert" style={{ color: 'crimson' }}>
                    Error loading comments: {commentsError}
                  </p>
                )}

                {!commentsLoading && comments.length === 0 && (
                  <p>No comments yet. Be the first to comment!</p>
                )}

                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {comments.map((c) => (
                    <li key={c.id} style={{ marginBottom: '1rem', padding: '.5rem', border: '1px solid #f0f0f0' }}>
                      <div style={{ fontWeight: 600 }}>{c.name}</div>
                      {c.email && <div style={{ fontSize: '.9rem', color: '#555', marginBottom: '.25rem' }}>{c.email}</div>}
                      <div style={{ whiteSpace: 'pre-wrap' }}>{c.body}</div>
                    </li>
                  ))}
                </ul>

                <div style={{ marginTop: '1rem' }}>
                  <Link to="/posts">← Back to all posts</Link>
                </div>
            </section>
          </article>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default IndividualPostPage
