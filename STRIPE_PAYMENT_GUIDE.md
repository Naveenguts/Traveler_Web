# Stripe Payment Integration Guide

## Overview
The traveler app now supports multi-currency payment processing through Stripe. Users can pay in either USD or INR with automatic currency conversion.

## Features Implemented

### 1. Multi-Currency Support
- **Supported Currencies**: USD (US Dollar) and INR (Indian Rupee)
- **Conversion Rate**: 1 USD = 83 INR (configurable)
- **Dynamic Display**: All prices automatically convert based on selected currency
- **Minor Units**: Proper conversion to cents/paise for Stripe API

### 2. Payment Flow
```
Select Destination → Book Trip → Choose Payment Method → Select Currency → Enter Card Details → Success/Failure Page
```

### 3. Payment Methods Available
- **Stripe** - Credit/Debit card processing with Stripe Elements (NEW)
- **Card** - Local card processing (existing)
- **UPI** - Indian UPI payments (existing)
- **Net Banking** - Bank transfer (existing)

## Configuration

### Backend (.env)
```env
STRIPE_SECRET_KEY=sk_test_51SmGRvHuFHZnpRsubFEDWzcGszdCkKvUDoQwn3jmVtQj7eiGWC5DZ4o4u3EDPHWaT3ddVh9BgWdBHlAtoQPQuLNx000EYwnVU5
```

### Frontend (.env)
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51SmGRvHuFHZnpRsuC9EGPWQrXRJgX8cF9s3bUDHY6bZkMEm8xPJBaJXH7oYYOWxW5fkQaVLqRzB3ktpWnJVvMfAC00EXhCvF6E
```

## API Endpoints

### Create Payment Intent
**Endpoint**: `POST /api/payments/intent`

**Request Body**:
```json
{
  "amount": 50000,
  "currency": "usd"
}
```

**Response**:
```json
{
  "clientSecret": "pi_xxx_secret_xxx"
}
```

**Notes**:
- Amount must be in minor units (cents for USD, paise for INR)
- Currency must be either "usd" or "inr" (lowercase)
- No authentication required for payment intent creation

## Currency Conversion

### Utility Functions

#### `formatAmount(value)`
Formats price with proper currency symbol and locale:
```javascript
formatAmount(100) // Currency: USD → "$100"
formatAmount(100) // Currency: INR → "₹8,300"
```

#### `toMinorUnits(value)`
Converts dollar/rupee amount to cents/paise:
```javascript
toMinorUnits(99.99) // Currency: USD → 9999
toMinorUnits(100)   // Currency: INR → 830000 (100 * 83 * 100)
```

### Currency Configuration
```javascript
const currencyConfig = {
  usd: { code: 'USD', locale: 'en-US', rate: 1 },
  inr: { code: 'INR', locale: 'en-IN', rate: 83 }
};
```

## User Interface

### Currency Selector
Located in the pricing sidebar:
```jsx
<select value={currency} onChange={(e) => setCurrency(e.target.value)}>
  <option value="usd">USD ($)</option>
  <option value="inr">INR (₹)</option>
</select>
```

### Price Display
All prices automatically update when currency changes:
- Sidebar: "From {formatAmount(discountedPrice)}"
- Payment modal: "Total: {formatAmount(discountedPrice)}"
- Hero banner: "From {formatAmount(discountedPrice)}"

### Stripe Payment Form
Embedded Stripe Elements with:
- Card number input (with validation)
- Expiry date and CVC
- Real-time error messages
- Loading states during processing

## Payment Success/Failure Pages

### Success Page (`/payment-success`)
Shows:
- ✅ Success icon
- Booking reference number (format: `BOOK{timestamp}`)
- Links to "View My Trips" and "Browse Destinations"

### Failure Page (`/payment-failed`)
Shows:
- ❌ Error icon
- Error message
- "Try Again" button (returns to booking)
- "Contact Support" link

## Testing

### Test Card Numbers (Stripe Test Mode)
```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
3D Secure Required: 4000 0027 6000 3184
```

**Expiry**: Any future date (e.g., 12/34)  
**CVC**: Any 3 digits (e.g., 123)

### Test Flow
1. Navigate to any destination (e.g., Paris)
2. Click "Reserve now"
3. Select dates and travelers
4. Click "Proceed to Payment"
5. Select "Stripe" payment method
6. Choose currency (USD or INR)
7. Enter test card: 4242 4242 4242 4242
8. Verify success redirect with booking reference

## Code Structure

### Backend
- **Controller**: `traveler-backend/controllers/paymentController.js`
  - `createPaymentIntent()` - Creates Stripe PaymentIntent
- **Route**: `traveler-backend/routes/payments.js`
  - `POST /api/payments/intent` - Public endpoint for payment intent

### Frontend
- **Main Component**: `frontend/src/pages/DestinationDetails.jsx`
  - Wrapped in `<Elements stripe={stripePromise}>`
  - Currency state management
  - StripePaymentForm integration
- **Success Page**: `frontend/src/pages/PaymentSuccess.jsx`
- **Failure Page**: `frontend/src/pages/PaymentFailed.jsx`
- **Styles**: `frontend/src/App.css`
  - `.currency-selector` - Currency dropdown styling
  - `.stripe-payment-form` - Stripe Elements container
  - `.stripe-card-input` - Card input field styling
  - `.payment-error` - Error message display

## Security Features

- ✅ Stripe Elements (PCI-compliant)
- ✅ HTTPS required in production
- ✅ Server-side payment intent creation
- ✅ Amount validation on backend
- ✅ Currency whitelisting (USD/INR only)
- ✅ No card details stored on server

## Booking Flow Integration

When payment succeeds:
1. Trip saved to user's trips with:
   - `paymentStatus: 'completed'`
   - `paymentMethod: 'Stripe'`
   - `transactionId: <Stripe Payment Intent ID>`
   - `bookingDate: <current timestamp>`

2. User redirected to success page with booking reference

3. Booking reference format: `BOOK{Date.now()}`
   Example: `BOOK1738272493847`

## Next Steps

### For Production:
1. Replace test keys with live Stripe keys
2. Update currency conversion to use real-time API (e.g., ExchangeRate-API)
3. Enable webhooks for payment confirmations
4. Add payment receipt email notifications
5. Implement refund functionality
6. Add payment history dashboard

### Recommended Enhancements:
- Add more currencies (EUR, GBP, AUD)
- Save card details for future use (with Stripe Payment Methods)
- Add Apple Pay / Google Pay
- Implement installment payment plans
- Add promotional codes / discounts

## Troubleshooting

### "No publishable key provided"
- Ensure `VITE_STRIPE_PUBLISHABLE_KEY` is set in `frontend/.env`
- Restart the frontend dev server after adding the key

### "Invalid currency"
- Currency must be lowercase ("usd" or "inr")
- Check backend validation in `createPaymentIntent()`

### Payment Intent creation fails
- Verify `STRIPE_SECRET_KEY` is correct in `traveler-backend/.env`
- Check backend logs for Stripe API errors
- Ensure amount > 0 and properly converted to minor units

### Styling issues with Stripe Elements
- Check `.stripe-card-input` styles in `App.css`
- Verify Elements wrapper has proper `stripe={stripePromise}`
- CardElement requires parent with defined width

## Support

For issues or questions:
- Stripe Test Mode Dashboard: https://dashboard.stripe.com/test
- Stripe Docs: https://stripe.com/docs/payments/accept-a-payment
- Stripe Elements React: https://stripe.com/docs/stripe-js/react
