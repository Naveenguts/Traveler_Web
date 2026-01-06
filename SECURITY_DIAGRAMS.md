# 🔐 Security Architecture Diagram

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        TRAVELER APP                              │
│                    Security Architecture                         │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│              │         │              │         │              │
│   FRONTEND   │ ◄─────► │   BACKEND    │ ◄─────► │   DATABASE   │
│   (React)    │         │  (Node.js)   │         │  (MongoDB)   │
│              │         │              │         │              │
└──────────────┘         └──────────────┘         └──────────────┘
       │                        │                        │
       │                        │                        │
       v                        v                        v
  User Interface          API Endpoints           Collections:
  - Login Form           - /security/*            - users
  - Settings Page        - /auth/login            - trusteddevices
  - 2FA Setup            - Authentication
  - Device List          - Validation
```

---

## 1. Password Change Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                     PASSWORD CHANGE FLOW                             │
└─────────────────────────────────────────────────────────────────────┘

USER                    FRONTEND                 BACKEND              DATABASE
 │                         │                         │                   │
 │  Enter Old + New        │                         │                   │
 │  Password              │                         │                   │
 ├────────────────────────►│                         │                   │
 │                         │  POST /change-password  │                   │
 │                         ├────────────────────────►│                   │
 │                         │  + Authorization        │                   │
 │                         │                         │  Find User        │
 │                         │                         ├──────────────────►│
 │                         │                         │◄──────────────────┤
 │                         │                         │  User Data        │
 │                         │                         │                   │
 │                         │                         │ bcrypt.compare()  │
 │                         │                         │ (verify old pwd)  │
 │                         │                         │                   │
 │                         │                         │ bcrypt.hash()     │
 │                         │                         │ (hash new pwd)    │
 │                         │                         │                   │
 │                         │                         │ tokenVersion++    │
 │                         │                         │                   │
 │                         │                         │  Update User      │
 │                         │                         ├──────────────────►│
 │                         │                         │                   │
 │                         │                         │ Send Email        │
 │                         │                         ├──────────────────►│
 │                         │  ✅ Success             │                   │
 │                         │  requiresRelogin: true  │                   │
 │                         │◄────────────────────────┤                   │
 │  ✅ Password Changed    │                         │                   │
 │  🔓 Logged Out         │                         │                   │
 │◄────────────────────────┤                         │                   │
 │                         │                         │                   │
 │  📧 Email Received      │                         │                   │
 │◄────────────────────────┴─────────────────────────┴───────────────────┤
 │                                                                        │
```

---

## 2. Two-Factor Authentication Setup

```
┌─────────────────────────────────────────────────────────────────────┐
│                      2FA SETUP FLOW                                  │
└─────────────────────────────────────────────────────────────────────┘

USER                    FRONTEND                 BACKEND              DATABASE
 │                         │                         │                   │
 │  Click "Enable 2FA"     │                         │                   │
 ├────────────────────────►│                         │                   │
 │                         │  POST /2fa/setup        │                   │
 │                         ├────────────────────────►│                   │
 │                         │                         │                   │
 │                         │                         │ speakeasy         │
 │                         │                         │ .generateSecret() │
 │                         │                         │                   │
 │                         │                         │ QRCode.toDataURL()│
 │                         │                         │                   │
 │                         │                         │ Save secret       │
 │                         │                         ├──────────────────►│
 │                         │  QR Code Image          │                   │
 │                         │◄────────────────────────┤                   │
 │  🎨 Display QR Code     │                         │                   │
 │◄────────────────────────┤                         │                   │
 │                         │                         │                   │
 │  📱 Scan with App       │                         │                   │
 │  (Google Authenticator) │                         │                   │
 │                         │                         │                   │
 │  Enter 6-digit OTP      │                         │                   │
 ├────────────────────────►│                         │                   │
 │                         │  POST /2fa/verify       │                   │
 │                         │  { otp: "123456" }      │                   │
 │                         ├────────────────────────►│                   │
 │                         │                         │                   │
 │                         │                         │ speakeasy.totp    │
 │                         │                         │ .verify(otp)      │
 │                         │                         │                   │
 │                         │                         │ twoFAEnabled=true │
 │                         │                         ├──────────────────►│
 │                         │                         │                   │
 │                         │                         │ Send Email        │
 │                         │  ✅ 2FA Enabled         │                   │
 │                         │◄────────────────────────┤                   │
 │  ✅ 2FA Active          │                         │                   │
 │◄────────────────────────┤                         │                   │
 │                         │                         │                   │
```

---

## 3. Login with 2FA

```
┌─────────────────────────────────────────────────────────────────────┐
│                    LOGIN WITH 2FA FLOW                               │
└─────────────────────────────────────────────────────────────────────┘

USER                    FRONTEND                 BACKEND              DATABASE
 │                         │                         │                   │
 │  Enter Email +          │                         │                   │
 │  Password              │                         │                   │
 ├────────────────────────►│                         │                   │
 │                         │  POST /auth/login       │                   │
 │                         │  { email, password }    │                   │
 │                         ├────────────────────────►│                   │
 │                         │                         │  Find User        │
 │                         │                         ├──────────────────►│
 │                         │                         │◄──────────────────┤
 │                         │                         │                   │
 │                         │                         │ bcrypt.compare()  │
 │                         │                         │ (verify password) │
 │                         │                         │                   │
 │                         │                         │ if(twoFAEnabled)  │
 │                         │  requires2FA: true      │    return early   │
 │                         │◄────────────────────────┤                   │
 │  📱 Show OTP Field      │                         │                   │
 │◄────────────────────────┤                         │                   │
 │                         │                         │                   │
 │  Enter OTP from App     │                         │                   │
 ├────────────────────────►│                         │                   │
 │                         │  POST /auth/login       │                   │
 │                         │  { email, password,     │                   │
 │                         │    otp: "123456" }      │                   │
 │                         ├────────────────────────►│                   │
 │                         │                         │                   │
 │                         │                         │ Verify Password   │
 │                         │                         │ Verify OTP        │
 │                         │                         │                   │
 │                         │                         │ Track Device      │
 │                         │                         │ (IP, User-Agent)  │
 │                         │                         │                   │
 │                         │                         │ GeoIP Lookup      │
 │                         │                         │ (get location)    │
 │                         │                         │                   │
 │                         │                         │ if(new device)    │
 │                         │                         │   Send Alert      │
 │                         │                         │                   │
 │                         │                         │ Save Device       │
 │                         │                         ├──────────────────►│
 │                         │                         │                   │
 │                         │                         │ Generate JWT      │
 │                         │  ✅ token + user data   │                   │
 │                         │◄────────────────────────┤                   │
 │  ✅ Logged In          │                         │                   │
 │◄────────────────────────┤                         │                   │
 │                         │                         │                   │
 │  📧 Login Alert         │                         │                   │
 │◄────────────────────────┴─────────────────────────┴───────────────────┤
 │  (if new device)        │                         │                   │
```

---

## 4. Device Tracking System

```
┌─────────────────────────────────────────────────────────────────────┐
│                    DEVICE TRACKING SYSTEM                            │
└─────────────────────────────────────────────────────────────────────┘

                          ON EVERY LOGIN
                                │
                                ▼
                    ┌───────────────────────┐
                    │  Extract Device Info   │
                    └───────────────────────┘
                                │
                ┌───────────────┼───────────────┐
                │               │               │
                ▼               ▼               ▼
         ┌──────────┐    ┌──────────┐   ┌──────────┐
         │    IP    │    │User-Agent│   │ GeoIP    │
         │ Address  │    │  Parse   │   │ Lookup   │
         └──────────┘    └──────────┘   └──────────┘
                │               │               │
                └───────────────┼───────────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │  Device Fingerprint   │
                    │  (UserAgent + IP)     │
                    └───────────────────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │   Check Database      │
                    │   Existing Device?    │
                    └───────────────────────┘
                                │
                    ┌───────────┴───────────┐
                    │                       │
                    ▼                       ▼
            ┌──────────────┐      ┌──────────────┐
            │  NEW DEVICE  │      │    KNOWN     │
            │              │      │   DEVICE     │
            └──────────────┘      └──────────────┘
                    │                       │
                    │                       │
                    ▼                       ▼
         ┌────────────────────┐   ┌────────────────────┐
         │ Send Login Alert   │   │ Update lastLogin   │
         │ Create Device Doc  │   │      Timestamp     │
         └────────────────────┘   └────────────────────┘
                    │                       │
                    └───────────┬───────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │   Save to MongoDB     │
                    │  trusteddevices       │
                    └───────────────────────┘

Device Document Structure:
{
  userId: ObjectId,
  deviceName: "Chrome on Windows",
  browser: "Chrome 120",
  os: "Windows 10",
  ip: "192.168.1.1",
  location: { city, country, timezone },
  userAgent: "Mozilla/5.0...",
  lastLogin: Date,
  deviceFingerprint: "unique-hash"
}
```

---

## 5. Token Versioning (Session Invalidation)

```
┌─────────────────────────────────────────────────────────────────────┐
│              TOKEN VERSIONING & SESSION MANAGEMENT                   │
└─────────────────────────────────────────────────────────────────────┘

                         User Document
                    ┌─────────────────────┐
                    │  tokenVersion: 0    │ ◄─── Initial
                    └─────────────────────┘
                              │
                              │  Login
                              ▼
                    ┌─────────────────────┐
                    │  JWT Generated      │
                    │  { id, email,       │
                    │    tokenVersion: 0 }│
                    └─────────────────────┘
                              │
                              │  API Requests
                              ▼
                    ┌─────────────────────┐
                    │  Middleware Check   │
                    │  Token v0 === DB v0 │
                    │  ✅ Valid           │
                    └─────────────────────┘
                              │
                              │  Password Changed
                              ▼
                    ┌─────────────────────┐
                    │  tokenVersion++     │
                    │  DB: v0 → v1        │
                    └─────────────────────┘
                              │
                              │  Old Token Used
                              ▼
                    ┌─────────────────────┐
                    │  Middleware Check   │
                    │  Token v0 !== DB v1 │
                    │  ❌ Invalid         │
                    │  Force Re-login     │
                    └─────────────────────┘
```

---

## 6. Email Notification System

```
┌─────────────────────────────────────────────────────────────────────┐
│                   EMAIL NOTIFICATION SYSTEM                          │
└─────────────────────────────────────────────────────────────────────┘

    TRIGGER EVENT              EMAIL SERVICE            EMAIL PROVIDER
         │                          │                         │
         │  New Device Login        │                         │
         ├─────────────────────────►│                         │
         │                          │  Nodemailer             │
         │                          │  +                      │
         │                          │  SMTP/Gmail             │
         │                          ├────────────────────────►│
         │                          │                         │
         │                          │                         │  📧 To User
         │                          │                         ├──────────►
         │                          │                         │
         │  Password Changed        │                         │
         ├─────────────────────────►│                         │
         │                          ├────────────────────────►│
         │                          │                         │  📧 To User
         │                          │                         ├──────────►
         │                          │                         │
         │  2FA Enabled             │                         │
         ├─────────────────────────►│                         │
         │                          ├────────────────────────►│
         │                          │                         │  📧 To User
         │                          │                         ├──────────►

Email Templates:
┌──────────────────────────────────────┐
│  🔐 Login Alert                      │
│  ├─ Device: Chrome on Windows       │
│  ├─ Location: New York, USA         │
│  ├─ IP: 192.168.1.1                 │
│  └─ Time: 2026-01-06 10:30 AM       │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│  ✅ Password Changed                 │
│  ├─ If not you, contact support     │
│  └─ Timestamp: 2026-01-06 10:45 AM  │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│  🔒 2FA Enabled                      │
│  ├─ Your account is now secure! 🎉  │
│  └─ If not you, contact support     │
└──────────────────────────────────────┘
```

---

## 7. Complete Security Stack

```
┌─────────────────────────────────────────────────────────────────────┐
│                     SECURITY TECHNOLOGY STACK                        │
└─────────────────────────────────────────────────────────────────────┘

LAYER                    TECHNOLOGY              PURPOSE
─────────────────────────────────────────────────────────────────────

Password Hashing         bcrypt                  Hash passwords
                        (12 rounds)              Secure storage

Authentication           JWT                     Stateless auth
                        (JSON Web Token)         Token-based

2FA/OTP                  speakeasy               TOTP generation
                        (TOTP)                   Time-based codes

QR Code                  qrcode                  Visual setup
                        (npm package)            2FA enrollment

Email Service            nodemailer              Send alerts
                        + Gmail SMTP             Notifications

Device Tracking          useragent               Parse browser/OS
                        + geoip-lite             Get location

Database                 MongoDB                 Store data
                        + Mongoose               Schema/models

Session Management       Token Versioning        Invalidate sessions
                        (Custom)                 Force logout

Frontend                 React                   User interface
                        + Axios                  API calls

API                      Express.js              REST endpoints
                        + Middleware             Auth validation
```

---

## 8. Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        DATA FLOW                                     │
└─────────────────────────────────────────────────────────────────────┘

    USER INPUT              PROCESSING                OUTPUT
        │                       │                       │
        │                       │                       │
    ┌───▼────┐           ┌──────▼──────┐         ┌────▼─────┐
    │ Email  │           │  Validation │         │  JWT     │
    │ Pass   │─────────► │  bcrypt     │────────►│  Token   │
    │        │           │  Database   │         │          │
    └────────┘           └─────────────┘         └──────────┘
        │                       │                       │
        │                       │                       │
    ┌───▼────┐           ┌──────▼──────┐         ┌────▼─────┐
    │ OTP    │           │  TOTP       │         │  Login   │
    │ Code   │─────────► │  Verify     │────────►│  Success │
    │        │           │  Time-based │         │          │
    └────────┘           └─────────────┘         └──────────┘
        │                       │                       │
        │                       │                       │
    ┌───▼────┐           ┌──────▼──────┐         ┌────▼─────┐
    │Request │           │  GeoIP      │         │  Device  │
    │Headers │─────────► │  Parse      │────────►│  Saved   │
    │        │           │  Fingerprint│         │          │
    └────────┘           └─────────────┘         └──────────┘
        │                       │                       │
        │                       │                       │
    ┌───▼────┐           ┌──────▼──────┐         ┌────▼─────┐
    │ Device │           │  Check DB   │         │  Email   │
    │  Info  │─────────► │  New Device?│────────►│  Alert   │
    │        │           │  Send Email │         │          │
    └────────┘           └─────────────┘         └──────────┘
```

---

## 9. Security Layers

```
┌─────────────────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS (Defense in Depth)                │
└─────────────────────────────────────────────────────────────────────┘

╔═══════════════════════════════════════════════════════════════╗
║  LAYER 1: Password Security                                   ║
║  ✓ Bcrypt hashing (12 rounds)                                ║
║  ✓ Salt per password                                          ║
║  ✓ Minimum length validation                                  ║
╚═══════════════════════════════════════════════════════════════╝
                            │
                            ▼
╔═══════════════════════════════════════════════════════════════╗
║  LAYER 2: Two-Factor Authentication                           ║
║  ✓ TOTP (Time-based One-Time Password)                       ║
║  ✓ 30-second rotation                                         ║
║  ✓ Authenticator app required                                 ║
╚═══════════════════════════════════════════════════════════════╝
                            │
                            ▼
╔═══════════════════════════════════════════════════════════════╗
║  LAYER 3: Session Management                                  ║
║  ✓ JWT with expiration (7 days)                              ║
║  ✓ Token versioning                                           ║
║  ✓ Automatic invalidation                                     ║
╚═══════════════════════════════════════════════════════════════╝
                            │
                            ▼
╔═══════════════════════════════════════════════════════════════╗
║  LAYER 4: Device Tracking                                     ║
║  ✓ IP address logging                                         ║
║  ✓ Device fingerprinting                                      ║
║  ✓ Location tracking                                          ║
╚═══════════════════════════════════════════════════════════════╝
                            │
                            ▼
╔═══════════════════════════════════════════════════════════════╗
║  LAYER 5: Notification System                                 ║
║  ✓ Real-time email alerts                                     ║
║  ✓ Security event notifications                               ║
║  ✓ User awareness                                             ║
╚═══════════════════════════════════════════════════════════════╝
```

---

## 10. API Request/Response Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│              API REQUEST/RESPONSE FLOW                               │
└─────────────────────────────────────────────────────────────────────┘

CLIENT REQUEST:
┌────────────────────────────────────────┐
│ POST /api/security/change-password     │
│ Headers:                               │
│   Authorization: Bearer eyJhbG...      │
│   Content-Type: application/json       │
│ Body:                                  │
│   {                                    │
│     "oldPassword": "current123",       │
│     "newPassword": "new123"            │
│   }                                    │
└────────────────────────────────────────┘
                  │
                  ▼
        ┌──────────────────┐
        │  Auth Middleware │
        │  Verify JWT      │
        │  Check Version   │
        └──────────────────┘
                  │
                  ▼
        ┌──────────────────┐
        │    Controller    │
        │  Verify Old Pwd  │
        │  Hash New Pwd    │
        │  Update DB       │
        │  Version++       │
        │  Send Email      │
        └──────────────────┘
                  │
                  ▼
SERVER RESPONSE:
┌────────────────────────────────────────┐
│ Status: 200 OK                         │
│ {                                      │
│   "message": "Password updated...",    │
│   "requiresRelogin": true              │
│ }                                      │
└────────────────────────────────────────┘
```

---

**Visual Guide Complete! 🎨**

These diagrams show exactly how the real security system works.
No shortcuts, no fake logic — production-ready architecture! 🔐
