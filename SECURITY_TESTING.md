# 🧪 Security Features Testing Guide

## Quick Setup & Testing

### Prerequisites
1. MongoDB running
2. Node.js installed
3. Both backend and frontend running

### Step 1: Configure Email (Required for Login Alerts)

Edit `traveler-backend/.env`:
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
```

**Get Gmail App Password:**
1. Go to https://myaccount.google.com/apppasswords
2. Create new app password
3. Copy and paste into `.env`

### Step 2: Start Servers

**Terminal 1 (Backend):**
```bash
cd traveler-backend
npm start
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

---

## 🧪 Test Scenarios

### ✅ Test 1: Password Change

1. **Login** to your account
2. Navigate to **Settings → Security & Password**
3. Click **"Change Password"**
4. Fill in:
   - Current Password: `youroldpass`
   - New Password: `yournewpass` (min 6 chars)
   - Confirm New Password: `yournewpass`
5. Click **"Update Password"**

**Expected Results:**
✅ Success message appears  
✅ Automatically logged out  
✅ Redirected to login page  
✅ Old password no longer works  
✅ New password works  
✅ Email confirmation received  

---

### ✅ Test 2: Two-Factor Authentication (2FA)

**Enable 2FA:**
1. Navigate to **Settings → Security & Password**
2. Click **"Enable"** under Two-Factor Authentication
3. QR code appears
4. **Download Google Authenticator** (or Authy) on your phone
5. **Scan the QR code**
6. Enter the **6-digit code** from the app
7. Click **"Verify & Enable"**

**Expected Results:**
✅ Success message: "2FA enabled"  
✅ Button changes to "Disable"  
✅ Confirmation email received  

**Test 2FA Login:**
1. **Logout** from your account
2. **Login** with email + password
3. After password verification, **OTP field appears**
4. Open **Google Authenticator**
5. Enter the **6-digit code**
6. Click **"Verify & Login"**

**Expected Results:**
✅ Login successful with valid OTP  
✅ Login fails with invalid OTP  
✅ OTP field only appears when 2FA is enabled  

**Disable 2FA:**
1. Go to **Settings → Security & Password**
2. Click **"Disable"**
3. Enter your **password** in the prompt
4. Confirm

**Expected Results:**
✅ 2FA disabled  
✅ Login no longer requires OTP  

---

### ✅ Test 3: Login Alerts

1. **Login** from your current browser
2. **Open incognito/private window** (or different browser)
3. **Login** with same account
4. **Check your email**

**Expected Results:**
✅ Email received with:
   - Login timestamp
   - Browser name (e.g., "Chrome 120")
   - Operating system (e.g., "Windows 10")
   - IP address
   - Location (if available)

**Toggle Login Alerts:**
1. Go to **Settings → Security & Password**
2. Find **"Login Alerts"** section
3. **Toggle switch** ON/OFF
4. Login from new browser again

**Expected Results:**
✅ When ON: Email sent for new device  
✅ When OFF: No email sent  

---

### ✅ Test 4: Trusted Devices

1. **Login** from multiple browsers:
   - Chrome
   - Firefox
   - Edge
   - Safari
   - Mobile browser
2. Go to **Settings → Security & Password**
3. Scroll to **"Trusted Devices"** section

**Expected Results:**
✅ All devices listed with:
   - Device name (e.g., "Chrome on Windows")
   - Location (e.g., "New York, USA")
   - Last login timestamp
   - IP address

**Remove Device:**
1. Click **"Remove"** on any device
2. Confirm removal

**Expected Results:**
✅ Device removed from list  
✅ That session is invalidated  

---

## 🔍 Backend Verification

### Check Database

**Connect to MongoDB:**
```bash
mongosh "your-connection-string"
```

**Check Users Collection:**
```javascript
db.users.findOne({ email: "your@email.com" })
```

**Expected Fields:**
```javascript
{
  _id: ObjectId(...),
  email: "your@email.com",
  password: "$2a$12$..." // bcrypt hash
  tokenVersion: 1,       // incremented on password change
  twoFASecret: "BASE32SECRET", // if 2FA enabled
  twoFAEnabled: true,    // if 2FA enabled
  loginAlerts: true,
  // ... other fields
}
```

**Check Trusted Devices:**
```javascript
db.trusteddevices.find().pretty()
```

