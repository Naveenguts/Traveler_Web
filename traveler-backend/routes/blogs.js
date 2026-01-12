const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const auth = require('../middleware/auth');

// Public routes
// GET /api/blogs - Get all blogs
router.get('/', blogController.getAllBlogs);

// GET /api/blogs/:id - Get single blog
router.get('/:id', blogController.getBlogById);

// Protected routes (require authentication)
// POST /api/blogs - Create a new blog
router.post('/', auth, blogController.createBlog);

// GET /api/blogs/my/all - Get current user's blogs
router.get('/my/all', auth, blogController.getMyBlogs);

// PUT /api/blogs/:id - Update a blog
router.put('/:id', auth, blogController.updateBlog);

// DELETE /api/blogs/:id - Delete a blog
router.delete('/:id', auth, blogController.deleteBlog);

// POST /api/blogs/:id/like - Like/unlike a blog
router.post('/:id/like', auth, blogController.toggleLike);

// POST /api/blogs/:id/comment - Add a comment
router.post('/:id/comment', auth, blogController.addComment);

module.exports = router;
