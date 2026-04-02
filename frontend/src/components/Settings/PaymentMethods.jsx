import React, { useEffect, useMemo, useState } from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import TwoFAVerificationModal from './TwoFAVerificationModal';

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
  const [show2FAVerification, setShow2FAVerification] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [pendingActionData, setPendingActionData] = useState(null);
  const [userSettings, setUserSettings] = useState({ twoFAEnabled: false });

  const getCardThemeClass = (brand) => {
    const normalized = (brand || '').toLowerCase();
    if (normalized.includes('visa')) return 'visa-theme';
    if (normalized.includes('mastercard')) return 'mastercard-theme';
    if (normalized.includes('amex')) return 'amex-theme';
    return 'default-theme';
  };

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

  const fetchSecuritySettings = async () => {
    if (!token) return;
    try {
      const { data } = await axios.get(`${API_BASE}/security/settings`, { headers: authHeaders });
      setUserSettings({ twoFAEnabled: data.twoFAEnabled });
    } catch (err) {
      console.error('Could not load security settings');
    }
  };

  useEffect(() => {
    fetchMethods();
    fetchSecuritySettings();
  }, [token]);

  const handleAddPayment = async (otp = null) => {
    if (!stripe || !elements) return;

    // If 2FA is enabled and OTP is not provided, show verification modal
    if (userSettings.twoFAEnabled && !otp) {
      setPendingAction('addPayment');
      setShow2FAVerification(true);
      return;
    }

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

      const addPaymentData = {
        paymentMethodId: methodId,
        makeDefault: paymentMethods.length === 0
      };

      if (otp) {
        addPaymentData.otp = otp;
      }

      await axios.post(
        `${API_BASE}/payments/add`,
        addPaymentData,
        { headers: authHeaders }
      );

      setShowAddForm(false);
      setCardName('');
      elements.getElement(CardElement)?.clear();
      setShow2FAVerification(false);
      setPendingAction(null);
      await fetchMethods();
    } catch (err) {
      if (err.response?.data?.requires2FA) {
        setPendingAction('addPayment');
        setShow2FAVerification(true);
      } else {
        const msg = err?.response?.data?.message || 'Unable to add payment method';
        setMessage(msg);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePayment = async (id, otp = null) => {
    setMessage('');

    // If 2FA is enabled and OTP is not provided, show verification modal
    if (userSettings.twoFAEnabled && !otp) {
      setPendingAction('deletePayment');
      setPendingActionData({ id });
      setShow2FAVerification(true);
      return;
    }

    try {
      const deleteData = {};
      if (otp) {
        deleteData.otp = otp;
      }

      await axios.delete(`${API_BASE}/payments/${id}`, {
        headers: authHeaders,
        data: deleteData
      });
      setPaymentMethods((prev) => prev.filter((p) => p._id !== id));
      setShow2FAVerification(false);
      setPendingAction(null);
    } catch (err) {
      if (err.response?.data?.requires2FA) {
        setPendingAction('deletePayment');
        setPendingActionData({ id });
        setShow2FAVerification(true);
      } else {
        setMessage('Unable to delete payment method');
      }
    }
  };

  const handleSetDefault = async (id, otp = null) => {
    setMessage('');

    // If 2FA is enabled and OTP is not provided, show verification modal
    if (userSettings.twoFAEnabled && !otp) {
      setPendingAction('setDefault');
      setPendingActionData({ id });
      setShow2FAVerification(true);
      return;
    }

    try {
      const setDefaultData = {};
      if (otp) {
        setDefaultData.otp = otp;
      }

      const { data } = await axios.put(
        `${API_BASE}/payments/default/${id}`,
        setDefaultData,
        { headers: authHeaders }
      );
      if (data) {
        setPaymentMethods((prev) => prev.map((p) => p._id === id ? data : { ...p, isDefault: false }));
      }
      setShow2FAVerification(false);
      setPendingAction(null);
    } catch (err) {
      if (err.response?.data?.requires2FA) {
        setPendingAction('setDefault');
        setPendingActionData({ id });
        setShow2FAVerification(true);
      } else {
        setMessage('Unable to update default');
      }
    }
  };

  if (!token) {
    return <div className="settings-container">Please log in to manage payment methods.</div>;
  }

  const handleTwoFAVerification = async (otp) => {
    setSaving(true);
    try {
      switch (pendingAction) {
        case 'addPayment':
          await handleAddPayment(otp);
          break;
        case 'deletePayment':
          await handleDeletePayment(pendingActionData.id, otp);
          break;
        case 'setDefault':
          await handleSetDefault(pendingActionData.id, otp);
          break;
        default:
          break;
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="settings-container">
      <TwoFAVerificationModal
        isOpen={show2FAVerification}
        onVerify={handleTwoFAVerification}
        onCancel={() => {
          setShow2FAVerification(false);
          setPendingAction(null);
          setPendingActionData(null);
        }}
        loading={saving}
        actionName={
          pendingAction === 'addPayment' ? 'adding a payment method' :
          pendingAction === 'deletePayment' ? 'deleting this payment method' :
          pendingAction === 'setDefault' ? 'setting default payment method' :
          'this action'
        }
      />

      <div className="settings-header">
        <h2>Payment Methods</h2>
        <button
          className="btn btn-primary micro-btn"
          onClick={() => setShowAddForm(!showAddForm)}
          disabled={!stripe}
        >
          {showAddForm ? 'Cancel' : '+ Add Payment Method'}
        </button>
      </div>

      <div className="section-divider"></div>

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

          <button className="btn btn-primary micro-btn" onClick={handleAddPayment} disabled={saving || !stripe}>
            {saving ? (
              <>
                <span className="spinner" aria-hidden="true"></span>
                Saving...
              </>
            ) : (
              'Add Card'
            )}
          </button>
          <p className="hint">Use test card 4242 4242 4242 4242, any future expiry, any CVC.</p>
        </div>
      )}

      <div className="payment-list">
        {loading && (
          <div className="payment-skeleton-grid">
            <div className="payment-skeleton-card"></div>
            <div className="payment-skeleton-card"></div>
          </div>
        )}
        {!loading && paymentMethods.length === 0 && (
          <div className="empty-state payment-empty-state">
            <div className="empty-state-icon" aria-hidden="true">💳</div>
            <h3>No payment methods added</h3>
            <p>Securely add a card to enable quick checkout.</p>
            <button className="btn btn-primary micro-btn" onClick={() => setShowAddForm(true)}>
              Add Payment Method
            </button>
          </div>
        )}
        {paymentMethods.map((payment) => (
          <div key={payment._id} className={`payment-card realistic-card ${getCardThemeClass(payment.brand)}`}>
            <div className="payment-info">
              <div className="payment-type">{(payment.brand || 'Card').toUpperCase()}</div>
              <div className="payment-number">•••• •••• •••• {payment.last4}</div>
              <div className="payment-expiry">Expires: {payment.expMonth}/{payment.expYear}</div>
            </div>
            <div className="payment-actions">
              {payment.isDefault && <span className="default-badge">Default</span>}
              {!payment.isDefault && (
                <button
                  className="btn-link micro-btn"
                  onClick={() => handleSetDefault(payment._id)}
                >
                  Set as Default
                </button>
              )}
              <button
                className="btn-delete micro-btn"
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
