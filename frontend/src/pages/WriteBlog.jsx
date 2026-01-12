import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/WriteBlog.css';

const WriteBlog = () => {
  const navigate = useNavigate();
  const { user, pushAlert, token, apiUrl, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    image: '',
    category: 'Travel'
  });

  const [errors, setErrors] = useState({});

  // Check token validity on component mount
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setStatus('Please log in to write blogs.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
        return;
      }

      try {
        const res = await fetch(`${apiUrl}/auth/verify-token`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (res.status === 401) {
          const data = await res.json();
          setStatus(data?.message || 'Session expired. Please log in again.');
          setTimeout(() => {
            logout();
            navigate('/login', { state: { message: 'Session expired. Please log in again.' } });
          }, 2000);
        }
      } catch (error) {
        console.error('Token verification error:', error);
        // Don't logout on network errors, only on auth failures
      }
    };

    verifyToken();
  }, [token, apiUrl, logout, navigate]);

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

    if (!user?.id) {
      pushAlert('Please log in to publish blogs');
      navigate('/login');
      return;
    }

    setIsLoading(true);
    setStatus(''); // Clear previous status

    try {
      const apiUrl = import.meta?.env?.VITE_API_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('traveler_token');

      if (!token) {
        setStatus('Session expired. Please log in again.');
        setTimeout(() => {
          navigate('/login');
        }, 1500);
        return;
      }

      const response = await fetch(`${apiUrl}/blogs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          content: formData.content,
          image: formData.image,
          category: formData.category,
          tags: [] // You can add tags functionality later
        })
      });

      const data = await response.json();

      // Handle token expiration
      if (response.status === 401) {
        const errorMsg = data?.message || 'Session expired. Please log in again.';
        setStatus(errorMsg);
        setTimeout(() => {
          logout();
          navigate('/login', { state: { message: 'Session expired. Please log in again.' } });
        }, 1500);
        return;
      }

      if (!response.ok) {
        // Provide more specific error messages
        if (response.status === 413) {
          throw new Error('Image is too large. Please use a smaller image (under 5MB)');
        }
        throw new Error(data.message || 'Failed to publish blog');
      }

      pushAlert('Blog published successfully! 🎉');
      setStatus('success: Blog published successfully!');
      
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
      console.error('Error publishing blog:', error);
      const errorMessage = error.message || 'Error publishing blog. Please try again.';
      pushAlert(errorMessage);
      setStatus(errorMessage); // Also show in status message
      if (errorMessage.toLowerCase().includes('session expired')) {
        logout();
        navigate('/login', { state: { message: 'Session expired. Please log in again.' } });
      }
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
              <div className="editor-help-text">
                <small>💡 Tip: Press Enter twice to create a new paragraph. Use - at the start of a line for bullet points.</small>
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

          {/* Status Message */}
          {status && (
            <div className={`status-message ${status.includes('success') ? 'success' : 'error'}`}>
              {status}
            </div>
          )}
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
