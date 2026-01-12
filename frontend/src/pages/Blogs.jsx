import React, { useState, useEffect } from 'react';
import BlogCard from '../components/BlogCard';
import '../styles/Blogs.css';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBlogs, setFilteredBlogs] = useState([]);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const apiUrl = import.meta?.env?.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/blogs?limit=50`);
      const data = await response.json();

      if (data.success) {
        setBlogs(data.blogs);
        setFilteredBlogs(data.blogs);
      } else {
        setError('Failed to load blogs');
      }
    } catch (err) {
      console.error('Error fetching blogs:', err);
      setError('Error loading blogs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    const filtered = blogs.filter(blog =>
      blog.title.toLowerCase().includes(term.toLowerCase()) ||
      blog.description.toLowerCase().includes(term.toLowerCase()) ||
      blog.author.name.toLowerCase().includes(term.toLowerCase()) ||
      blog.category.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredBlogs(filtered);
  };

  if (loading) {
    return (
      <div className="blogs-page">
        <div className="loading-container">
          <p>Loading blogs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="blogs-page">
        <div className="error-container">
          <p>{error}</p>
          <button onClick={fetchBlogs} className="btn btn-primary">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="blogs-page">
      <div className="blogs-header">
        <h1>Travel Blog</h1>
        <p>Discover inspiring stories, travel tips, and adventures from around the world</p>
      </div>

      <div className="blogs-search">
        <input
          type="text"
          placeholder="Search blogs by title, author, or keywords..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
      </div>

      <div className="blogs-container">
        {filteredBlogs.length > 0 ? (
          <div className="blogs-grid">
            {filteredBlogs.map(blog => (
              <BlogCard
                key={blog._id}
                id={blog._id}
                title={blog.title}
                description={blog.description}
                date={new Date(blog.createdAt).toLocaleDateString()}
                author={blog.author.name}
                image={blog.image}
                category={blog.category}
                views={blog.views}
                likes={blog.likes}
              />
            ))}
          </div>
        ) : (
          <div className="no-results">
            <p>No blogs found matching your search. Try different keywords.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blogs;
