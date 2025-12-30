import axios from 'axios';
import authService from './authService';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/blogs';

class BlogService {
  // Get authorization headers
  getAuthHeaders() {
    const token = authService.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
  // Get all blogs with optional filters
  async getAllBlogs(params = {}) {
    try {
      const response = await axios.get(API_URL, { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get blog by ID
  async getBlogById(id) {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get blog by slug
  async getBlogBySlug(slug) {
    try {
      const response = await axios.get(`${API_URL}/slug/${slug}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Create new blog
  async createBlog(blogData) {
    try {
      const formData = new FormData();

      Object.keys(blogData).forEach(key => {
        if (blogData[key] !== null && blogData[key] !== undefined && blogData[key] !== '') {
          if (key === 'image' && blogData[key] instanceof File) {
            formData.append('image', blogData[key]);
          } else {
            formData.append(key, blogData[key]);
          }
        }
      });

      const response = await axios.post(API_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...this.getAuthHeaders()
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Update blog
  async updateBlog(id, blogData) {
    try {
      const formData = new FormData();

      Object.keys(blogData).forEach(key => {
        if (blogData[key] !== null && blogData[key] !== undefined && blogData[key] !== '') {
          if (key === 'image' && blogData[key] instanceof File) {
            formData.append('image', blogData[key]);
          } else {
            formData.append(key, blogData[key]);
          }
        }
      });

      const response = await axios.put(`${API_URL}/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...this.getAuthHeaders()
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Delete blog
  async deleteBlog(id) {
    try {
      const response = await axios.delete(`${API_URL}/${id}`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Error handler
  handleError(error) {
    if (error.response) {
      return {
        message: error.response.data.message || 'An error occurred',
        errors: error.response.data.errors || [],
        status: error.response.status
      };
    } else if (error.request) {
      return {
        message: 'No response from server. Please check your connection.',
        status: 0
      };
    } else {
      return {
        message: error.message || 'An unexpected error occurred',
        status: 0
      };
    }
  }
}

const blogService = new BlogService();
export default blogService;
