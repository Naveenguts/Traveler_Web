import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/WriteBlog.css';

const WriteBlog = () => {
  const navigate = useNavigate();
  const { user, pushAlert } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    image: '',
    category: 'Travel'
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Blog title is required';
    } else if (formData.title.length < 10) {
      newErrors.title = 'Blog title should be at least 10 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Blog description is required';
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description should be at least 20 characters';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Blog content is required';
    } else if (formData.content.length < 100) {
      newErrors.content = 'Content should be at least 100 characters';
    }

    if (!formData.image) {
      newErrors.image = 'Cover image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      pushAlert('Please fill all fields correctly');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create blog object
      const newBlog = {
        id: Date.now(),
        title: formData.title,
        description: formData.description,
        content: formData.content,
        image: formData.image,
        category: formData.category,
        author: user?.name || 'Anonymous',
        date: new Date().toISOString(),
        views: 0,
        likes: 0
      };

      // Here you would typically send the blog data to your backend
      console.log('New blog created:', newBlog);

      pushAlert('Blog published successfully! 🎉');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        content: '',
        image: '',
        category: 'Travel'
      });

      // Redirect to blogs page after 2 seconds
      setTimeout(() => {
        navigate('/blogs');
      }, 2000);
    } catch (error) {
      pushAlert('Error publishing blog. Please try again.');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="write-blog-page">
      <div className="write-blog-container">
        <div className="write-blog-header">
          <h1>Write Your Story</h1>
          <p>Share your travel experiences and insights with the world</p>
        </div>

        <form onSubmit={handleSubmit} className="write-blog-form">
          {/* Blog Title */}
          <div className="form-group">
            <label htmlFor="title">Blog Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter an engaging title for your blog"
              className={errors.title ? 'error' : ''}
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
            <p className="char-count">{formData.title.length} / 100</p>
          </div>

          {/* Blog Description */}
          <div className="form-group">
            <label htmlFor="description">Short Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Write a short description (2-3 sentences) that summarizes your blog"
              rows="2"
              className={errors.description ? 'error' : ''}
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
            <p className="char-count">{formData.description.length} / 300</p>
          </div>

          {/* Category */}
          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option>Travel</option>
              <option>Adventure</option>
              <option>Budget Travel</option>
              <option>Cultural</option>
              <option>Beach & Resort</option>
              <option>Mountain</option>
              <option>Food & Cuisine</option>
              <option>Photography</option>
              <option>Tips & Tricks</option>
              <option>Other</option>
            </select>
          </div>

          {/* Cover Image */}
          <div className="form-group">
            <label htmlFor="image">Cover Image *</label>
            <div className="image-upload-area">
              {formData.image ? (
                <div className="image-preview">
                  <img src={formData.image} alt="Preview" />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                    className="remove-image"
                  >
                    Remove Image
                  </button>
                </div>
              ) : (
                <label htmlFor="file-input" className="upload-label">
                  <div className="upload-icon">📷</div>
                  <p>Click to upload or drag and drop</p>
                  <span className="upload-hint">PNG, JPG, GIF up to 10MB</span>
                </label>
              )}
              <input
                type="file"
                id="file-input"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
            </div>
            {errors.image && <span className="error-message">{errors.image}</span>}
          </div>

          {/* Blog Content */}
          <div className="form-group">
            <label htmlFor="content">Blog Content *</label>
            <div className="content-editor">
              <div className="editor-toolbar">
                <button type="button" title="Bold" className="format-btn">
                  <strong>B</strong>
                </button>
                <button type="button" title="Italic" className="format-btn">
                  <em>I</em>
                </button>
                <button type="button" title="Underline" className="format-btn">
                  <u>U</u>
                </button>
                <div className="toolbar-divider"></div>
                <button type="button" title="Bullet List" className="format-btn">
                  •••
                </button>
                <button type="button" title="Numbered List" className="format-btn">
                  123
                </button>
              </div>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Write your blog content here. Share your experiences, tips, and insights..."
                rows="12"
                className={errors.content ? 'error' : ''}
              />
            </div>
            {errors.content && <span className="error-message">{errors.content}</span>}
            <p className="char-count">{formData.content.length} characters</p>
          </div>

          {/* Submit Buttons */}
          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/blogs')}
              className="btn btn-secondary"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Publishing...' : 'Publish Blog'}
            </button>
          </div>
        </form>

        {/* Tips Section */}
        <div className="writing-tips">
          <h3>📝 Writing Tips</h3>
          <ul>
            <li>Be specific and detailed in your descriptions</li>
            <li>Use clear, engaging language</li>
            <li>Include practical tips and advice</li>
            <li>Break up content with subheadings</li>
            <li>Add personal stories and experiences</li>
            <li>Proofread before publishing</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WriteBlog;
