# Activity Booking & Payment Integration Guide

## 🎯 System Overview

The Activity Booking system is now integrated into DestinationDetails and includes:
- ✅ Activity browsing by destination
- ✅ Professional activity cards with pricing and ratings
- ✅ Full detail pages with image galleries
- ✅ Guest selection and date picking
- ✅ Price calculation
- Ready for: Payment processing, booking confirmation, activity management

---

## 📱 View Activity Details

### Test the System

**Activity Detail Page URL:**
```
http://localhost:5175/activities/69949edf4427b2ea63304e2e
```

**Activities on Destination Pages:**
- Navigate to any destination detail page
- Scroll down to see "Popular Activities" section
- Click "View Details" on any activity card

---

## 💳 Payment Integration Architecture

### Current Booking Form Structure

The ActivityDetail component includes:
- Date picker
- Guest selection (+/- controls)
- Price calculation
- "Reserve Now" button
- "Pay Later" option

### Payment Flow Diagram

```
User → ActivityDetail Page
       ↓
   Select Date & Guests
       ↓
   Calculate Total Price
       ↓
   Click "Reserve Now"
       ↓
   Payment Modal (Build Next)
       ↓
   Process Payment (Stripe/Razorpay)
       ↓
   Booking Confirmation
       ↓
   Confirmation Email + In-App Notification
```

---

## 🔗 Payment Gateway Integration

### Option 1: Razorpay Integration (Recommended for India)

**Step 1: Install Razorpay SDK**
```bash
cd frontend
npm install razorpay
```

**Step 2: Create Payment Service**

Create `frontend/src/services/paymentService.js`:

```javascript
export const initiateRazorpayPayment = async (paymentData) => {
  const {
    amount,
    currency = 'INR',
    email,
    phone,
    activityId,
    activityName,
    guests,
    date
  } = paymentData;

  return new Promise((resolve, reject) => {
    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID, // Add to .env
      amount: amount * 100, // Convert to paise
      currency: currency,
      name: 'Traveler',
      description: `${activityName} - ${guests} guest(s) on ${date}`,
      image: 'https://your-logo-url.png', // Add your logo
      prefill: {
        email: email,
        contact: phone
      },
      handler: async function (response) {
        try {
          // Verify payment on backend
          const verification = await verifyPayment({
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
            activityId: activityId
          });
          
          if (verification.success) {
            resolve({
              success: true,
              paymentId: response.razorpay_payment_id,
              bookingId: verification.bookingId
            });
          } else {
            reject(new Error('Payment verification failed'));
          }
        } catch (error) {
          reject(error);
        }
      },
      modal: {
        ondismiss: function () {
          reject(new Error('Payment cancelled by user'));
        }
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  });
};

const verifyPayment = async (verificationData) => {
  const response = await fetch('/api/bookings/verify-payment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(verificationData)
  });

  return response.json();
};
```

### Option 2: Stripe Integration

**Step 1: Install Stripe**
```bash
npm install @stripe/react-stripe-js @stripe/js
```

**Step 2: Setup Stripe Provider**

In `frontend/src/main.jsx`:
```jsx
import { loadStripe } from '@stripe/js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

ReactDOM.render(
  <Elements stripe={stripePromise}>
    <App />
  </Elements>,
  document.getElementById('root')
);
```

---

## 🛠️ Backend Payment Endpoints

Create `traveler-backend/routes/bookings.js`:

```javascript
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middleware/auth');

// Create booking (after payment)
router.post('/create', authMiddleware, bookingController.createBooking);

// Get user bookings
router.get('/', authMiddleware, bookingController.getUserBookings);

// Cancel booking
router.delete('/:id', authMiddleware, bookingController.cancelBooking);

// Verify payment
router.post('/verify-payment', authMiddleware, bookingController.verifyPayment);

module.exports = router;
```

Create `traveler-backend/models/Booking.js`:

```javascript
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  activityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Activity',
    required: true
  },
  activityName: String,
  destination: String,
  date: {
    type: Date,
    required: true
  },
  guests: {
    type: Number,
    required: true,
    min: 1
  },
  totalPrice: {
    type: Number,
    required: true
  },
  paymentDetails: {
    paymentId: String,
    method: String, // 'razorpay', 'stripe', 'card'
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending'
    },
    transactionId: String
  },
  bookingStatus: {
    type: String,
    enum: ['confirmed', 'cancelled', 'completed'],
    default: 'confirmed'
  },
  confirmationCode: {
    type: String,
    unique: true,
    required: true
  },
  specialRequests: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  cancelledAt: Date
});

module.exports = mongoose.model('Booking', bookingSchema);
```

---

## 📋 Booking Controller

Create `traveler-backend/controllers/bookingController.js`:

