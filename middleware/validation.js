const { body } = require('express-validator');

// Validation rules for creating a blog post
const blogPostValidation = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 255 })
    .withMessage('Title cannot exceed 255 characters')
    .trim(),

  body('content')
    .notEmpty()
    .withMessage('Content is required')
    .custom((value) => {
      try {
        // Try to parse as JSON (Delta format)
        const parsed = JSON.parse(value);
        // Check if it has the ops array (Delta structure)
        if (!parsed.ops || !Array.isArray(parsed.ops)) {
          throw new Error('Invalid Delta format');
        }
        return true;
      } catch (error) {
        throw new Error('Content must be valid Delta JSON format');
      }
    }),

  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters')
    .trim(),

  body('author')
    .notEmpty()
    .withMessage('Author is required')
    .trim(),

  body('tag')
    .optional()
    .isIn([
      'appliance care',
      'flooring care',
      'home painting',
      'bathroom remodeling',
      'kitchen remodeling'
    ])
    .withMessage('Invalid tag value'),

  body('keyTakeaways')
    .optional()
    .trim(),

  body('estimatedDuration')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Estimated duration must be at least 1 minute')
];

// Validation rules for updating a blog post (all fields optional)
const updateBlogPostValidation = [
  body('title')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Title cannot exceed 255 characters')
    .trim(),

  body('content')
    .optional()
    .custom((value) => {
      if (value) {
        try {
          const parsed = JSON.parse(value);
          if (!parsed.ops || !Array.isArray(parsed.ops)) {
            throw new Error('Invalid Delta format');
          }
        } catch (error) {
          throw new Error('Content must be valid Delta JSON format');
        }
      }
      return true;
    }),

  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters')
    .trim(),

  body('author')
    .optional()
    .trim(),

  body('tag')
    .optional()
    .isIn([
      'appliance care',
      'flooring care',
      'home painting',
      'bathroom remodeling',
      'kitchen remodeling'
    ])
    .withMessage('Invalid tag value'),

  body('keyTakeaways')
    .optional()
    .trim(),

  body('estimatedDuration')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Estimated duration must be at least 1 minute')
];

module.exports = {
  blogPostValidation,
  updateBlogPostValidation
};