**Expected Documents:**
```javascript
{
  _id: ObjectId(...),
  userId: ObjectId(...),
  deviceName: "Chrome on Windows",
  browser: "Chrome 120",
  os: "Windows 10",
  ip: "192.168.1.1",
  location: {
    city: "New York",
    country: "US",
    timezone: "America/New_York"
  },
  lastLogin: ISODate("2026-01-06T..."),
  deviceFingerprint: "...",
  createdAt: ISODate(...),
  updatedAt: ISODate(...)
}
```

---

## 🐛 Common Issues & Solutions

### ❌ Email Not Sending

**Problem:** Login alerts not received  
**Solution:**
1. Check `.env` has correct `EMAIL_USER` and `EMAIL_PASSWORD`
2. Use Gmail App Password (not regular password)
3. Check spam folder
4. Verify email in backend logs

**Test Email Service:**
```javascript
// In emailService.js, add test function:
const testEmail = async () => {
  await sendLoginAlert('test@test.com', 'Test User', {
    browser: 'Chrome',
    os: 'Windows',
    location: 'Test Location',
    ip: '127.0.0.1',
    timestamp: new Date().toLocaleString()
  });
};
```

---

### ❌ 2FA Code Not Working

**Problem:** Valid OTP rejected  
**Solutions:**
1. **Check device time** - Must be synced
2. **Wait for new code** - Codes expire every 30 seconds
3. **Re-scan QR code** - Secret might be incorrect
4. **Try 2 time windows** - Code accepts ±60 seconds

**Debug 2FA:**
```javascript
// In securityController.js verify2FA:
console.log('OTP entered:', otp);
console.log('Secret from DB:', user.twoFASecret);
console.log('Verification result:', verified);
```

---

### ❌ Device Not Tracked

**Problem:** Trusted devices list empty  
**Solutions:**
1. Check backend logs for errors
2. Verify `geoip-lite` installed
3. Confirm login reaches device tracking code

**Debug Device Tracking:**
```javascript
// In authController.js login:
console.log('User-Agent:', req.headers['user-agent']);
console.log('IP:', req.ip);
console.log('Device Info:', deviceInfo);
```

---

### ❌ Password Change Doesn't Logout

**Problem:** Old token still works after password change  
**Solutions:**
1. Verify `tokenVersion` incremented
2. Check middleware validates tokenVersion
3. Confirm JWT includes tokenVersion

**Debug Token Versioning:**
```javascript
// In auth middleware:
console.log('Token version:', decoded.tokenVersion);
console.log('User version:', user.tokenVersion);
```

---

## 📊 Security Checklist

Before going to production:

- [ ] Change `JWT_SECRET` to strong random string
- [ ] Configure real email service (or SMTP)
- [ ] Set up HTTPS for frontend and backend
- [ ] Add rate limiting to login endpoint
- [ ] Implement CORS properly
- [ ] Add database backups
- [ ] Set up monitoring/logging
- [ ] Test all features thoroughly
- [ ] Review error messages (don't leak info)
- [ ] Add account lockout after failed attempts

---

## 🎉 Success Indicators

Your security system is working if:

✅ **Password Change:**
- Old tokens stop working immediately
- Email confirmation received
- Forced to re-login

✅ **2FA:**
- QR code displayed correctly
- OTP validation works
- Login requires OTP when enabled

✅ **Login Alerts:**
- Emails sent for new devices
- Correct device info displayed
- Toggle works instantly

✅ **Trusted Devices:**
- All devices listed accurately
- Remove function works
- Location info correct

---

## 📱 Test with Real Devices

For comprehensive testing:

1. **Desktop:** Chrome, Firefox, Edge, Safari
2. **Mobile:** iOS Safari, Android Chrome
3. **Different Networks:** Home WiFi, Mobile data, VPN
4. **Different Locations:** (Use VPN to test)

Each should:
- Create new trusted device entry
- Trigger login alert (if enabled)
- Show correct device info

---

## 🔗 Quick Links

- Backend Security API: `http://localhost:5000/api/security`
- Frontend Settings: `http://localhost:5173/settings`
- MongoDB: Use MongoDB Compass to inspect data
- Email Logs: Check backend console

---

**Happy Testing! 🚀**

If you encounter any issues, check:
1. Backend console logs
2. Browser console logs
3. Network tab in DevTools
4. MongoDB data