```javascript
const Booking = require('../models/Booking');
const Activity = require('../models/Activity');
const User = require('../models/User');
const axios = require('axios');
const crypto = require('crypto');

exports.createBooking = async (req, res) => {
  try {
    const { activityId, date, guests, totalPrice, paymentId, specialRequests } = req.body;
    const userId = req.user.id;

    // Validate data
    if (!activityId || !date || !guests || !totalPrice) {
      return res.status(400).json({
        success: false,
        message: 'Missing required booking information'
      });
    }

    // Fetch activity details
    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }

    // Check availability
    if (guests > activity.maxGroupSize) {
      return res.status(400).json({
        success: false,
        message: `Maximum group size is ${activity.maxGroupSize}`
      });
    }

    // Generate confirmation code
    const confirmationCode = `TRV${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create booking
    const booking = new Booking({
      userId,
      activityId,
      activityName: activity.name,
      destination: activity.destination,
      date: new Date(date),
      guests,
      totalPrice,
      paymentDetails: {
        paymentId,
        method: 'razorpay' // or 'stripe'
      },
      confirmationCode,
      specialRequests
    });

    await booking.save();

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking,
      confirmationCode
    });
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create booking'
    });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { paymentId, orderId, signature, activityId } = req.body;

    // Verify Razorpay signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    if (generatedSignature !== signature) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }

    // Payment verified - create booking
    res.json({
      success: true,
      message: 'Payment verified',
      bookingId: paymentId
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Payment verification error'
    });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate('activityId')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings'
    });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    booking.bookingStatus = 'cancelled';
    booking.cancelledAt = new Date();
    await booking.save();

    res.json({
      success: true,
      message: 'Booking cancelled successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to cancel booking'
    });
  }
};
```

---

## 🔐 Environment Variables

Add to `.env` (backend):
```
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_SECRET=your_secret
STRIPE_SECRET_KEY=your_secret_key
```

Add to `.env` (frontend):
```
REACT_APP_RAZORPAY_KEY_ID=your_public_key
REACT_APP_STRIPE_PUBLISHABLE_KEY=your_publishable_key
```

---

## 📱 Activity Booking Flow (Frontend)

### Update ActivityDetail.jsx with Payment Handler

```jsx
const handleReserveNow = async () => {
  if (!user) {
    navigate('/login');
    return;
  }

  try {
    // Initiate payment
    const paymentResult = await initiateRazorpayPayment({
      amount: totalPrice,
      currency: 'INR',
      email: user.email,
      phone: user.phone,
      activityId: id,
      activityName: activity.name,
      guests,
      date: selectedDate
    });

    if (paymentResult.success) {
      // Create booking after successful payment
      const bookingResponse = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          activityId: id,
          date: selectedDate,
          guests,
          totalPrice,
          paymentId: paymentResult.paymentId,
          specialRequests: ''
        })
      });

      const booking = await bookingResponse.json();

      if (booking.success) {
        alert(`✅ Booking confirmed!\nConfirmation Code: ${booking.confirmationCode}`);
        // Redirect to bookings page or show confirmation
      }
    }
  } catch (error) {
    alert(`❌ Booking failed: ${error.message}`);
  }
};
```

---

## 🎉 Booking Confirmation Email

Create email template `traveler-backend/templates/booking-confirmation.html`:

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; }
    .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; }
    .booking-details { background: #f5f5f5; padding: 15px; border-radius: 8px; }
    .footer { text-align: center; padding: 20px; color: #666; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Booking Confirmed! 🎉</h1>
  </div>
  
  <div class="content">
    <p>Hello {userName},</p>
    
    <p>Your activity booking has been confirmed. Here are your details:</p>
    
    <div class="booking-details">
      <h3>{activityName}</h3>
      <p><strong>Location:</strong> {destination}</p>
      <p><strong>Date:</strong> {date}</p>
      <p><strong>Guests:</strong> {guests}</p>
      <p><strong>Total Price:</strong> ₹{totalPrice}</p>
      <p><strong>Confirmation Code:</strong> {confirmationCode}</p>
    </div>
    
    <p>Please arrive 15 minutes before the activity start time.</p>
    <p>Questions? Contact us at support@traveler.com</p>
  </div>
  
  <div class="footer">
    <p>&copy; 2026 Traveler. All rights reserved.</p>
  </div>
</body>
</html>
```

---

## 📊Next Steps / TODO

- [ ] Set up Razorpay/Stripe account
- [ ] Add payment backend endpoints
- [ ] Implement payment verification
- [ ] Create booking confirmation modal
- [ ] Add email confirmation system
- [ ] Create "My Bookings" page
- [ ] Implement refund/cancellation logic
- [ ] Add booking status tracking
- [ ] Create admin booking management
- [ ] Analytics & reporting

---

## 🧪 Testing Payment Flow

### Test Card Numbers (Stripe)
- **Visa:** 4242 4242 4242 4242
- **Fail:** 4000 0000 0000 0002
- **3D Secure:** 4000 0025 0000 3155

### Test UPI IDs (Razorpay)
- **Success:** TEST@hdfcbank
- **Fail:** FAIL@hdfc

---

## 📚 Resources

- [Razorpay Documentation](https://razorpay.com/docs/)
- [Stripe Documentation](https://stripe.com/docs)
- [Payment Processing Best Practices](https://cheatsheetseries.owasp.org/cheatsheets/Payment_Card_Industry_Data_Security_Standard_Cheat_Sheet.html)

---

## ✅ Checklist for Production

- [ ] SSL certificate configured
- [ ] PCI DSS compliance verified
- [ ] Payment gateway credentials secured
- [ ] Error handling for payment failures
- [ ] Transaction logging implemented
- [ ] Refund process documented
- [ ] Customer support system ready
- [ ] Email notifications configured
- [ ] Booking management system deployed
- [ ] Analytics tracking enabled
