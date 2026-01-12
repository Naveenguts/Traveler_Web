import React from 'react';
import BlogCard from './BlogCard';
import '../styles/RelatedBlogs.css';

const RelatedBlogs = ({ currentBlogId, allBlogs }) => {
  const relatedBlogs = (allBlogs || [])
    .filter((blog) => blog._id !== currentBlogId)
    .slice(0, 3);

  if (relatedBlogs.length === 0) return null;

  return (
    <div className="related-blogs">
      <div className="related-blogs-header">
        <h3>Related Blogs</h3>
        <div className="header-underline"></div>
      </div>
      <div className="related-blogs-grid">
        {relatedBlogs.map((blog) => (
          <BlogCard
            key={blog._id}
            id={blog._id}
            title={blog.title}
            description={blog.description}
            date={blog.createdAt || blog.date}
            author={blog.author?.name || 'Anonymous'}
            image={blog.image}
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedBlogs;
