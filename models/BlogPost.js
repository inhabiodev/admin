const mongoose = require('mongoose');
const slugify = require('slugify');

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    maxLength: [255, 'Title cannot exceed 255 characters'],
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxLength: [500, 'Description cannot exceed 500 characters'],
    trim: true
  },
  tag: {
    type: String,
    enum: {
      values: [
        'appliance care',
        'flooring care',
        'home painting',
        'bathroom remodeling',
        'kitchen remodeling'
      ],
      message: '{VALUE} is not a valid tag'
    },
    required: false
  },
  image: {
    type: String,
    required: false
  },
  keyTakeaways: {
    type: String,
    required: false
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
    trim: true
  },
  estimatedDuration: {
    type: Number,
    required: false,
    min: [1, 'Estimated duration must be at least 1 minute']
  }
}, {
  timestamps: true
});

// Auto-generate slug from title before validation
blogPostSchema.pre('validate', function(next) {
  if (this.title && (!this.slug || this.isModified('title'))) {
    this.slug = slugify(this.title, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g
    });
  }
  next();
});

// Index for better query performance
blogPostSchema.index({ slug: 1 });
blogPostSchema.index({ tag: 1 });
blogPostSchema.index({ createdAt: -1 });

module.exports = mongoose.model('BlogPost', blogPostSchema);
