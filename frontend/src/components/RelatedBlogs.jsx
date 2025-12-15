import React from 'react';
import BlogCard from './BlogCard';
import '../styles/RelatedBlogs.css';

const RelatedBlogs = ({ currentBlogId, allBlogs }) => {
  // Get 3 related blogs (excluding current blog)
  const relatedBlogs = allBlogs
    .filter(blog => blog.id !== currentBlogId)
    .slice(0, 3);

  if (relatedBlogs.length === 0) return null;

  return (
    <div className="related-blogs">
      <div className="related-blogs-header">
        <h3>Related Blogs</h3>
        <div className="header-underline"></div>
      </div>
      <div className="related-blogs-grid">
        {relatedBlogs.map(blog => (
          <BlogCard
            key={blog.id}
            id={blog.id}
            title={blog.title}
            description={blog.description}
            date={blog.date}
            author={blog.author}
            image={blog.image}
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedBlogs;
