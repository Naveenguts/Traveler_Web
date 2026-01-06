import React, { useEffect, useMemo, useState } from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const cardElementStyle = {
  style: {
    base: {
      fontSize: '16px',
      color: '#32325d',
      '::placeholder': { color: '#a0a0a0' }
    },
    invalid: { color: '#fa755a' }
  }
};

const PaymentMethods = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { user, token } = useAuth();

  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [cardName, setCardName] = useState('');
  const [message, setMessage] = useState('');

  const authHeaders = useMemo(() => (
    token ? { Authorization: `Bearer ${token}` } : {}
  ), [token]);

  const fetchMethods = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_BASE}/payments`, { headers: authHeaders });
      setPaymentMethods(data || []);
    } catch (err) {
      setMessage('Could not load payment methods');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMethods();
  }, [token]);

  const handleAddPayment = async () => {
    if (!stripe || !elements) return;
    setSaving(true);
    setMessage('');
    try {
      const { data: setup } = await axios.post(
        `${API_BASE}/payments/setup-intent`,
        {},
        { headers: authHeaders }
      );

      const result = await stripe.confirmCardSetup(setup.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: { name: cardName || user?.name || 'Traveler User' }
        }
      });

      if (result.error) {
        setMessage(result.error.message || 'Card validation failed');
        setSaving(false);
        return;
      }

      const methodId = result.setupIntent.payment_method;

      await axios.post(
        `${API_BASE}/payments/add`,
        { paymentMethodId: methodId, makeDefault: paymentMethods.length === 0 },
        { headers: authHeaders }
      );

      setShowAddForm(false);
      setCardName('');
      elements.getElement(CardElement)?.clear();
      await fetchMethods();
    } catch (err) {
      const msg = err?.response?.data?.message || 'Unable to add payment method';
      setMessage(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePayment = async (id) => {
    setMessage('');
    try {
      await axios.delete(`${API_BASE}/payments/${id}`, { headers: authHeaders });
      setPaymentMethods((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      setMessage('Unable to delete payment method');
    }
  };

  const handleSetDefault = async (id) => {
    setMessage('');
    try {
      const { data } = await axios.put(`${API_BASE}/payments/default/${id}`, {}, { headers: authHeaders });
      if (data) {
        setPaymentMethods((prev) => prev.map((p) => p._id === id ? data : { ...p, isDefault: false }));
      }
    } catch (err) {
      setMessage('Unable to update default');
    }
  };

  if (!token) {
    return <div className="settings-container">Please log in to manage payment methods.</div>;
  }

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h2>Payment Methods</h2>
        <button
          className="btn btn-primary"
          onClick={() => setShowAddForm(!showAddForm)}
          disabled={!stripe}
        >
          {showAddForm ? 'Cancel' : '+ Add Payment Method'}
        </button>
      </div>

      {message && (
        <div className="payment-alert">
          <div className="alert alert-warning">{message}</div>
        </div>
      )}

      {showAddForm && (
        <div className="payment-form">
          <div className="form-group">
            <label>Card Name</label>
            <input
              type="text"
              placeholder="e.g., My Visa Card"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Card Details</label>
            <div className="card-element-wrapper">
              <CardElement options={cardElementStyle} />
            </div>
          </div>

          <button className="btn btn-primary" onClick={handleAddPayment} disabled={saving || !stripe}>
            {saving ? 'Saving...' : 'Add Card'}
          </button>
          <p className="hint">Use test card 4242 4242 4242 4242, any future expiry, any CVC.</p>
        </div>
      )}

      <div className="payment-list">
        {loading && <div>Loading payment methods...</div>}
        {!loading && paymentMethods.length === 0 && (
          <div className="empty-state">No payment methods yet. Add one to get started.</div>
        )}
        {paymentMethods.map((payment) => (
          <div key={payment._id} className="payment-card">
            <div className="payment-info">
              <div className="payment-type">{payment.brand || 'Card'}</div>
              <div className="payment-number">•••• •••• •••• {payment.last4}</div>
              <div className="payment-expiry">Expires: {payment.expMonth}/{payment.expYear}</div>
            </div>
            <div className="payment-actions">
              {payment.isDefault && <span className="default-badge">Default</span>}
              {!payment.isDefault && (
                <button
                  className="btn-link"
                  onClick={() => handleSetDefault(payment._id)}
                >
                  Set as Default
                </button>
              )}
              <button
                className="btn-delete"
                onClick={() => handleDeletePayment(payment._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethods;
