# 2FA Implementation Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         TRAVELER APP - 2FA                           │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌────────────────────────┐   ┌────────────────────────┐            │
│  │   Security.jsx         │   │ PaymentMethods.jsx     │            │
│  ├────────────────────────┤   ├────────────────────────┤            │
│  │ • Change Password      │   │ • Add Card             │            │
│  │ • Enable/Disable 2FA   │   │ • Delete Card          │            │
│  │ • Manage Devices       │   │ • Set Default Card     │            │
│  └────────────────────────┘   └────────────────────────┘            │
│           │                              │                           │
│           └──────────────┬───────────────┘                           │
│                          │                                           │
│                          ▼                                           │
│           ┌──────────────────────────────┐                          │
│           │ TwoFAVerificationModal.jsx   │                          │
│           ├──────────────────────────────┤                          │
│           │ • Input OTP Code             │                          │
│           │ • Validate Format            │                          │
│           │ • Show Errors                │                          │
│           │ • Handle Submit/Cancel       │                          │
│           └──────────────────────────────┘                          │
│                          │                                           │
│                          ▼                                           │
│           ┌──────────────────────────────┐                          │
│           │  Include OTP in Request      │                          │
│           │  Send API Call with OTP      │                          │
│           └──────────────────────────────┘                          │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  │ HTTP Request
                                  │ {action, otp}
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    BACKEND (Node.js/Express)                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌────────────────────────┐   ┌────────────────────────┐            │
│  │  Security Routes       │   │  Payment Routes        │            │
│  ├────────────────────────┤   ├────────────────────────┤            │
│  │ /change-password       │   │ /add                   │            │
│  │ /2fa/disable           │   │ /default/:id           │            │
│  │ /2fa/verify            │   │ /:id (DELETE)          │            │
│  └────────────────────────┘   └────────────────────────┘            │
│           │                              │                           │
│           └──────────────┬───────────────┘                           │
│                          │                                           │
│                          ▼                                           │
│           ┌──────────────────────────────┐                          │
│           │  Auth Middleware             │                          │
│           │  (Verify JWT Token)          │                          │
│           └──────────────────────────────┘                          │
│                          │                                           │
│                          ▼                                           │
│           ┌──────────────────────────────┐                          │
│           │  verify2FA Middleware        │                          │
│           ├──────────────────────────────┤                          │
│           │ 1. Get User from Database    │                          │
│           │ 2. Check if 2FA Enabled      │                          │
│           │    ├─ No 2FA → Next Handler  │                          │
│           │    └─ 2FA Enabled:           │                          │
│           │       3. Verify OTP Code     │                          │
│           │          ├─ Valid → Next     │                          │
│           │          └─ Invalid → Error  │                          │
│           └──────────────────────────────┘                          │
│                          │                                           │
│                          ▼                                           │
│        ┌───────────────────────────────────┐                        │
│        │  Controller Handler               │                        │
│        ├───────────────────────────────────┤                        │
│        │ changePassword() /                │                        │
│        │ addPaymentMethod() /              │                        │
│        │ setDefault() /                    │                        │
│        │ deleteMethod()                    │                        │
│        └───────────────────────────────────┘                        │
│                          │                                           │
│                          ▼                                           │
│        ┌───────────────────────────────────┐                        │
│        │  Database (MongoDB)               │                        │
│        ├───────────────────────────────────┤                        │
│        │ • User Collection                 │                        │
│        │   - password                      │                        │
│        │   - twoFASecret                   │                        │
│        │   - twoFAEnabled                  │                        │
│        │ • PaymentMethod Collection        │                        │
│        │   - paymentMethodId               │                        │
│        │   - isDefault                     │                        │
│        └───────────────────────────────────┘                        │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  │ HTTP Response
                                  │ {success, message}
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────┐  ┌────────────────┐  ┌────────────────────┐  │
│  │ Authenticator    │  │  Email Service │  │  Stripe (Payments) │  │
│  │ App (User)       │  │                │  │                    │  │
│  │ • Google Auth    │  │ • Password     │  │ • Card Processing  │  │
│  │ • Authy          │  │   Changed      │  │ • Payment Methods  │  │
│  │ • Microsoft Auth │  │ • 2FA Enabled  │  │ • Verification     │  │
│  └──────────────────┘  └────────────────┘  └────────────────────┘  │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

## Request/Response Flow

### Scenario 1: Action WITHOUT 2FA Verification

