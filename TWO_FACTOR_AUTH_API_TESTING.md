# 2FA API Testing Guide

## Base URL
```
http://localhost:5000/api
```

## Authentication Header (All Requests)
```
Authorization: Bearer <JWT_TOKEN>
```

## Security Endpoints

### 1. Get Security Settings
Check if user has 2FA enabled

**Request:**
```bash
GET /security/settings
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "twoFAEnabled": true,
  "loginAlerts": true
}
```

---

### 2. Setup 2FA (Generate QR Code)
Initialize 2FA setup

**Request:**
```bash
POST /security/2fa/setup
Authorization: Bearer <token>
Content-Type: application/json
```

**Response (200):**
```json
{
  "message": "Scan this QR code with Google Authenticator or Authy",
  "qrCode": "data:image/png;base64,...",
  "secret": "JBSWY3DPEBLW64TMMQ======",
  "manualEntry": "otpauth://totp/Traveler%20App..."
}
```

---

### 3. Verify & Enable 2FA
Enable 2FA with OTP verification

**Request:**
```bash
POST /security/2fa/verify
Authorization: Bearer <token>
Content-Type: application/json

{
  "otp": "123456"
}
```

**Response (200):**
```json
{
  "message": "Two-factor authentication enabled successfully",
  "twoFAEnabled": true
}
```

**Response (401) - Invalid OTP:**
```json
{
  "message": "Invalid OTP code"
}
```

---

### 4. Change Password (Without 2FA)
Change password when 2FA is disabled

**Request:**
```bash
POST /security/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "oldPassword": "current123",
  "newPassword": "newpass456"
}
```

**Response (200):**
```json
{
  "message": "Password updated successfully. Please login again with your new password.",
  "requiresRelogin": true
}
```

---

### 5. Change Password (With 2FA - Step 1)
Request without OTP to initiate 2FA challenge

**Request:**
```bash
POST /security/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "oldPassword": "current123",
  "newPassword": "newpass456"
}
```

**Response (403) - 2FA Required:**
```json
{
  "message": "2FA verification required",
  "requires2FA": true,
  "twoFAEnabled": true
}
```

---

### 6. Change Password (With 2FA - Step 2)
Request WITH OTP to complete action

**Request:**
```bash
POST /security/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "oldPassword": "current123",
  "newPassword": "newpass456",
  "otp": "123456"
}
```

**Response (200):**
```json
{
  "message": "Password updated successfully. Please login again with your new password.",
  "requiresRelogin": true
}
```

**Response (401) - Invalid OTP:**
```json
{
  "message": "Invalid 2FA code",
  "requires2FA": true
}
```

---

### 7. Disable 2FA (With 2FA - Step 1)
Request without OTP

**Request:**
```bash
POST /security/2fa/disable
Authorization: Bearer <token>
Content-Type: application/json

{
  "password": "current123"
}
```

**Response (403) - 2FA Required:**
```json
{
  "message": "2FA verification required",
  "requires2FA": true,
  "twoFAEnabled": true
}
```

---

### 8. Disable 2FA (With 2FA - Step 2)
Request WITH OTP

**Request:**
```bash
POST /security/2fa/disable
Authorization: Bearer <token>
Content-Type: application/json

{
  "password": "current123",
  "otp": "123456"
}
```

**Response (200):**
```json
{
  "message": "Two-factor authentication disabled successfully",
  "twoFAEnabled": false
}
```

**Response (401) - Invalid OTP:**
```json
{
  "message": "Invalid 2FA code",
  "requires2FA": true
}
```

---

## Payment Endpoints

### 1. Create Setup Intent
Initialize payment setup

**Request:**
```bash
POST /payments/setup-intent
Authorization: Bearer <token>
Content-Type: application/json
```

**Response (200):**
```json
{
  "clientSecret": "seti_1234567890_secret_1234567890"
}
```

---

### 2. Add Payment Method (Without 2FA)
Add card when 2FA is disabled

**Request:**
```bash
POST /payments/add
Authorization: Bearer <token>
Content-Type: application/json

{
  "paymentMethodId": "pm_1234567890",
  "makeDefault": true
}
```

**Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "userId": "507f1f77bcf86cd799439012",
  "stripeCustomerId": "cus_1234567890",
  "paymentMethodId": "pm_1234567890",
  "brand": "visa",
  "last4": "4242",
  "expMonth": 12,
  "expYear": 2025,
  "isDefault": true,
  "createdAt": "2024-01-11T10:00:00.000Z"
}
```

---

### 3. Add Payment Method (With 2FA - Step 1)
Request without OTP

**Request:**
```bash
POST /payments/add
Authorization: Bearer <token>
Content-Type: application/json

