import React from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/WishlistButton.css';

const WishlistButton = ({ destination }) => {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useAuth();
  const inWishlist = isInWishlist(destination.id);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (inWishlist) {
      removeFromWishlist(destination.id);
    } else {
      addToWishlist(destination);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`wishlist-button ${inWishlist ? 'active' : ''}`}
      title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <span className="heart-icon">♥</span>
    </button>
  );
};

export default WishlistButton;
