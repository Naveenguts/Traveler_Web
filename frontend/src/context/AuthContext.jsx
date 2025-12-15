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

  // Trips: persisted in backend with localStorage backup
  const [trips, setTrips] = useState([]);
  const [tripsLoading, setTripsLoading] = useState(false);

  const API_URL = 'http://localhost:5000/api';

  // Fetch trips from backend when user logs in
  const fetchTrips = async () => {
    if (!user?.id) return;
    
    setTripsLoading(true);
    try {
      const response = await fetch(`${API_URL}/trips/user/${user.id}`);
      const data = await response.json();
      if (data.success) {
        setTrips(data.trips);
        // Backup to localStorage
        localStorage.setItem('traveler_trips', JSON.stringify(data.trips));
      }
    } catch (error) {
      console.error('Error fetching trips:', error);
      // Fallback to localStorage
      try {
        const raw = localStorage.getItem('traveler_trips');
        if (raw) setTrips(JSON.parse(raw));
      } catch (e) {
        console.error('Error loading trips from localStorage:', e);
      }
    } finally {
      setTripsLoading(false);
    }
  };

  // Fetch trips when user logs in
  useEffect(() => {
    if (user?.id) {
      fetchTrips();
    } else {
      setTrips([]);
    }
  }, [user?.id]);

  const addTrip = async (tripData) => {
    if (!user?.id) {
      pushAlert('Please login to book trips');
      return null;
    }

    try {
      const response = await fetch(`${API_URL}/trips`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          ...tripData,
          status: tripData.status || 'upcoming'
        })
      });

      const data = await response.json();
      if (data.success) {
        setTrips((prev) => [data.trip, ...prev]);
        localStorage.setItem('traveler_trips', JSON.stringify([data.trip, ...trips]));
        pushAlert(`Trip to ${tripData.destinationName} added! ✈️`);
        addNotification(`New trip to ${tripData.destinationName} created`);
        return data.trip;
      } else {
        pushAlert('Failed to create trip');
        return null;
      }
    } catch (error) {
      console.error('Error creating trip:', error);
      // Fallback to localStorage
      const newTrip = {
        _id: Date.now().toString(),
        userId: user.id,
        ...tripData,
        status: tripData.status || 'upcoming',
        createdAt: new Date().toISOString()
      };
      setTrips((prev) => [newTrip, ...prev]);
      localStorage.setItem('traveler_trips', JSON.stringify([newTrip, ...trips]));
      pushAlert(`Trip to ${tripData.destinationName} added! ✈️ (Offline mode)`);
      return newTrip;
    }
  };

  const updateTrip = async (tripId, updates) => {
    try {
      const response = await fetch(`${API_URL}/trips/${tripId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      const data = await response.json();
      if (data.success) {
        setTrips((prev) => prev.map(trip => 
          trip._id === tripId ? data.trip : trip
        ));
        localStorage.setItem('traveler_trips', JSON.stringify(trips.map(trip => 
          trip._id === tripId ? data.trip : trip
        )));
      }
    } catch (error) {
      console.error('Error updating trip:', error);
      // Fallback to local update
      setTrips((prev) => prev.map(trip => 
        trip._id === tripId ? { ...trip, ...updates } : trip
      ));
    }
  };

  const cancelTrip = async (tripId) => {
    try {
      const response = await fetch(`${API_URL}/trips/${tripId}/cancel`, {
        method: 'PATCH'
      });

      const data = await response.json();
      if (data.success) {
        setTrips((prev) => prev.map(trip => 
          trip._id === tripId ? data.trip : trip
        ));
        localStorage.setItem('traveler_trips', JSON.stringify(trips.map(trip => 
          trip._id === tripId ? data.trip : trip
        )));
        pushAlert('Trip cancelled');
      }
    } catch (error) {
      console.error('Error cancelling trip:', error);
      // Fallback to local update
      setTrips((prev) => prev.map(trip => 
        trip._id === tripId ? { ...trip, status: 'cancelled' } : trip
      ));
      pushAlert('Trip cancelled (Offline mode)');
    }
  };

  const deleteTrip = async (tripId) => {
    try {
      const response = await fetch(`${API_URL}/trips/${tripId}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      if (data.success) {
        setTrips((prev) => prev.filter(trip => trip._id !== tripId));
        localStorage.setItem('traveler_trips', JSON.stringify(trips.filter(trip => trip._id !== tripId)));
        pushAlert('Trip deleted');
      }
    } catch (error) {
      console.error('Error deleting trip:', error);
      // Fallback to local delete
      setTrips((prev) => prev.filter(trip => trip._id !== tripId));
      pushAlert('Trip deleted (Offline mode)');
    }
  };

  const getTrip = (tripId) => {
    return trips.find(trip => trip._id === tripId);
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
        clearWishlist,
        trips,
        tripsLoading,
        fetchTrips,
        addTrip,
        updateTrip,
        cancelTrip,
        deleteTrip,
        getTrip
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
