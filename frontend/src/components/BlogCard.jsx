import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/BlogCard.css';

const BlogCard = ({ id, title, description, date, image, author }) => {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="blog-card">
      <div className="blog-card-image">
        <img src={image} alt={title} />
      </div>
      <div className="blog-card-content">
        <h3 className="blog-card-title">{title}</h3>
        <p className="blog-card-description">{description}</p>
        <div className="blog-card-meta">
          <span className="blog-date">
            <i className="icon-calendar"></i>
            {formatDate(date)}
          </span>
          {author && <span className="blog-author">By {author}</span>}
        </div>
        <Link to={`/blogs/${id}`} className="blog-read-more">
          Read More →
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;
