const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const { blogPostValidation, updateBlogPostValidation } = require('../middleware/validation');
const upload = require('../middleware/upload');
const { protect } = require('../middleware/auth');

// Get all blog posts (with filtering and pagination) - PUBLIC
router.get('/', blogController.getAllBlogPosts);

// Get a single blog post by slug - PUBLIC
router.get('/slug/:slug', blogController.getBlogPostBySlug);

// Get a single blog post by ID - PUBLIC
router.get('/:id', blogController.getBlogPostById);

// Create a new blog post - PROTECTED
router.post('/', protect, upload.single('image'), blogPostValidation, blogController.createBlogPost);

// Update a blog post - PROTECTED
router.put('/:id', protect, upload.single('image'), updateBlogPostValidation, blogController.updateBlogPost);

// Delete a blog post - PROTECTED
router.delete('/:id', protect, blogController.deleteBlogPost);

module.exports = router;
