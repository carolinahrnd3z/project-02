import { useState } from 'react'
import { posts } from '../../data/posts'
import '../../styles/BlogPost.css'

/**
 * BlogPost component displays a single blog post with:
 * - Post title, content, author, and date
 * - Like button functionality
 * - Comments section with a form to add new comments
 * - List of existing comments
 */

const BlogPost = () => {
  // State for managing likes and comments
  const [index, setIndex] = useState(0)
  const [likes, setLikes] = useState(0)
  const [comment, setComment] = useState('')
  // Get the first post from our static data
  const post = posts[index]
  const [comments, setComments] = useState(post.comments || [])

  // Handler for the like button
  const handleLike = () => setLikes(prev => prev + 1)

  // Handler for submitting new comments
  const handleCommentSubmit = (e) => {
    e.preventDefault()
    if (!comment.trim()) return
    const newComment = { id: Date.now(), author: 'You', text: comment, date: new Date().toISOString().slice(0,10) }
    setComments(prev => [newComment, ...prev])
    setComment('')
  }

  const nextPost = () => {
    const next = (index + 1) % posts.length
    setIndex(next)
    setLikes(0)
    setComments(posts[next].comments || [])
  }

  return (
    <article className="post-card">
      {/* Post header with title and metadata */}
      <h2 className="post-title">{post.title}</h2>
      <div className="post-meta">
        <span className="author">By {post.author}</span> · <span className="date">{post.date}</span>
      </div>

      {/* Post content */}
      <div className="post-content" dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g,'<br/>') }} />

      {/* Like button section */}
      <div className="controls">
        <button className="kawaii-btn" onClick={handleLike}>
          <span className={`heart-icon ${likes > 0 ? 'liked' : ''}`}>
            {likes > 0 ? '♥' : '♡'}
          </span>
          Like <span className="like-count">({likes})</span>
        </button>
        <button className="kawaii-btn" onClick={nextPost}>➜ Next rec</button>
      </div>

      {/* Comments section */}
      <form className="comment-form" onSubmit={handleCommentSubmit}>
        <input
          className="comment-input"
          type="text"
          placeholder="Leave a cute comment… ✍️"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button className="kawaii-btn" type="submit">Post</button>
      </form>

      {/* List of comments */}
      <div className="comment-list">
        {comments.map((c) => (
          <div className="comment" key={c.id}>
            <div className="comment-header">
              <span className="comment-author">{c.author}</span>
              <span className="comment-date">{c.date}</span>
            </div>
            <p className="comment-text">{c.text}</p>
          </div>
        ))}
      </div>
    </article>
  )
}

export default BlogPost