```
Frontend                          Backend
   │                                │
   │─── POST /sensitive ──────────►│
   │     (no OTP)                  │
   │                               ├─ Check user.twoFAEnabled = false
   │                               │
   │                               ├─ Execute action
   │                               │
   │                               ├─ Update database
   │                               │
   │◄────── 200 Success ──────────┤
   │
   └─ Update UI
   └─ Show success message
```

### Scenario 2: Action WITH 2FA Verification

```
Frontend                          Backend                    User
   │                                │                         │
   │─── POST /sensitive ──────────►│                          │
   │     (no OTP)                  │                          │
   │                               ├─ Check user.twoFAEnabled = true
   │                               │
   │◄────── 403 2FA Required ──────┤
   │
   ├─ Show 2FA Modal
   │
   └─ Waiting for OTP ──────────────────────────────────────►│
                                                             │
                                              Enter 6-digit code
                                              from authenticator
                                                             │
   │◄───────────── User enters OTP ──────────────────────────┤
   │
   │─── POST /sensitive ──────────►│
   │     {data, otp: "123456"}     │
   │                               ├─ Verify OTP with speakeasy
   │                               │
   │                               ├─ OTP valid? YES
   │                               │
   │                               ├─ Execute action
   │                               │
   │                               ├─ Update database
   │                               │
   │◄────── 200 Success ──────────┤
   │
   └─ Update UI
   └─ Show success message
```

### Scenario 3: Invalid OTP Attempt

```
Frontend                          Backend
   │                                │
   │─── POST /sensitive ──────────►│
   │     {data, otp: "000000"}     │
   │                               ├─ Verify OTP with speakeasy
   │                               │
   │                               ├─ OTP valid? NO
   │                               │
   │◄────── 401 Invalid OTP ──────┤
   │
   ├─ Show error message
   │
   ├─ Keep modal open
   │
   └─ Allow user to retry
```

## Component Interaction Map

```
┌────────────────────────────────────────────────────────┐
│                    Settings Page                        │
├────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────┐    ┌──────────────────┐           │
│  │  Security Tab   │    │ Payments Tab     │           │
│  └────────┬────────┘    └────────┬─────────┘           │
│           │                      │                     │
│           ▼                      ▼                     │
│  ┌─────────────────────────────────────────┐           │
│  │     TwoFAVerificationModal              │           │
│  ├─────────────────────────────────────────┤           │
│  │ • Rendered conditionally                │           │
│  │ • Appears on top of any component      │           │
│  │ • Handles all 2FA verifications        │           │
│  │ • Passes OTP back to parent            │           │
│  └─────────────────────────────────────────┘           │
│                                                         │
└────────────────────────────────────────────────────────┘
```

## Data Flow Sequence

### Change Password with 2FA

```
User Action:
1. Click "Change Password"

Frontend State:
2. Show password form
3. setShowPasswordForm(true)

User Input:
4. Enter old password: "current123"
5. Enter new password: "newpass456"
6. Click "Update Password"

Frontend Logic:
7. Validate passwords
8. Check: securitySettings.twoFAEnabled?
9. If YES: setPendingSensitiveAction('changePassword')
10. setShow2FAVerification(true)

User Interaction:
11. Modal appears
12. User opens authenticator app
13. User enters 6-digit code: "123456"
14. User clicks "Verify"

Frontend Request:
15. POST /api/security/change-password
    {
      oldPassword: "current123",
      newPassword: "newpass456",
      otp: "123456"
    }

Backend Processing:
16. Middleware verify2FA() runs
17. Fetch user from database
18. Check user.twoFAEnabled === true
19. Verify OTP using speakeasy
20. If valid: pass to next handler
21. If invalid: return 401 error

Controller Handler:
22. changePassword() receives request
23. Compare oldPassword with bcrypt hash
24. If match: hash newPassword
25. Update user.password
26. Increment user.tokenVersion
27. Save user to database
28. Send password change email

Frontend Response:
29. Receive 200 success response
30. Update UI state
31. Close modal: setShow2FAVerification(false)
32. Show success message
33. Clear form data
34. Logout user (requiresRelogin: true)

User Experience:
35. Success message displayed
36. Redirect to login after 2 seconds
37. User logs in with new password
```

## Error Handling Flow

