import { useState } from 'react'
import Header from '../layouts/Header'
import Footer from '../layouts/Footer'

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setStatus('Thanks! Fret not, nothing was sent.')
  }

  return (
    <div className="blog-page">
      <Header />
      <main className="main-content">
        <h2>Contact</h2>
        <p>Hello Sanderson Fan! Go ahead and write us a message!</p>

        <form onSubmit={handleSubmit} style={{ maxWidth: 520 }}>
          <div style={{ marginBottom: '.75rem' }}>
            <label htmlFor="name">Name</label>
            <br />
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '.5rem' }}
            />
          </div>
          <div style={{ marginBottom: '.75rem' }}>
            <label htmlFor="email">Email</label>
            <br />
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '.5rem' }}
            />
          </div>
          <div style={{ marginBottom: '.75rem' }}>
            <label htmlFor="message">Message</label>
            <br />
            <textarea
              id="message"
              name="message"
              rows="5"
              value={form.message}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '.5rem' }}
            />
          </div>
          <button type="submit">Send</button>
        </form>

        {status && <p style={{ marginTop: '1rem' }}>{status}</p>}
      </main>
      <Footer />
    </div>
  )
}

export default ContactPage
