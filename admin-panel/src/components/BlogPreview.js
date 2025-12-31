import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';
import blogService from '../services/blogService';
import '../styles/BlogPreview.css';

const BlogPreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBlog = useCallback(async () => {
    try {
      setLoading(true);
      const response = await blogService.getBlogById(id);
      setBlog(response.data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch blog');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBlog();
  }, [fetchBlog]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const convertDeltaToHtml = (deltaContent) => {
    try {
      // Parse content if it's a string
      const delta = typeof deltaContent === 'string' ? JSON.parse(deltaContent) : deltaContent;

      // Convert Delta to HTML
      const converter = new QuillDeltaToHtmlConverter(delta.ops, {});
      return converter.convert();
    } catch (err) {
      console.error('Error converting Delta to HTML:', err);
      return '<p>Error rendering content</p>';
    }
  };

  if (loading) {
    return <div className="loading">Loading blog preview...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">{error}</div>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          Back to List
        </button>
      </div>
    );
  }

  if (!blog) {
    return <div className="loading">Blog not found</div>;
  }

  return (
    <div className="blog-preview-container">
      <div className="preview-header">
        <button className="btn btn-secondary" onClick={() => navigate('/')}>
          Back to List
        </button>
        <button className="btn btn-primary" onClick={() => navigate(`/edit/${blog._id}`)}>
          Edit Blog
        </button>
      </div>

      <article className="blog-article">
        {blog.image && (
          <div className="article-hero-image">
            <img src={blog.image} alt={blog.title} />
          </div>
        )}

        <header className="article-header">
          {blog.tag && <span className="article-tag">{blog.tag}</span>}
          <h1 className="article-title">{blog.title}</h1>

          <div className="article-meta">
            <span className="author">By {blog.author}</span>
            <span className="separator">•</span>
            <span className="date">{formatDate(blog.createdAt)}</span>
            {blog.estimatedDuration && (
              <>
                <span className="separator">•</span>
                <span className="duration">{blog.estimatedDuration} min read</span>
              </>
            )}
          </div>

          <p className="article-description">{blog.description}</p>
        </header>

        {blog.keyTakeaways && (
          <aside className="key-takeaways">
            <h3>Key Takeaways</h3>
            <div className="takeaways-content">
              {blog.keyTakeaways}
            </div>
          </aside>
        )}

        <div
          className="article-content"
          dangerouslySetInnerHTML={{ __html: convertDeltaToHtml(blog.content) }}
        />

        <footer className="article-footer">
          <div className="footer-meta">
            <p><strong>Published:</strong> {formatDate(blog.createdAt)}</p>
            {blog.updatedAt !== blog.createdAt && (
              <p><strong>Last Updated:</strong> {formatDate(blog.updatedAt)}</p>
            )}
          </div>
        </footer>
      </article>
    </div>
  );
};

export default BlogPreview;