{
  "paymentMethodId": "pm_1234567890",
  "makeDefault": true
}
```

**Response (403) - 2FA Required:**
```json
{
  "message": "2FA verification required",
  "requires2FA": true,
  "twoFAEnabled": true
}
```

---

### 4. Add Payment Method (With 2FA - Step 2)
Request WITH OTP

**Request:**
```bash
POST /payments/add
Authorization: Bearer <token>
Content-Type: application/json

{
  "paymentMethodId": "pm_1234567890",
  "makeDefault": true,
  "otp": "123456"
}
```

**Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "brand": "visa",
  "last4": "4242",
  "expMonth": 12,
  "expYear": 2025,
  "isDefault": true
}
```

---

### 5. Set Default Payment Method (With 2FA - Step 1)
Request without OTP

**Request:**
```bash
PUT /payments/default/{paymentMethodId}
Authorization: Bearer <token>
Content-Type: application/json
```

**Response (403) - 2FA Required:**
```json
{
  "message": "2FA verification required",
  "requires2FA": true,
  "twoFAEnabled": true
}
```

---

### 6. Set Default Payment Method (With 2FA - Step 2)
Request WITH OTP

**Request:**
```bash
PUT /payments/default/{paymentMethodId}
Authorization: Bearer <token>
Content-Type: application/json

{
  "otp": "123456"
}
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "brand": "visa",
  "last4": "4242",
  "isDefault": true
}
```

---

### 7. Delete Payment Method (With 2FA - Step 1)
Request without OTP

**Request:**
```bash
DELETE /payments/{paymentMethodId}
Authorization: Bearer <token>
Content-Type: application/json
```

**Response (403) - 2FA Required:**
```json
{
  "message": "2FA verification required",
  "requires2FA": true,
  "twoFAEnabled": true
}
```

---

### 8. Delete Payment Method (With 2FA - Step 2)
Request WITH OTP

**Request:**
```bash
DELETE /payments/{paymentMethodId}
Authorization: Bearer <token>
Content-Type: application/json

{
  "otp": "123456"
}
```

**Response (200):**
```json
{
  "success": true
}
```

---

### 9. List Payment Methods
Get all payment methods (no 2FA required)

**Request:**
```bash
GET /payments
Authorization: Bearer <token>
Content-Type: application/json
```

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "brand": "visa",
    "last4": "4242",
    "expMonth": 12,
    "expYear": 2025,
    "isDefault": true,
    "createdAt": "2024-01-11T10:00:00.000Z"
  },
  {
    "_id": "507f1f77bcf86cd799439012",
    "brand": "mastercard",
    "last4": "5555",
    "expMonth": 06,
    "expYear": 2026,
    "isDefault": false,
    "createdAt": "2024-01-10T15:30:00.000Z"
  }
]
```

---

## Testing with cURL

### Test Change Password with 2FA

**Step 1: Try without OTP (should get 403)**
```bash
curl -X POST http://localhost:5000/api/security/change-password \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "oldPassword": "current123",
    "newPassword": "newpass456"
  }'
```

**Step 2: With OTP (should succeed)**
```bash
curl -X POST http://localhost:5000/api/security/change-password \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "oldPassword": "current123",
    "newPassword": "newpass456",
    "otp": "123456"
  }'
```

---

## Testing with Postman

1. **Create Environment Variables:**
   - `base_url`: http://localhost:5000/api
   - `token`: <your_jwt_token>
   - `otp`: 123456 (or actual OTP from authenticator)

2. **Create Request with Pre-request Script:**
   ```javascript
   // Auto-update OTP if needed
   pm.environment.set("otp", "123456");
   ```

3. **Use Variables in Request:**
   ```json
   {
     "oldPassword": "current123",
     "newPassword": "newpass456",
     "otp": "{{otp}}"
   }
   ```

---

## Common Status Codes

| Code | Meaning | Action |
|------|---------|--------|
| 200 | Success | Action completed |
| 201 | Created | Resource created |
| 400 | Bad Request | Check request format |
| 401 | Unauthorized | Invalid OTP or credentials |
| 403 | Forbidden | 2FA verification required |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Check server logs |

---

## OTP Generation for Testing

Use an authenticator app:
- **Google Authenticator**
- **Authy**
- **Microsoft Authenticator**
- **FreeOTP**

Or use a test library to generate OTP codes programmatically.

---

## Notes

- OTP codes are valid for 30 seconds
- Each OTP can only be used once
- Device time must be synchronized with internet time
- JWT token must be valid and not expired
- All requests require Authorization header
