import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RelatedBlogs from '../components/RelatedBlogs';
import '../styles/BlogDetail.css';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const apiUrl = import.meta?.env?.VITE_API_URL || 'http://localhost:5000/api';

  const [blog, setBlog] = useState(null);
  const [allBlogs, setAllBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = blog?.title || 'Check out this blog';

  const formatInline = (text) => {
    // Escape HTML first
    let safe = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Basic formatting: bold, italic, underline (from toolbar), line breaks
    safe = safe.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    safe = safe.replace(/\*(.+?)\*/g, '<em>$1</em>');
    safe = safe.replace(/&lt;u&gt;(.+?)&lt;\/u&gt;/g, '<u>$1</u>');
    safe = safe.replace(/\n/g, '<br />');

    return safe;
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${apiUrl}/blogs/${id}`);
        if (res.status === 404) {
          setError('Blog not found');
          setBlog(null);
        } else {
          const data = await res.json();
          if (!data.success) {
            throw new Error(data.message || 'Failed to load blog');
          }
          setBlog(data.blog);
        }
      } catch (err) {
        setError(err.message || 'Unable to load blog');
        setBlog(null);
      } finally {
        setLoading(false);
      }
    };

    const fetchRelated = async () => {
      try {
        const res = await fetch(`${apiUrl}/blogs?limit=6`);
        const data = await res.json();
        if (data.success) {
          setAllBlogs(data.blogs);
        }
      } catch (err) {
        // Related blogs are optional; ignore errors silently
      }
    };

    fetchBlog();
    fetchRelated();
  }, [apiUrl, id]);

  const relatedBlogs = useMemo(() => {
    return allBlogs.filter((b) => b._id !== blog?._id);
  }, [allBlogs, blog?._id]);

  if (loading) {
    return (
      <div className="blog-detail-page">
        <div className="blog-loading">Loading blog...</div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="blog-detail-page">
        <div className="blog-not-found">
          <h2>Blog not found</h2>
          <p>{error || "The blog you're looking for doesn't exist."}</p>
          <button className="btn" onClick={() => navigate('/blogs')}>Back to Blogs</button>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-detail-page">
      <div className="blog-detail-container">
        <article className="blog-detail-article">
          {/* Blog Cover Image */}
          <div className="blog-detail-image">
            <img src={blog.image} alt={blog.title} />
          </div>

          {/* Blog Header */}
          <div className="blog-detail-header">
            <h1 className="blog-detail-title">{blog.title}</h1>
            <div className="blog-detail-meta">
              <div className="author-info">
                <div className="author-avatar">
                  {(blog.author?.name || 'A').charAt(0)}
                </div>
                <div>
                  <p className="author-name">{blog.author?.name || 'Anonymous'}</p>
                  <p className="publish-date">{formatDate(blog.createdAt || blog.date)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Blog Content */}
          <div className="blog-detail-content">
            {(blog.content || '').split('\n\n').map((paragraph, index) => {
              if (paragraph.startsWith('##')) {
                return (
                  <h2 key={index} className="blog-section-title">
                    {paragraph.replace('## ', '')}
                  </h2>
                );
              }
              if (paragraph.startsWith('-')) {
                return (
                  <ul key={index} className="blog-list">
                    {paragraph.split('\n').map((item, i) => (
                      <li key={i} dangerouslySetInnerHTML={{ __html: formatInline(item.replace('- ', '')) }} />
                    ))}
                  </ul>
                );
              }
              return (
                <p
                  key={index}
                  className="blog-paragraph"
                  dangerouslySetInnerHTML={{ __html: formatInline(paragraph) }}
                />
              );
            })}
          </div>

          {/* Social Share */}
          <div className="blog-share">
            <span className="share-label">Share this article:</span>
            <div className="share-buttons">
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                className="share-btn facebook"
                title="Share on Facebook"
                target="_blank"
                rel="noreferrer"
              >
                f
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`}
                className="share-btn twitter"
                title="Share on X"
                target="_blank"
                rel="noreferrer"
              >
                𝕏
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                className="share-btn linkedin"
                title="Share on LinkedIn"
                target="_blank"
                rel="noreferrer"
              >
                in
              </a>
              <a
                href={`mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(shareUrl)}`}
                className="share-btn email"
                title="Share via Email"
                target="_blank"
                rel="noreferrer"
              >
                ✉
              </a>
            </div>
          </div>
        </article>

        {/* Related Blogs */}
        <RelatedBlogs currentBlogId={blog._id} allBlogs={relatedBlogs} />
      </div>
    </div>
  );
};

export default BlogDetail;
