import { useState } from "react";

export default function Comments({ initialComments = [] }) {
  const [comments, setComments] = useState(initialComments);
  const [name, setName] = useState("");
  const [text, setText] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;
    setComments(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        author: name.trim(),
        text: text.trim(),
        date: new Date().toISOString().slice(0, 10),
      },
    ]);
    setName("");
    setText("");
  }

  return (
    <section className="mt-8">
      <h3 className="text-lg font-semibold mb-2">Comments</h3>

      {/* Comment box + Submit button */}
      <form onSubmit={handleSubmit} className="grid gap-2 max-w-md">
        <input
          className="border rounded p-2"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <br/>
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
