# Two-Factor Authentication (2FA) Implementation Guide

## Overview

This document explains the implementation of Two-Factor Authentication (2FA) for sensitive actions in the Traveler application. Users with 2FA enabled will be required to provide a 6-digit OTP code from their authenticator app when performing sensitive operations.

## Architecture

### Flow Diagram

```
[User Logged In]
      |
      v
[Attempt Sensitive Action]
      |
      v
[Check if 2FA is Enabled]
      |
      +---> No 2FA: Proceed with Action
      |
      +---> 2FA Enabled: Show 2FA Modal
            |
            v
      [User Enters OTP Code]
            |
            v
      [Verify OTP]
            |
            +---> Invalid: Show Error, Retry
            |
            +---> Valid: Execute Action
```

## Sensitive Actions Protected by 2FA

### Security Settings
- **Change Password**: Users must verify with 2FA code
- **Enable 2FA**: If already enabled, must verify before re-enabling
- **Disable 2FA**: Must verify with 2FA code and password
- **Update Login Alerts**: May require 2FA (configurable)

### Payment Operations
- **Add Payment Method**: Must verify with 2FA code
- **Delete Payment Method**: Must verify with 2FA code
- **Set Default Payment Method**: Must verify with 2FA code
- **Update Payment Information**: Must verify with 2FA code

## Backend Implementation

### New Middleware: `verify2FA.js`

Located at: `traveler-backend/middleware/verify2FA.js`

```javascript
const verify2FAForSensitiveAction = (req, res, next) => {
  // Checks if user has 2FA enabled
  // If enabled, verifies the OTP from request body
  // Proceeds to next middleware if OTP is valid
  // Returns 403 status if 2FA verification required
  // Returns 401 status if OTP is invalid
}
```

**Usage in routes:**
```javascript
router.post('/change-password', 
  auth,
  verify2FAForSensitiveAction,
  changePassword
);
```

### Updated Controllers

#### Security Controller: `securityController.js`

**Changes:**
- `changePassword()`: Now accepts `otp` in request body and verifies 2FA before changing password
- `disable2FA()`: Now accepts `otp` in request body and verifies 2FA before disabling 2FA
- `verify2FA()`: Unchanged - still handles initial 2FA setup verification

**Request/Response Examples:**

```javascript
// Change Password with 2FA
POST /api/security/change-password
Body: {
  oldPassword: "currentpass123",
  newPassword: "newpass456",
  otp: "123456"  // Required if 2FA is enabled
}

Response 403 (if 2FA enabled but no OTP):
{
  message: "2FA verification required",
  requires2FA: true,
  twoFAEnabled: true
}

Response 401 (if invalid OTP):
{
  message: "Invalid 2FA code",
  requires2FA: true
}
```

#### Payment Controller: `paymentController.js`

**Changes:**
- `addPaymentMethod()`: Now accepts `otp` in request body and verifies 2FA
- `setDefault()`: Now accepts `otp` in request body and verifies 2FA
- `deleteMethod()`: Now accepts `otp` in request body and verifies 2FA

**Request/Response Examples:**

```javascript
// Add Payment Method with 2FA
POST /api/payments/add
Body: {
  paymentMethodId: "pm_1234567890",
  makeDefault: true,
  otp: "123456"  // Required if 2FA is enabled
}

Response 403 (if 2FA enabled but no OTP):
{
  message: "2FA verification required",
  requires2FA: true,
  twoFAEnabled: true
}
```

## Frontend Implementation

### New Component: `TwoFAVerificationModal.jsx`

Located at: `frontend/src/components/Settings/TwoFAVerificationModal.jsx`

**Features:**
- Modal dialog for entering 6-digit OTP code
- Auto-focus on OTP input field
- Input validation (numeric only, max 6 digits)
- Error message display
- Loading state for verification process
- Cancel button to abort action
- Keyboard support (Enter to submit when 6 digits entered)

**Props:**
```javascript
<TwoFAVerificationModal
  isOpen={boolean}              // Whether modal is visible
  onVerify={function(otp)}      // Called when user submits valid OTP
  onCancel={function()}         // Called when user cancels
  loading={boolean}             // Show loading state during verification
  actionName={string}           // Description of action (e.g., "changing password")
/>
```

**Styling:** `frontend/src/styles/TwoFAVerificationModal.css`
- Responsive modal design
- Animations for appearance and error messages
- Mobile-friendly layout
- Accessible colors and spacing

### Updated Components

#### Security Component: `Security.jsx`

**New State Variables:**
```javascript
const [show2FAVerification, setShow2FAVerification] = useState(false);
const [pendingSensitiveAction, setPendingSensitiveAction] = useState(null);
const [pendingActionData, setPendingActionData] = useState(null);
```

**Updated Handlers:**

1. **`handleChangePassword(otp = null)`**
   - Checks if 2FA is enabled
   - If enabled and no OTP provided: shows 2FA modal
   - If OTP provided: includes it in API request
   - Includes 2FA verification logic

2. **`handleDisable2FA(otp = null)`**
   - Similar flow to changePassword
   - Shows password confirmation dialog
   - Verifies 2FA before disabling

3. **`handleSetup2FA()`**
   - Checks if already enabled
   - If enabled: requires 2FA verification first
   - Then proceeds with setup

4. **`handleTwoFAVerification(otp)`**
   - Handles modal submission
   - Routes to appropriate handler based on pending action

#### Payment Methods Component: `PaymentMethods.jsx`

