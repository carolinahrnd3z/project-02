import { useState, useEffect } from "react";
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Comments({ initialComments = [] }) {
  const { user, isAuthenticated } = useAuth()

  const [comments, setComments] = useState(initialComments);
  const [name, setName] = useState(user?.username || "");
  const [text, setText] = useState("");

  // keep name in sync if auth state changes (e.g. after login)
  useEffect(() => {
    if (isAuthenticated) setName(user?.username || "")
  }, [isAuthenticated, user])

  function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    setComments(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        author: isAuthenticated ? (user?.username || 'Anonymous') : name.trim(),
        text: text.trim(),
        date: new Date().toISOString().slice(0, 10),
      },
    ]);
    // only clear the name input for anonymous commenters; keep the authenticated
    // username value in sync when logged in
    if (!isAuthenticated) setName("");
    setText("");
  }

  return (
    <section className="mt-8">
      <h3 className="text-lg font-semibold mb-2">Comments</h3>

      {/* Comment box + Submit button (only visible to logged-in users) */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="grid gap-2 max-w-md">
          <div className="text-sm text-gray-700">Commenting as <strong>{user?.username}</strong></div>
          <textarea
            className="border rounded p-2"
            rows={10}
            placeholder="Write a comment..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <br/>
          <button className="border rounded p-2">Submit</button>
        </form>
      ) : (
        <div className="max-w-md text-sm text-gray-600">
          <p>You must be logged in to post a comment. <Link to="/login" className="text-blue-600 underline">Log in</Link> to participate.</p>
        </div>
      )}

      {/* Static comments list shown below the box */}
      {comments.length === 0 ? (
        <p className="text-sm text-gray-600 mt-3">No comments yet.</p>
      ) : (
        <ul className="mt-4 grid gap-3">
          {comments.map((c) => (
            <li key={c.id} className="border rounded p-3">
              <p className="font-medium">
                {c.author}{" "}
                <span className="text-xs text-gray-500">• {c.date}</span>
              </p>
              <p>{c.text}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