```
API Request
    │
    ├─ Missing OTP
    │  └─ Return 403 Forbidden
    │     message: "2FA verification required"
    │     requires2FA: true
    │     Frontend: Show modal
    │
    ├─ Invalid OTP
    │  └─ Return 401 Unauthorized
    │     message: "Invalid 2FA code"
    │     requires2FA: true
    │     Frontend: Show error in modal, allow retry
    │
    ├─ OTP format invalid
    │  └─ Client-side validation (frontend only)
    │     Frontend: Prevent submission if not 6 digits
    │
    ├─ User not found
    │  └─ Return 404 Not Found
    │     Frontend: Show error, redirect to login
    │
    ├─ Password incorrect
    │  └─ Return 401 Unauthorized
    │     Frontend: Show error message
    │
    └─ Server error
       └─ Return 500 Internal Server Error
          Frontend: Show generic error message
```

## State Management (Frontend)

### Security Component State
```javascript
{
  show2FAVerification: boolean,      // Modal visibility
  pendingSensitiveAction: string,    // 'changePassword' | 'disable2FA' | null
  pendingActionData: object,         // Stores action-specific data
  securitySettings: {
    twoFAEnabled: boolean,
    loginAlerts: boolean
  }
}
```

### PaymentMethods Component State
```javascript
{
  show2FAVerification: boolean,      // Modal visibility
  pendingAction: string,             // 'addPayment' | 'deletePayment' | 'setDefault'
  pendingActionData: object,         // { id: paymentMethodId }
  userSettings: {
    twoFAEnabled: boolean
  }
}
```

## Security Layers

```
Layer 1: Frontend Validation
├─ Check 2FA enabled status
├─ Validate OTP format (6 digits)
├─ Show helpful error messages
└─ Prevent form submission without valid OTP

Layer 2: Transport Security
├─ HTTPS/TLS for all requests
├─ JWT token authentication
├─ OTP sent in request body only
└─ No OTP in logs or URLs

Layer 3: Backend Validation
├─ Verify JWT token
├─ Check user.twoFAEnabled
├─ Validate OTP with speakeasy
├─ Allow time window tolerance
└─ Return appropriate error codes

Layer 4: Database Security
├─ Store twoFASecret encrypted
├─ Hash passwords with bcrypt
├─ Use indexed queries
└─ Implement access controls

Layer 5: User Protection
├─ Email notifications for actions
├─ Device tracking
├─ Login alerts
└─ Account recovery options
```

## Performance Considerations

```
Optimization Strategy:

1. Frontend
   ├─ Modal renders conditionally (only when needed)
   ├─ OTP input validated in real-time (no server calls)
   ├─ Debounced user 2FA status fetch
   └─ Memoized API headers

2. Backend
   ├─ 2FA verification only if enabled (quick check)
   ├─ OTP validation cached per time window
   ├─ Database queries indexed on userId
   └─ Error responses returned quickly

3. Network
   ├─ Single API call per action
   ├─ OTP sent once (no resends needed)
   ├─ Timeout for OTP verification (30 seconds)
   └─ Connection pooling for DB
```

## File Dependencies

```
TwoFAVerificationModal.jsx
├─ React (core)
├─ TwoFAVerificationModal.css
└─ No other dependencies

Security.jsx
├─ React
├─ axios (API calls)
├─ AuthContext (auth state)
├─ TwoFAVerificationModal (sub-component)
└─ CSS styles

PaymentMethods.jsx
├─ React
├─ axios (API calls)
├─ @stripe/react-stripe-js (payments)
├─ AuthContext (auth state)
├─ TwoFAVerificationModal (sub-component)
└─ CSS styles

verify2FA.js (middleware)
├─ speakeasy (OTP verification)
├─ User model

securityController.js
├─ bcryptjs (password hashing)
├─ speakeasy (OTP)
├─ QRCode (2FA setup)
├─ User model
├─ emailService

paymentController.js
├─ speakeasy (OTP)
├─ stripe (payments)
├─ User model
├─ PaymentMethod model
```

## Testing Matrix

```
┌──────────────┬──────────────┬──────────────┬──────────────┐
│    Action    │ 2FA Disabled │ 2FA Enabled  │   Result     │
├──────────────┼──────────────┼──────────────┼──────────────┤
│   Change PW  │    No OTP    │  With OTP    │     ✅       │
│   Disable 2FA│     N/A      │ PW + OTP     │     ✅       │
│   Enable 2FA │    No OTP    │  With OTP    │     ✅       │
│ Add Payment  │    No OTP    │  With OTP    │     ✅       │
│ Delete Pay   │    No OTP    │  With OTP    │     ✅       │
│  Set Default │    No OTP    │  With OTP    │     ✅       │
└──────────────┴──────────────┴──────────────┴──────────────┘
```

This completes the comprehensive 2FA architecture documentation!