**New State Variables:**
```javascript
const [show2FAVerification, setShow2FAVerification] = useState(false);
const [pendingAction, setPendingAction] = useState(null);
const [pendingActionData, setPendingActionData] = useState(null);
const [userSettings, setUserSettings] = useState({ twoFAEnabled: false });
```

**Updated Handlers:**

1. **`handleAddPayment(otp = null)`**
   - Checks if 2FA is enabled
   - If enabled: shows 2FA modal before adding card
   - If OTP provided: verifies before adding

2. **`handleSetDefault(id, otp = null)`**
   - Requires 2FA verification if enabled

3. **`handleDeletePayment(id, otp = null)`**
   - Requires 2FA verification if enabled

4. **`handleTwoFAVerification(otp)`**
   - Routes to appropriate handler based on pending action

## User Flow Examples

### Example 1: Changing Password with 2FA Enabled

1. User clicks "Change Password" button
2. User fills password form and clicks "Update Password"
3. Frontend checks: `securitySettings.twoFAEnabled === true`
4. Frontend shows TwoFAVerificationModal
5. User enters 6-digit code from authenticator app
6. Frontend sends: `POST /api/security/change-password` with `otp: "123456"`
7. Backend verifies OTP using speakeasy
8. If valid: Password is changed, user logged out
9. If invalid: Error message shown, user can retry

### Example 2: Adding Payment Method with 2FA Enabled

1. User clicks "+ Add Payment Method"
2. User fills card details and clicks "Add Card"
3. Frontend checks: `userSettings.twoFAEnabled === true`
4. Frontend shows TwoFAVerificationModal
5. User enters 6-digit code
6. Frontend sends: `POST /api/payments/add` with `otp: "123456"`
7. Backend verifies OTP
8. If valid: Payment method added successfully
9. If invalid: Error shown, user can retry

### Example 3: Disabling 2FA with 2FA Enabled

1. User clicks "Disable" button on 2FA section
2. Frontend shows TwoFAVerificationModal
3. User enters 6-digit code and clicks "Verify"
4. Frontend shows password confirmation dialog
5. User enters password
6. Frontend sends: `POST /api/security/2fa/disable` with `password: "..." otp: "..."`
7. Backend verifies both password and OTP
8. If valid: 2FA disabled, user notified
9. If invalid: Error shown

## Security Considerations

1. **Time Window**: OTP verification allows 2 time steps (60 seconds) tolerance for clock skew
2. **Single Use**: Each OTP can only be verified once
3. **Rate Limiting**: (Recommended) Implement rate limiting on verification endpoints
4. **Token Invalidation**: Password changes invalidate all existing tokens
5. **Email Notifications**: Users receive email confirmations for sensitive actions
6. **Device Tracking**: Login locations and devices are tracked

## Error Handling

### Response Status Codes

- **200/201**: Success
- **400**: Bad request (missing fields, validation errors)
- **401**: Unauthorized (invalid password/OTP)
- **403**: Forbidden (2FA required but not provided)
- **404**: Not found (user/resource doesn't exist)
- **500**: Server error

### Error Response Format

```javascript
// 2FA Required
{
  "message": "2FA verification required",
  "requires2FA": true,
  "twoFAEnabled": true
}

// Invalid OTP
{
  "message": "Invalid 2FA code",
  "requires2FA": true
}
```

## Testing

### Test Cases

1. **Disable 2FA Test**
   - Enable 2FA first
   - Attempt to disable without OTP → Should fail with 403
   - Disable with correct OTP → Should succeed

2. **Change Password Test**
   - With 2FA enabled: Attempt password change without OTP → Should fail
   - With 2FA enabled: Change password with correct OTP → Should succeed
   - With 2FA disabled: Change password (no OTP needed) → Should succeed

3. **Add Payment Method Test**
   - With 2FA enabled: Add card without OTP → Should fail
   - With 2FA enabled: Add card with correct OTP → Should succeed
   - With 2FA disabled: Add card (no OTP needed) → Should succeed

### Test OTP Code
Use `123456` for testing (adjust based on your speakeasy setup)

## Configuration

### Backend Environment Variables
```
JWT_SECRET=your-secret-key
STRIPE_SECRET_KEY=your-stripe-key
```

### Frontend Environment Variables
```
VITE_API_URL=http://localhost:5000/api
```

## Future Enhancements

1. **Backup Codes**: Implement backup codes for account recovery
2. **Biometric Authentication**: Add fingerprint/face recognition for mobile
3. **WebAuthn Support**: Implement FIDO2/WebAuthn for hardware keys
4. **Recovery Email**: Allow recovery via alternative email address
5. **Grace Period**: Allow actions without 2FA for configurable grace period
6. **SMS 2FA**: Alternative 2FA method via SMS
7. **Risk-Based Authentication**: Require 2FA only for unusual activity

## Deployment Checklist

- [ ] Update production environment variables
- [ ] Configure rate limiting on verification endpoints
- [ ] Set up email notifications for sensitive actions
- [ ] Test 2FA flow end-to-end
- [ ] Monitor error logs for 2FA failures
- [ ] Document 2FA in user help center
- [ ] Create support docs for lost authenticator recovery
- [ ] Set up metrics/alerts for failed 2FA attempts

## Support Resources

- **Lost Authenticator**: Direct users to account recovery process
- **Not Receiving OTP**: Check device time sync with internet time
- **Technical Issues**: Log support ticket with error details

## References

- [Speakeasy Documentation](https://github.com/speakeasyjs/speakeasy)
- [TOTP RFC 6238](https://tools.ietf.org/html/rfc6238)
- [Google Authenticator](https://support.google.com/accounts/answer/1066447)
- [Authy](https://authy.com/)
