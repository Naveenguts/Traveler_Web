import React, { useState } from 'react';

const PaymentMethods = () => {
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, type: 'Credit Card', last4: '4242', expiry: '12/25', isDefault: true },
    { id: 2, type: 'Debit Card', last4: '5555', expiry: '08/24', isDefault: false }
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPayment, setNewPayment] = useState({
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  const handleAddPayment = () => {
    if (newPayment.cardNumber && newPayment.expiry && newPayment.cvv) {
      const lastFour = newPayment.cardNumber.slice(-4);
      setPaymentMethods([
        ...paymentMethods,
        {
          id: paymentMethods.length + 1,
          type: newPayment.cardName || 'Card',
          last4: lastFour,
          expiry: newPayment.expiry,
          isDefault: false
        }
      ]);
      setNewPayment({ cardName: '', cardNumber: '', expiry: '', cvv: '' });
      setShowAddForm(false);
      alert('Payment method added successfully!');
    }
  };

  const handleDeletePayment = (id) => {
    if (paymentMethods.length > 1) {
      setPaymentMethods(paymentMethods.filter(p => p.id !== id));
      alert('Payment method removed!');
    } else {
      alert('You must have at least one payment method!');
    }
  };

  const handleSetDefault = (id) => {
    setPaymentMethods(paymentMethods.map(p => ({
      ...p,
      isDefault: p.id === id
    })));
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h2>Payment Methods</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancel' : '+ Add Payment Method'}
        </button>
      </div>

      {showAddForm && (
        <div className="payment-form">
          <div className="form-group">
            <label>Card Name</label>
            <input
              type="text"
              placeholder="e.g., My Visa Card"
              value={newPayment.cardName}
              onChange={(e) => setNewPayment({ ...newPayment, cardName: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Card Number</label>
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              maxLength="19"
              value={newPayment.cardNumber}
              onChange={(e) => setNewPayment({ ...newPayment, cardNumber: e.target.value })}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Expiry Date</label>
              <input
                type="text"
                placeholder="MM/YY"
                maxLength="5"
                value={newPayment.expiry}
                onChange={(e) => setNewPayment({ ...newPayment, expiry: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>CVV</label>
              <input
                type="text"
                placeholder="123"
                maxLength="3"
                value={newPayment.cvv}
                onChange={(e) => setNewPayment({ ...newPayment, cvv: e.target.value })}
              />
            </div>
          </div>

          <button className="btn btn-primary" onClick={handleAddPayment}>
            Add Card
          </button>
        </div>
      )}

      <div className="payment-list">
        {paymentMethods.map(payment => (
          <div key={payment.id} className="payment-card">
            <div className="payment-info">
              <div className="payment-type">{payment.type}</div>
              <div className="payment-number">•••• •••• •••• {payment.last4}</div>
              <div className="payment-expiry">Expires: {payment.expiry}</div>
            </div>
            <div className="payment-actions">
              {payment.isDefault && <span className="default-badge">Default</span>}
              {!payment.isDefault && (
                <button 
                  className="btn-link"
                  onClick={() => handleSetDefault(payment.id)}
                >
                  Set as Default
                </button>
              )}
              <button 
                className="btn-delete"
                onClick={() => handleDeletePayment(payment.id)}
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
