import Header from '../layouts/Header'
import Footer from '../layouts/Footer'
import BlogPost from '../features/blog/BlogPost'
import '../styles/BlogPage.css'

const BlogPage = () => {
  return (
    <div className="blog-page">
      <Header />
      <main className="main-content">
        <BlogPost />
      </main>
      <Footer />
    </div>
  )
}

export default BlogPage
