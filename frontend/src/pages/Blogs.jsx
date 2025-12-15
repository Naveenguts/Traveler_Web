import React, { useState } from 'react';
import BlogCard from '../components/BlogCard';
import '../styles/Blogs.css';

const Blogs = () => {
  // Mock blog data - replace with API call later
  const [blogs] = useState([
    {
      id: 1,
      title: '10 Best Hidden Gems in Southeast Asia',
      description: 'Discover the most breathtaking and lesser-known destinations across Southeast Asia that will blow your mind.',
      date: '2024-12-10',
      author: 'Sarah Johnson',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=400&fit=crop'
    },
    {
      id: 2,
      title: 'Budget Travel Tips: Save Money While Exploring the World',
      description: 'Learn practical tips and tricks to travel on a budget without compromising on the quality of your experience.',
      date: '2024-12-08',
      author: 'Mike Chen',
      image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500&h=400&fit=crop'
    },
    {
      id: 3,
      title: 'Adventure Awaits: Rock Climbing Destinations Around the Globe',
      description: 'From Patagonia to the Alps, explore the world\'s most thrilling rock climbing destinations for adventurers of all levels.',
      date: '2024-12-05',
      author: 'Alex Rivera',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=400&fit=crop'
    },
    {
      id: 4,
      title: 'Cultural Experiences: Learning From Local Communities',
      description: 'Travel beyond tourism and connect with local cultures, traditions, and communities in meaningful ways.',
      date: '2024-12-01',
      author: 'Emma Wilson',
      image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500&h=400&fit=crop'
    },
    {
      id: 5,
      title: 'Beach Paradise: Top Tropical Destinations for 2025',
      description: 'Looking for the perfect beach getaway? Check out our curated list of tropical paradises you must visit.',
      date: '2024-11-28',
      author: 'James Smith',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&h=400&fit=crop'
    },
    {
      id: 6,
      title: 'Winter Wonderland: Best Snow Destinations This Season',
      description: 'Experience magical snow-covered landscapes and winter activities in these stunning snow destinations.',
      date: '2024-11-25',
      author: 'Lisa Anderson',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=400&fit=crop'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBlogs, setFilteredBlogs] = useState(blogs);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    const filtered = blogs.filter(blog =>
      blog.title.toLowerCase().includes(term.toLowerCase()) ||
      blog.description.toLowerCase().includes(term.toLowerCase()) ||
      blog.author.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredBlogs(filtered);
  };

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
