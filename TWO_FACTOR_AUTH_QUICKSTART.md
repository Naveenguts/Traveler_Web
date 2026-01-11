# 2FA Quick Start Guide

## For Developers

### What Was Implemented

✅ **2FA Verification Modal Component**
- Reusable modal for entering 6-digit OTP codes
- Responsive design, mobile-friendly
- Keyboard support and auto-focus

✅ **Backend 2FA Middleware**
- Verify 2FA for sensitive actions
- Check if 2FA is enabled
- Validate OTP tokens

✅ **Security Settings Updates**
- Change Password: Requires 2FA verification
- Disable 2FA: Requires OTP + Password
- Setup/Enable 2FA: Requires verification if already enabled

✅ **Payment Operations Updates**
- Add Payment Method: Requires 2FA verification
- Delete Payment Method: Requires 2FA verification  
- Set Default Payment: Requires 2FA verification

## Files Modified/Created

### New Files
```
traveler-backend/middleware/verify2FA.js
frontend/src/components/Settings/TwoFAVerificationModal.jsx
frontend/src/styles/TwoFAVerificationModal.css
TWO_FACTOR_AUTH_IMPLEMENTATION.md
TWO_FACTOR_AUTH_QUICKSTART.md
```

### Modified Files
```
traveler-backend/controllers/securityController.js
traveler-backend/controllers/paymentController.js
frontend/src/components/Settings/Security.jsx
frontend/src/components/Settings/PaymentMethods.jsx
```

## How to Use

### For Sensitive Action (Backend)

1. **In Your Route:**
```javascript
const verify2FA = require('../middleware/verify2FA');

// Protect sensitive action with 2FA
router.post('/action', auth, verify2FA, controllerMethod);
```

2. **In Your Controller:**
```javascript
exports.sensitiveAction = async (req, res) => {
  // Check if 2FA was verified in middleware
  const { otp } = req.body;
  
  // 2FA verification already done by middleware
  // Proceed with action
  
  const user = await User.findById(req.user.id);
  // ... perform action
  
  res.json({ message: 'Action completed successfully' });
};
```

3. **In Frontend Component:**
```javascript
import TwoFAVerificationModal from './TwoFAVerificationModal';
import axios from 'axios';

const MyComponent = () => {
  const [show2FA, setShow2FA] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAction = async (otp = null) => {
    // If 2FA enabled and no OTP, show modal
    if (user2FAEnabled && !otp) {
      setShow2FA(true);
      return;
    }

    setLoading(true);
    try {
      const data = { /* ...your data... */ };
      if (otp) data.otp = otp;

      await axios.post('/api/action', data, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      if (err.response?.data?.requires2FA) {
        setShow2FA(true);
      } else {
        // Handle error
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TwoFAVerificationModal
        isOpen={show2FA}
        onVerify={(otp) => handleAction(otp)}
        onCancel={() => setShow2FA(false)}
        loading={loading}
        actionName="performing this action"
      />
      <button onClick={() => handleAction()}>Perform Action</button>
    </>
  );
};
```

## Testing Locally

### Setup

1. Both frontend and backend are already configured
2. Make sure 2FA is enabled on your test user account
3. Have an authenticator app ready (Google Authenticator, Authy, etc.)

### Test Flow

1. **Enable 2FA (if not already enabled)**
   - Go to Settings → Security & Password
   - Click "Enable" button
   - Scan QR code with authenticator app
   - Enter 6-digit code
   - 2FA is now enabled

2. **Test Change Password**
   - Go to Settings → Security & Password
   - Click "Change Password"
   - Fill in current and new password
   - Click "Update Password"
   - 2FA modal appears
   - Enter 6-digit code from authenticator
   - Password should be changed

3. **Test Add Payment Method**
   - Go to Settings → Payment Methods
   - Click "+ Add Payment Method"
   - Fill in card details (use test card: 4242 4242 4242 4242)
   - Click "Add Card"
   - 2FA modal appears
   - Enter 6-digit code
   - Card should be added

4. **Test Disable 2FA**
   - Go to Settings → Security & Password
   - Click "Disable" button
   - 2FA modal appears
   - Enter 6-digit code
   - Password prompt appears
   - Enter password
   - 2FA should be disabled

## Common Issues

### 1. "Invalid 2FA code" Error
- **Cause**: Device time is out of sync
- **Solution**: Sync device time with internet time
- **Test**: Try a code from 30 seconds ago or future

### 2. 2FA Modal Not Appearing
- **Cause**: User 2FA status not being fetched
- **Solution**: Ensure `fetchSecuritySettings()` is called on component mount
- **Check**: Console for any API errors

### 3. 2FA Code Input Not Accepting Numbers
- **Cause**: Input validation in modal
- **Solution**: Check that TwoFAVerificationModal is accepting numeric input
- **Note**: Modal should only accept 6 digits

## API Endpoints

### Security Endpoints
```
GET  /api/security/settings          (Get 2FA status)
POST /api/security/change-password   (Change password with optional OTP)
POST /api/security/2fa/setup         (Initialize 2FA setup)
POST /api/security/2fa/verify        (Enable 2FA with OTP)
POST /api/security/2fa/disable       (Disable 2FA with password + OTP)
```

### Payment Endpoints
```
POST /api/payments/add               (Add payment method with optional OTP)
PUT  /api/payments/default/:id       (Set default payment with optional OTP)
DELETE /api/payments/:id             (Delete payment method with optional OTP)
```

## Response Format

### Success (200/201)
```json
{
  "message": "Action completed successfully",
  "data": { /* ...response data... */ }
}
```

### 2FA Required (403)
```json
{
  "message": "2FA verification required",
  "requires2FA": true,
  "twoFAEnabled": true
}
```

### Invalid OTP (401)
```json
{
  "message": "Invalid 2FA code",
  "requires2FA": true
}
```

## Next Steps

1. **Test thoroughly** - Try all protected actions with and without 2FA
2. **Add rate limiting** - Limit failed verification attempts
3. **Add backup codes** - For account recovery
4. **Monitor errors** - Track failed 2FA attempts
5. **User documentation** - Guide users on enabling/managing 2FA
6. **Email notifications** - Send alerts for sensitive actions
7. **Analytics** - Track 2FA adoption and usage

## Support

For issues or questions:
1. Check error logs in browser console
2. Check backend server logs
3. Verify user 2FA settings in database
4. Test OTP generation in authenticator app
5. Ensure correct JWT token is being sent

## References

- Implementation Guide: [TWO_FACTOR_AUTH_IMPLEMENTATION.md](./TWO_FACTOR_AUTH_IMPLEMENTATION.md)
- Component Files: See `frontend/src/components/Settings/`
- Backend Files: See `traveler-backend/controllers/`
