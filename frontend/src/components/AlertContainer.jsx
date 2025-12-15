import React from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/AlertContainer.css';

const AlertContainer = () => {
  const { alerts } = useAuth();

  return (
    <div className="alert-container">
      {alerts.map((alert) => (
        <div key={alert.id} className="alert alert-success">
          {alert.message}
        </div>
      ))}
    </div>
  );
};

export default AlertContainer;
