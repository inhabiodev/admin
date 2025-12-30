import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import blogService from '../services/blogService';
import '../styles/BlogList.css';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const tags = [
    'appliance care',
    'flooring care',
    'home painting',
    'bathroom remodeling',
    'kitchen remodeling'
  ];

  const fetchBlogs = React.useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10
      };
      if (filter) {
        params.tag = filter;
      }

      const response = await blogService.getAllBlogs(params);
      setBlogs(response.data);
      setTotalPages(response.pages);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  }, [filter, currentPage]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await blogService.deleteBlog(id);
        fetchBlogs();
      } catch (err) {
        alert('Failed to delete blog: ' + err.message);
      }
    }
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (loading) {
    return <div className="loading">Loading blogs...</div>;
  }

  return (
    <div className="blog-list-container">
      <div className="blog-list-header">
        <h1>Blog Posts</h1>
        <button className="btn btn-primary" onClick={() => navigate('/create')}>
          Create New Blog
        </button>
      </div>

      <div className="filters">
        <label>Filter by tag:</label>
        <select value={filter} onChange={(e) => { setFilter(e.target.value); setCurrentPage(1); }}>
          <option value="">All Tags</option>
          {tags.map(tag => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>
      </div>

      {error && <div className="error-message">{error}</div>}

      {blogs.length === 0 ? (
        <div className="no-blogs">No blog posts found.</div>
      ) : (
        <>
          <div className="blog-grid">
            {blogs.map(blog => (
              <div key={blog._id} className="blog-card">
                {blog.image && (
                  <div className="blog-image">
                    <img src={`http://localhost:5000/${blog.image}`} alt={blog.title} />
                  </div>
                )}
                <div className="blog-content">
                  <h2>{blog.title}</h2>
                  {blog.tag && <span className="tag">{blog.tag}</span>}
                  <p className="description">{truncateText(blog.description, 150)}</p>
                  <div className="blog-meta">
                    <span className="author">By {blog.author}</span>
                    {blog.estimatedDuration && (
                      <span className="duration">{blog.estimatedDuration} min read</span>
                    )}
                  </div>
                  <div className="blog-actions">
                    <button
                      className="btn btn-secondary"
                      onClick={() => navigate(`/preview/${blog._id}`)}
                    >
                      Preview
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={() => navigate(`/edit/${blog._id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(blog._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="btn"
              >
                Previous
              </button>
              <span>Page {currentPage} of {totalPages}</span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="btn"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BlogList;
