import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import RelatedBlogs from '../components/RelatedBlogs';
import '../styles/BlogDetail.css';

const BlogDetail = () => {
  // Mock blog data - replace with API call later
  const [allBlogs] = useState([
    {
      id: 1,
      title: '10 Best Hidden Gems in Southeast Asia',
      description: 'Discover the most breathtaking and lesser-known destinations across Southeast Asia that will blow your mind.',
      date: '2024-12-10',
      author: 'Sarah Johnson',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop',
      content: `Southeast Asia is a treasure trove of amazing destinations, and while places like Thailand, Vietnam, and Cambodia are well-known, there are many hidden gems waiting to be discovered.

## 1. Luang Prabang, Laos
Nestled along the Mekong River, Luang Prabang is a charming town filled with stunning temples and colonial architecture. The best time to visit is during the cool season from October to March.

## 2. Palawan, Philippines
Known as the "Last Frontier" of the Philippines, Palawan offers pristine beaches, crystal-clear waters, and exceptional diving opportunities. The island is home to the famous Underground River and the stunning Coron Island.

## 3. Hoi An, Vietnam
This ancient town features well-preserved architecture dating back centuries. The lantern-lit streets come alive at night, and the food scene is absolutely incredible.

## 4. Koh Rong, Cambodia
If you want pristine beaches without the crowds, Koh Rong is the place. This island offers beautiful coastlines, jungle trails, and marine wildlife encounters.

## Tips for Exploring:
- Rent scooters for getting around
- Stay in local guesthouses for authentic experiences
- Try local street food
- Visit during shoulder seasons to avoid crowds
- Respect local customs and traditions

These hidden gems offer authentic experiences that you won't find in the typical tourist guides. Pack your bags and explore Southeast Asia beyond the beaten path!`
    },
    {
      id: 2,
      title: 'Budget Travel Tips: Save Money While Exploring the World',
      description: 'Learn practical tips and tricks to travel on a budget without compromising on the quality of your experience.',
      date: '2024-12-08',
      author: 'Mike Chen',
      image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&h=600&fit=crop',
      content: 'Budget travel content here...'
    },
    {
      id: 3,
      title: 'Adventure Awaits: Rock Climbing Destinations Around the Globe',
      description: 'From Patagonia to the Alps, explore the world\'s most thrilling rock climbing destinations for adventurers of all levels.',
      date: '2024-12-05',
      author: 'Alex Rivera',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop',
      content: 'Rock climbing content here...'
    },
    {
      id: 4,
      title: 'Cultural Experiences: Learning From Local Communities',
      description: 'Travel beyond tourism and connect with local cultures, traditions, and communities in meaningful ways.',
      date: '2024-12-01',
      author: 'Emma Wilson',
      image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&h=600&fit=crop',
      content: 'Cultural content here...'
    },
    {
      id: 5,
      title: 'Beach Paradise: Top Tropical Destinations for 2025',
      description: 'Looking for the perfect beach getaway? Check out our curated list of tropical paradises you must visit.',
      date: '2024-11-28',
      author: 'James Smith',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=600&fit=crop',
      content: 'Beach content here...'
    },
    {
      id: 6,
      title: 'Winter Wonderland: Best Snow Destinations This Season',
      description: 'Experience magical snow-covered landscapes and winter activities in these stunning snow destinations.',
      date: '2024-11-25',
      author: 'Lisa Anderson',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop',
      content: 'Winter content here...'
    }
  ]);

  const { id } = useParams();
  const blog = allBlogs.find(b => b.id === parseInt(id));

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (!blog) {
    return (
      <div className="blog-detail-page">
        <div className="blog-not-found">
          <h2>Blog not found</h2>
          <p>The blog you're looking for doesn't exist.</p>
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
                  {blog.author.charAt(0)}
                </div>
                <div>
                  <p className="author-name">{blog.author}</p>
                  <p className="publish-date">{formatDate(blog.date)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Blog Content */}
          <div className="blog-detail-content">
            {blog.content.split('\n\n').map((paragraph, index) => {
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
                      <li key={i}>{item.replace('- ', '')}</li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={index} className="blog-paragraph">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Social Share */}
          <div className="blog-share">
            <span className="share-label">Share this article:</span>
            <div className="share-buttons">
              <a href="#" className="share-btn facebook" title="Share on Facebook">f</a>
              <a href="#" className="share-btn twitter" title="Share on Twitter">𝕏</a>
              <a href="#" className="share-btn linkedin" title="Share on LinkedIn">in</a>
              <a href="#" className="share-btn email" title="Share via Email">✉</a>
            </div>
          </div>
        </article>

        {/* Related Blogs */}
        <RelatedBlogs currentBlogId={blog.id} allBlogs={allBlogs} />
      </div>
    </div>
  );
};

export default BlogDetail;
