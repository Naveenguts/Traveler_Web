import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Load from localStorage if present
    try {
      const raw = localStorage.getItem("traveler_user");
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  });

  const login = (userData) => {
    setUser(userData);
    try { localStorage.setItem("traveler_user", JSON.stringify(userData)); } catch (e) {}
  };

  const logout = () => {
    setUser(null);
    try { localStorage.removeItem("traveler_user"); } catch (e) {}
  };

  const updateUser = (updates) => {
    setUser((prev) => {
      const next = { ...(prev || {}), ...updates };
      try { localStorage.setItem("traveler_user", JSON.stringify(next)); } catch (e) {}
      return next;
    });
  };

  // Preferences: persisted within user object
  const defaultPreferences = {
    language: 'English',
    currency: 'USD',
    travelType: 'Adventure',
    notifications: { email: true, sms: false, push: true }
  };

  const getPreferences = () => {
    return (user && user.preferences) ? user.preferences : defaultPreferences;
  };

  const updatePreferences = (prefsUpdates) => {
    const previous = getPreferences();
    const nextPrefs = { ...previous, ...prefsUpdates };
    updateUser({ preferences: nextPrefs });

    // Fire a notification when push preference is toggled on
    if (prefsUpdates?.notifications?.push && !previous?.notifications?.push) {
      addNotification('Push notifications enabled');
    }
    if (previous?.notifications?.push && prefsUpdates?.notifications && prefsUpdates.notifications.push === false) {
      addNotification('Push notifications turned off');
    }
  };

  // Simple notifications queue for in-app alerts reflecting preference changes
  const [alerts, setAlerts] = useState([]);
  const pushAlert = (message) => {
    const id = Date.now();
    setAlerts((prev) => [...prev, { id, message }]);
    // Auto-dismiss after 5 seconds
    setTimeout(() => setAlerts((prev) => prev.filter((a) => a.id !== id)), 5000);
  };

  // Persistent notification center (for bell dropdown)
  const [notifications, setNotifications] = useState(() => {
    try {
      const raw = localStorage.getItem('traveler_notifications');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('traveler_notifications', JSON.stringify(notifications));
    } catch (e) {
      // ignore storage errors
    }
  }, [notifications]);

  const addNotification = (message, meta = {}) => {
    const entry = {
      id: Date.now(),
      message,
      meta,
      read: false,
      date: new Date().toISOString(),
    };
    setNotifications((prev) => [entry, ...prev].slice(0, 50));
  };

  const markNotificationRead = (id) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotifications = () => setNotifications([]);

  // Wishlist: persisted in localStorage
  const [wishlist, setWishlist] = useState(() => {
    try {
      const raw = localStorage.getItem('traveler_wishlist');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('traveler_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      // ignore storage errors
    }
  }, [wishlist]);

  const addToWishlist = (destination) => {
    setWishlist((prev) => {
      // Check if destination already exists
      if (prev.some(item => item.id === destination.id)) {
        return prev;
      }
      return [...prev, { ...destination, addedAt: new Date().toISOString() }];
    });
    pushAlert(`${destination.name} added to wishlist! ❤️`);
  };

  const removeFromWishlist = (destinationId) => {
    setWishlist((prev) => prev.filter(item => item.id !== destinationId));
    pushAlert('Removed from wishlist');
  };

  const isInWishlist = (destinationId) => {
    return wishlist.some(item => item.id === destinationId);
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        updateUser,
        preferences: getPreferences(),
        updatePreferences,
        alerts,
        pushAlert,
        notifications,
        addNotification,
        markNotificationRead,
        markAllNotificationsRead,
        clearNotifications,
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
