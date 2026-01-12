const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Blog title is required'],
    trim: true,
    minlength: [10, 'Title should be at least 10 characters'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Blog description is required'],
    trim: true,
    minlength: [20, 'Description should be at least 20 characters'],
    maxlength: [300, 'Description cannot exceed 300 characters']
  },
  content: {
    type: String,
    required: [true, 'Blog content is required'],
    minlength: [100, 'Content should be at least 100 characters']
  },
  image: {
    type: String,
    required: [true, 'Cover image is required']
  },
  category: {
    type: String,
    required: true,
    enum: ['Travel', 'Adventure', 'Budget Travel', 'Cultural', 'Beach & Resort', 'Mountain', 'Food & Cuisine', 'Photography', 'Tips & Tricks', 'Other'],
    default: 'Travel'
  },
  author: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true
    }
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    userName: String,
    comment: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'published'
  },
  tags: [String],
  readTime: {
    type: Number, // in minutes
    default: 0
  }
}, {
  timestamps: true
});

// Calculate read time based on content length (average 200 words per minute)
blogSchema.pre('save', function(next) {
  const wordCount = this.content.split(/\s+/).length;
  this.readTime = Math.ceil(wordCount / 200);
  next();
});

// Index for search and filtering
blogSchema.index({ title: 'text', description: 'text', content: 'text' });
blogSchema.index({ category: 1, createdAt: -1 });
blogSchema.index({ 'author.userId': 1, createdAt: -1 });

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
