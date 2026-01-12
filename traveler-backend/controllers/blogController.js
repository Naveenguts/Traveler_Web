const Blog = require('../models/Blog');

// Create a new blog
exports.createBlog = async (req, res) => {
  try {
    const { title, description, content, image, category, tags } = req.body;

    // Validate required fields
    if (!title || !description || !content || !image) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Get author info from authenticated user
    const authorId = req.user.id;
    const authorName = req.user.name || 'Anonymous';

    // Create blog
    const blog = new Blog({
      title,
      description,
      content,
      image,
      category: category || 'Travel',
      author: {
        userId: authorId,
        name: authorName
      },
      tags: tags || [],
      status: 'published'
    });

    await blog.save();

    res.status(201).json({
      success: true,
      message: 'Blog published successfully',
      blog
    });
  } catch (error) {
    console.error('Create blog error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating blog'
    });
  }
};

// Get all blogs with pagination and filtering
exports.getAllBlogs = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      author, 
      search,
      sort = '-createdAt' 
    } = req.query;

    const query = { status: 'published' };

    // Filter by category
    if (category && category !== 'all') {
      query.category = category;
    }

    // Filter by author
    if (author) {
      query['author.userId'] = author;
    }

    // Search in title, description, and content
    if (search) {
      query.$text = { $search: search };
    }

    const blogs = await Blog.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-__v');

    const count = await Blog.countDocuments(query);

    res.json({
      success: true,
      blogs,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalBlogs: count
    });
  } catch (error) {
    console.error('Get blogs error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching blogs'
    });
  }
};

// Get a single blog by ID
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    // Increment views
    blog.views += 1;
    await blog.save();

    res.json({
      success: true,
      blog
    });
  } catch (error) {
    console.error('Get blog error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching blog'
    });
  }
};

// Update a blog
exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    // Check if user is the author
    if (blog.author.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this blog'
      });
    }

    const { title, description, content, image, category, tags, status } = req.body;

    if (title) blog.title = title;
    if (description) blog.description = description;
    if (content) blog.content = content;
    if (image) blog.image = image;
    if (category) blog.category = category;
    if (tags) blog.tags = tags;
    if (status) blog.status = status;

    await blog.save();

    res.json({
      success: true,
      message: 'Blog updated successfully',
      blog
    });
  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating blog'
    });
  }
};

// Delete a blog
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    // Check if user is the author
    if (blog.author.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this blog'
      });
    }

    await blog.deleteOne();

    res.json({
      success: true,
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting blog'
    });
  }
};

// Like/unlike a blog
exports.toggleLike = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    const userId = req.user.id;
    const likedIndex = blog.likedBy.indexOf(userId);

    if (likedIndex > -1) {
      // Unlike
      blog.likedBy.splice(likedIndex, 1);
      blog.likes = blog.likedBy.length;
    } else {
      // Like
      blog.likedBy.push(userId);
      blog.likes = blog.likedBy.length;
    }

    await blog.save();

    res.json({
      success: true,
      message: likedIndex > -1 ? 'Blog unliked' : 'Blog liked',
      likes: blog.likes,
      liked: likedIndex === -1
    });
  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error toggling like'
    });
  }
};

// Add a comment to a blog
exports.addComment = async (req, res) => {
  try {
    const { comment } = req.body;

    if (!comment || !comment.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Comment cannot be empty'
      });
    }

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    blog.comments.push({
      userId: req.user.id,
      userName: req.user.name || 'Anonymous',
      comment: comment.trim()
    });

    await blog.save();

    res.json({
      success: true,
      message: 'Comment added successfully',
      comments: blog.comments
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error adding comment'
    });
  }
};

// Get blogs by current user
exports.getMyBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const blogs = await Blog.find({ 'author.userId': req.user.id })
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Blog.countDocuments({ 'author.userId': req.user.id });

    res.json({
      success: true,
      blogs,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalBlogs: count
    });
  } catch (error) {
    console.error('Get my blogs error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching your blogs'
    });
  }
};
