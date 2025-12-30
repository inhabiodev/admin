const BlogPost = require('../models/BlogPost');
const { validationResult } = require('express-validator');
const slugify = require('slugify');

// Create a new blog post
exports.createBlogPost = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const blogData = {
      title: req.body.title,
      content: req.body.content, // Store as Delta JSON string
      description: req.body.description,
      author: req.body.author,
      tag: req.body.tag,
      keyTakeaways: req.body.keyTakeaways,
      estimatedDuration: req.body.estimatedDuration
    };

    // Handle image upload if present
    if (req.file) {
      blogData.image = req.file.path;
    }

    const blogPost = new BlogPost(blogData);
    const savedPost = await blogPost.save();

    res.status(201).json({
      success: true,
      data: savedPost
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A blog post with this slug already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error creating blog post',
      error: error.message
    });
  }
};

// Get all blog posts with filtering and pagination
exports.getAllBlogPosts = async (req, res) => {
  try {
    const { tag, page = 1, limit = 10, sort = '-createdAt' } = req.query;

    const query = {};
    if (tag) {
      query.tag = tag;
    }

    const skip = (page - 1) * limit;

    const blogPosts = await BlogPost.find(query)
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip);

    const total = await BlogPost.countDocuments(query);

    res.status(200).json({
      success: true,
      count: blogPosts.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: blogPosts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching blog posts',
      error: error.message
    });
  }
};

// Get a single blog post by slug
exports.getBlogPostBySlug = async (req, res) => {
  try {
    const blogPost = await BlogPost.findOne({ slug: req.params.slug });

    if (!blogPost) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    res.status(200).json({
      success: true,
      data: blogPost
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching blog post',
      error: error.message
    });
  }
};

// Get a single blog post by ID
exports.getBlogPostById = async (req, res) => {
  try {
    const blogPost = await BlogPost.findById(req.params.id);

    if (!blogPost) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    res.status(200).json({
      success: true,
      data: blogPost
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching blog post',
      error: error.message
    });
  }
};

// Update a blog post
exports.updateBlogPost = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updateData = {
      title: req.body.title,
      content: req.body.content, // Store as Delta JSON string
      description: req.body.description,
      author: req.body.author,
      tag: req.body.tag,
      keyTakeaways: req.body.keyTakeaways,
      estimatedDuration: req.body.estimatedDuration
    };

    // Regenerate slug if title is being updated
    if (req.body.title) {
      updateData.slug = slugify(req.body.title, {
        lower: true,
        strict: true,
        remove: /[*+~.()'"!:@]/g
      });
    }

    // Handle image upload if present
    if (req.file) {
      updateData.image = req.file.path;
    }

    const blogPost = await BlogPost.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!blogPost) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    res.status(200).json({
      success: true,
      data: blogPost
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating blog post',
      error: error.message
    });
  }
};

// Delete a blog post
exports.deleteBlogPost = async (req, res) => {
  try {
    const blogPost = await BlogPost.findByIdAndDelete(req.params.id);

    if (!blogPost) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Blog post deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting blog post',
      error: error.message
    });
  }
};
