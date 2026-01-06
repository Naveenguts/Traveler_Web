# 🌍 Traveler App - Full Stack Travel Platform

A complete travel planning application with **production-ready security features** including password management, two-factor authentication, login alerts, and device tracking.

## ✨ Features

### Core Features
- 🏖️ Browse destinations
- ✈️ Plan trips
- 📝 Write travel blogs
- 💳 Payment integration
- 👤 User profiles
- ⭐ Wishlist destinations

### 🔐 Security Features (NEW!)
- ✅ **Backend-Driven Password Change** - Bcrypt hashing, session invalidation
- ✅ **Two-Factor Authentication (2FA)** - TOTP with authenticator apps
- ✅ **Login Alerts** - Email notifications for new devices
- ✅ **Trusted Device Management** - Track and manage login devices
- ✅ **Session Management** - Token versioning for automatic logout
- ✅ **Email Notifications** - Real-time security alerts

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- Gmail account (for email alerts)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd traveler-project
```

2. **Setup Backend**
```bash
cd traveler-backend
npm install
```

3. **Configure Environment**
Create `.env` file in `traveler-backend/`:
```env
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-secret-key
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
PORT=5000
```

**Get Gmail App Password:**
1. Go to https://myaccount.google.com/apppasswords
2. Generate password for "Mail"
3. Copy to `EMAIL_PASSWORD`

4. **Setup Frontend**
```bash
cd ../frontend
npm install
```

5. **Start Development Servers**

**Terminal 1 - Backend:**
```bash
cd traveler-backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Access:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 🏗️ Project Structure

```
traveler-project/
├── frontend/                  # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   └── Settings/
│   │   │       └── Security.jsx    # Security settings UI
│   │   ├── pages/
│   │   │   ├── Login.jsx          # Login with 2FA
│   │   │   └── Settings.jsx
│   │   └── styles/
│   │       └── Security.css       # Security UI styles
│   └── package.json
│
├── traveler-backend/          # Node.js backend
│   ├── controllers/
│   │   ├── authController.js      # Enhanced login
│   │   └── securityController.js  # Security features
│   ├── models/
│   │   ├── User.js               # User with security fields
│   │   └── TrustedDevice.js      # Device tracking
│   ├── routes/
│   │   ├── auth.js
│   │   └── security.js           # Security endpoints
│   ├── services/
│   │   └── emailService.js       # Email notifications
│   ├── middleware/
│   │   └── auth.js               # JWT validation
│   └── package.json
│
└── Documentation/
    ├── SECURITY_IMPLEMENTATION.md  # Technical details
    ├── SECURITY_TESTING.md         # Testing guide
    ├── SECURITY_QUICKSTART.md      # Quick reference
    ├── SECURITY_DIAGRAMS.md        # Visual diagrams
    └── SECURITY_SUMMARY.md         # Overview
```

## 🔐 Security Implementation

### Architecture

```
USER → FRONTEND → BACKEND → DATABASE
                     ↓
                EMAIL SERVICE
```

### Technologies Used

| Feature | Technology | Purpose |
|---------|-----------|---------|
| Password Hashing | bcrypt | Secure password storage |
| Authentication | JWT | Token-based auth |
| 2FA | speakeasy | TOTP generation |
| QR Codes | qrcode | 2FA setup |
| Email | nodemailer | Notifications |
| Device Tracking | useragent, geoip-lite | Device info |
| Database | MongoDB | Data persistence |

### API Endpoints

#### Authentication
```
POST   /api/auth/register    Register new user
POST   /api/auth/login       Login (with 2FA support)
GET    /api/auth/profile     Get user profile
```

#### Security
```
POST   /api/security/change-password     Change password
POST   /api/security/2fa/setup           Generate QR code
POST   /api/security/2fa/verify          Enable 2FA
POST   /api/security/2fa/disable         Disable 2FA
GET    /api/security/devices             List trusted devices
DELETE /api/security/devices/:id         Remove device
PUT    /api/security/login-alerts        Toggle alerts
GET    /api/security/settings            Get security settings
```

## 📱 Usage Guide

### Password Change
1. Navigate to **Settings → Security & Password**
2. Click **"Change Password"**
3. Enter current and new password
4. Submit → Automatic logout on all devices

### Enable 2FA
1. Go to **Settings → Security & Password**
2. Click **"Enable"** under Two-Factor Authentication
3. Scan QR code with Google Authenticator
4. Enter 6-digit code to verify
5. 2FA is now active!

### Login with 2FA
1. Enter email + password
2. After verification, OTP field appears
3. Open authenticator app
4. Enter 6-digit code
5. Login successful!

### Manage Devices
1. Go to **Settings → Security & Password**
2. Scroll to **"Trusted Devices"**
3. View all devices you've logged in from
4. Click **"Remove"** to logout from that device

### Login Alerts
- Automatically enabled
- Receive email when logging in from new device
- Toggle ON/OFF in settings

## 🧪 Testing

### Quick Test Scenarios

**Test Password Change:**
```
1. Login
2. Settings → Change Password
3. Enter passwords
4. ✅ Should logout automatically
```

**Test 2FA:**
```
1. Enable 2FA in settings
2. Scan QR code
3. Verify with OTP
4. Logout and login
5. ✅ Should ask for OTP
```

**Test Login Alerts:**
```
1. Open incognito window
2. Login with same account
3. ✅ Check email for alert
```

**Test Device Tracking:**
```
1. Login from multiple browsers
2. Check Settings → Trusted Devices
3. ✅ All devices should be listed
```

