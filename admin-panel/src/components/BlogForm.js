import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import blogService from '../services/blogService';
import '../styles/BlogForm.css';

const BlogForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const quillRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    content: null,
    description: '',
    author: '',
    tag: '',
    keyTakeaways: '',
    estimatedDuration: ''
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});

  const tags = [
    'appliance care',
    'flooring care',
    'home painting',
    'bathroom remodeling',
    'kitchen remodeling'
  ];

  const fetchBlog = React.useCallback(async () => {
    try {
      setLoading(true);
      const response = await blogService.getBlogById(id);
      const blog = response.data;

      setFormData({
        title: blog.title || '',
        content: blog.content ? JSON.parse(blog.content) : '',
        description: blog.description || '',
        author: blog.author || '',
        tag: blog.tag || '',
        keyTakeaways: blog.keyTakeaways || '',
        estimatedDuration: blog.estimatedDuration || ''
      });

      if (blog.image) {
        setImagePreview(blog.image);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch blog');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (isEditMode) {
      fetchBlog();
    }
  }, [isEditMode, fetchBlog]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleContentChange = (_value, _delta, _source, editor) => {
    // Store the Delta format content
    const deltaContent = editor.getContents();
    setFormData(prev => ({
      ...prev,
      content: deltaContent
    }));
    if (errors.content) {
      setErrors(prev => ({ ...prev, content: null }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          // Create canvas to resize image
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          // Set target dimensions
          canvas.width = 780;
          canvas.height = 500;

          // Draw and resize image
          ctx.drawImage(img, 0, 0, 780, 500);

          // Convert canvas to blob
          canvas.toBlob((blob) => {
            // Create a new file from the blob
            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            });

            setImage(resizedFile);
            setImagePreview(canvas.toDataURL(file.type));
          }, file.type, 0.95); // 0.95 quality for JPEG
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 255) {
      newErrors.title = 'Title cannot exceed 255 characters';
    }

    // Validate Delta content - check if it's empty
    if (!formData.content || !formData.content.ops || formData.content.ops.length === 0 ||
        (formData.content.ops.length === 1 && formData.content.ops[0].insert === '\n')) {
      newErrors.content = 'Content is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length > 500) {
      newErrors.description = 'Description cannot exceed 500 characters';
    }

    if (!formData.author.trim()) {
      newErrors.author = 'Author is required';
    }

    if (formData.estimatedDuration && formData.estimatedDuration < 1) {
      newErrors.estimatedDuration = 'Duration must be at least 1 minute';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const submitData = {
        ...formData,
        // Convert Delta to JSON string for transmission
        content: JSON.stringify(formData.content)
      };
      if (image) {
        submitData.image = image;
      }

      if (isEditMode) {
        await blogService.updateBlog(id, submitData);
      } else {
        await blogService.createBlog(submitData);
      }

      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to save blog');
      if (err.errors && Array.isArray(err.errors)) {
        const fieldErrors = {};
        err.errors.forEach(error => {
          if (error.path) {
            fieldErrors[error.path] = error.msg;
          }
        });
        setErrors(fieldErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      ['link', 'image'],
      ['clean']
    ],
  };

  if (loading && isEditMode) {
    return <div className="loading">Loading blog...</div>;
  }

  return (
    <div className="blog-form-container">
      <div className="form-header">
        <h1>{isEditMode ? 'Edit Blog Post' : 'Create New Blog Post'}</h1>
        <button className="btn btn-secondary" onClick={() => navigate('/')}>
          Back to List
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="blog-form">
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={errors.title ? 'error' : ''}
            maxLength="255"
          />
          {errors.title && <span className="field-error">{errors.title}</span>}
          <small>{formData.title.length}/255 characters</small>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className={errors.description ? 'error' : ''}
            maxLength="500"
          />
          {errors.description && <span className="field-error">{errors.description}</span>}
          <small>{formData.description.length}/500 characters</small>
        </div>

        <div className="form-group">
          <label htmlFor="content">Content *</label>
          <ReactQuill
            ref={quillRef}
            theme="snow"
            value={formData.content}
            onChange={handleContentChange}
            modules={modules}
            className={errors.content ? 'error' : ''}
          />
          {errors.content && <span className="field-error">{errors.content}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="author">Author *</label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            className={errors.author ? 'error' : ''}
          />
          {errors.author && <span className="field-error">{errors.author}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="tag">Tag</label>
            <select
              id="tag"
              name="tag"
              value={formData.tag}
              onChange={handleChange}
            >
              <option value="">Select a tag</option>
              {tags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="estimatedDuration">Estimated Duration (minutes)</label>
            <input
              type="number"
              id="estimatedDuration"
              name="estimatedDuration"
              value={formData.estimatedDuration}
              onChange={handleChange}
              min="1"
              className={errors.estimatedDuration ? 'error' : ''}
            />
            {errors.estimatedDuration && <span className="field-error">{errors.estimatedDuration}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="keyTakeaways">Key Takeaways</label>
          <textarea
            id="keyTakeaways"
            name="keyTakeaways"
            value={formData.keyTakeaways}
            onChange={handleChange}
            rows="4"
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Featured Image</label>
          <input
            type="file"
            id="image"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            onChange={handleImageChange}
          />
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" />
            </div>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : (isEditMode ? 'Update Blog' : 'Create Blog')}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/')}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogForm;