See [SECURITY_TESTING.md](SECURITY_TESTING.md) for detailed test scenarios.

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [SECURITY_IMPLEMENTATION.md](SECURITY_IMPLEMENTATION.md) | Complete technical documentation |
| [SECURITY_TESTING.md](SECURITY_TESTING.md) | Testing guide and troubleshooting |
| [SECURITY_QUICKSTART.md](SECURITY_QUICKSTART.md) | Quick reference card |
| [SECURITY_DIAGRAMS.md](SECURITY_DIAGRAMS.md) | Visual architecture diagrams |
| [SECURITY_SUMMARY.md](SECURITY_SUMMARY.md) | Executive summary |

## 🔧 Configuration

### Email Service (Required)

The app uses Gmail SMTP for sending security alerts. Setup:

1. **Enable 2-Step Verification** on Google Account
2. **Generate App Password:**
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Copy the 16-character password
3. **Add to `.env`:**
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
   ```

### MongoDB

**Local:**
```env
MONGODB_URI=mongodb://localhost:27017/traveler-db
```

**Atlas:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/traveler-db
```

### JWT Secret

Generate secure secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 🗄️ Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  email: String,
  password: String,        // bcrypt hash
  name: String,
  tokenVersion: Number,    // For session invalidation
  twoFASecret: String,     // TOTP secret
  twoFAEnabled: Boolean,   // 2FA status
  loginAlerts: Boolean,    // Alert preference
  preferences: Object,
  createdAt: Date,
  updatedAt: Date
}
```

### TrustedDevices Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  deviceName: String,      // "Chrome on Windows"
  browser: String,
  os: String,
  ip: String,
  location: {
    city: String,
    country: String,
    timezone: String
  },
  userAgent: String,
  lastLogin: Date,
  deviceFingerprint: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔒 Security Best Practices

### Implemented
✅ Password hashing with bcrypt (12 rounds)  
✅ JWT with expiration and versioning  
✅ TOTP-based 2FA  
✅ Session invalidation on password change  
✅ Email notifications for security events  
✅ Device tracking and fingerprinting  
✅ GeoIP location detection  
✅ Input validation  
✅ Error handling without info leaks  

### Recommended for Production
- [ ] HTTPS everywhere
- [ ] Rate limiting on login
- [ ] CORS configuration
- [ ] Database backups
- [ ] Monitoring and logging
- [ ] Account lockout after failed attempts
- [ ] Security headers (helmet.js)
- [ ] Environment variable validation

## 🐛 Troubleshooting

### Email Not Sending
**Problem:** Login alerts not received  
**Solution:**
- Verify `EMAIL_USER` and `EMAIL_PASSWORD` in `.env`
- Use Gmail App Password (not regular password)
- Check spam folder
- Review backend console for errors

### 2FA Code Invalid
**Problem:** Valid OTP rejected  
**Solutions:**
- Ensure device time is synced
- Wait for new code (30-second rotation)
- Re-scan QR code
- Try within 60-second window

### Devices Not Tracked
**Problem:** Trusted devices list empty  
**Solutions:**
- Check backend logs for errors
- Verify `geoip-lite` installed correctly
- Confirm MongoDB connection

### Password Change Doesn't Logout
**Problem:** Old token still works  
**Solutions:**
- Verify `tokenVersion` incremented in database
- Check middleware validates tokenVersion
- Confirm JWT includes tokenVersion in payload

See [SECURITY_TESTING.md](SECURITY_TESTING.md) for more solutions.

## 🚀 Deployment

### Environment Variables

Ensure these are set in production:

```env
# Required
MONGODB_URI=production-mongodb-uri
JWT_SECRET=strong-random-secret
EMAIL_USER=production-email@company.com
EMAIL_PASSWORD=app-password

# Optional
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://yourdomain.com
```

### Security Checklist

Before deploying:
- [ ] Change JWT_SECRET to strong random value
- [ ] Configure production email service
- [ ] Enable HTTPS
- [ ] Set up CORS properly
- [ ] Add rate limiting
- [ ] Configure firewall
- [ ] Set up monitoring
- [ ] Database backups enabled
- [ ] Review all environment variables
- [ ] Test all security features

## 📊 Tech Stack

### Frontend
- React 18
- React Router
- Axios
- Vite

### Backend
- Node.js
- Express
- MongoDB + Mongoose
- JWT
- Bcrypt
- Speakeasy (2FA)
- Nodemailer
- QRCode
- GeoIP-lite
- Useragent

## 👥 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **Security inspiration:** Google, GitHub, Facebook authentication systems
- **2FA:** Speakeasy library
- **Email service:** Nodemailer
- **Device tracking:** GeoIP-lite, Useragent

## 📞 Support

For issues or questions:
- Check [SECURITY_TESTING.md](SECURITY_TESTING.md) for troubleshooting
- Review [SECURITY_IMPLEMENTATION.md](SECURITY_IMPLEMENTATION.md) for technical details
- Open an issue on GitHub

## 🎉 What Makes This Special?

✅ **Production-Ready Security** - Not just demos, real implementations  
✅ **Backend-Driven** - All security logic on server  
✅ **Database-Backed** - Real data persistence  
✅ **Industry Standards** - Bcrypt, TOTP, JWT  
✅ **Real Notifications** - Email service integration  
✅ **Device Tracking** - GeoIP and User-Agent parsing  
✅ **Complete Documentation** - Guides, diagrams, testing  

**No shortcuts. Real security.** 🔐

---

**Built with ❤️ for real-world applications**

**Version:** 1.0.0  
**Last Updated:** January 2026
