# 🔐 Authentication System Documentation

## Overview

This traveler application now has a complete JWT-based authentication system connecting React frontend to MongoDB via Express backend.

## Architecture Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                          React Frontend                          │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌───────────┐ │
│  │  Login.jsx │  │ SignUp.jsx │  │AuthContext │  │ Protected │ │
│  │            │  │            │  │            │  │   Routes  │ │
│  └──────┬─────┘  └──────┬─────┘  └──────┬─────┘  └─────┬─────┘ │
│         │                │               │              │        │
│         └────────────────┴───────────────┴──────────────┘        │
│                             │                                    │
│                             │  HTTP Requests (JWT Token)         │
└─────────────────────────────┼────────────────────────────────────┘
                              │
                         ┌────▼────┐
                         │         │
                    ┌────┴─────────┴────┐
                    │  Express Backend   │
                    │   (Port 5000)      │
                    └─────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
           ┌────────▼────────┐  ┌──────▼──────────┐
           │  Auth Routes     │  │  Auth Middleware │
           │  /api/auth/*     │  │   (JWT Verify)   │
           └────────┬─────────┘  └─────────────────┘
                    │
           ┌────────▼────────┐
           │ Auth Controller  │
           │ (bcrypt + JWT)   │
           └────────┬─────────┘
                    │
           ┌────────▼────────┐
           │   User Model     │
           │   (Mongoose)     │
           └────────┬─────────┘
                    │
           ┌────────▼────────┐
           │    MongoDB       │
           │  Users Collection│
           └──────────────────┘
```

## Backend Implementation

### 1. User Model (`models/User.js`)
- Schema for user data (name, email, password, preferences)
- Stores hashed passwords (using bcryptjs)
- Includes user preferences (language, currency, notifications)

### 2. Auth Controller (`controllers/authController.js`)
- **register**: Creates new user with hashed password, returns JWT token
- **login**: Validates credentials, returns JWT token
- **getProfile**: Returns current user info (protected route)
- **updateProfile**: Updates user profile (protected route)

### 3. Auth Routes (`routes/auth.js`)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user (requires auth)
- `PUT /api/auth/profile` - Update user profile (requires auth)

### 4. Auth Middleware (`middleware/auth.js`)
- Verifies JWT tokens from Authorization header
- Protects routes requiring authentication
- Decodes token and attaches user info to request

### 5. Server Configuration (`server.js`)
- Registers auth routes with `/api/auth` prefix
- Includes CORS middleware for frontend connection

## Frontend Implementation

### 1. Login Component (`pages/Login.jsx`)
```javascript
// Makes POST request to /api/auth/login
// Receives token and user data
// Stores in AuthContext and localStorage
```

### 2. SignUp Component (`pages/SignUp.jsx`)
```javascript
// Makes POST request to /api/auth/register
// Receives token and user data
// Automatically logs user in after registration
```

### 3. Auth Context (`context/AuthContext.jsx`)
```javascript
// Manages user state and token
// Stores token in localStorage
// Includes token in all API requests via Authorization header
// Provides authentication methods to all components
```

## How Authentication Works

### Registration Flow
1. User fills signup form (name, email, password)
2. Frontend sends POST to `/api/auth/register`
3. Backend validates input, checks if email exists
4. Password is hashed using bcryptjs (10 salt rounds)
5. User is saved to MongoDB
6. JWT token is generated (expires in 7 days)
7. Token and user data sent back to frontend
8. Frontend stores token in localStorage and AuthContext
9. User is automatically logged in

### Login Flow
1. User fills login form (email, password)
2. Frontend sends POST to `/api/auth/login`
3. Backend finds user by email
4. Password is verified using bcryptjs.compare()
5. JWT token is generated (expires in 7 days)
6. Token and user data sent back to frontend
7. Frontend stores token in localStorage and AuthContext
8. User can now access protected features

### Protected API Requests
```javascript
// Example: Booking a trip
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
};

fetch('/api/trips', {
  method: 'POST',
  headers,
  body: JSON.stringify(tripData)
});
```

## JWT Token Structure

```json
{
  "id": "user_mongodb_id",
  "email": "user@example.com",
  "name": "User Name",
  "iat": 1703001234,
  "exp": 1703605834
}
```

## Environment Variables

### Backend (`.env`)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/traveler-app
NODE_ENV=development
JWT_SECRET=traveler-app-super-secret-jwt-key-2024-change-this-in-production
```

⚠️ **Important**: Change `JWT_SECRET` to a secure random string in production!

## Security Features

1. **Password Hashing**: All passwords hashed with bcryptjs (10 rounds)
2. **JWT Tokens**: Secure token-based authentication
3. **Token Expiry**: Tokens expire after 7 days
4. **HTTP-only approach**: Token stored in localStorage (consider httpOnly cookies for production)
5. **CORS**: Configured to allow frontend access
6. **Input Validation**: Email format, password length requirements

## Testing the Authentication

### 1. Register a New User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 3. Access Protected Route
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## Common Issues & Solutions

### Issue: "Please login to book trips" appears even after login
**Solution**: 
- Check if token is being stored: `localStorage.getItem('traveler_token')`
- Check browser console for errors
- Verify backend server is running on port 5000
- Ensure MongoDB is running

### Issue: CORS errors
**Solution**: 
- Backend has CORS enabled in `server.js`
- Check if frontend is making requests to `http://localhost:5000`

### Issue: Token expired
**Solution**: 
- Tokens expire after 7 days
- User needs to log in again
- Consider implementing refresh tokens for production

### Issue: MongoDB connection failed
**Solution**: 
- Ensure MongoDB is running: `mongod` or MongoDB Compass
- Check connection string in `.env` file
- Default: `mongodb://localhost:27017/traveler-app`

## Production Deployment Checklist

- [ ] Change JWT_SECRET to a strong random string
- [ ] Use environment variables for all secrets
- [ ] Implement HTTPS/SSL
- [ ] Consider httpOnly cookies instead of localStorage
- [ ] Implement refresh tokens
- [ ] Add rate limiting for auth endpoints
- [ ] Implement account verification (email)
- [ ] Add password reset functionality
- [ ] Add "Remember Me" functionality
- [ ] Implement 2FA (two-factor authentication)
- [ ] Set up proper error logging
- [ ] Add API request throttling
- [ ] Implement CSRF protection

## API Endpoints Summary

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login user |
| GET | `/api/auth/profile` | Yes | Get current user |
| PUT | `/api/auth/profile` | Yes | Update user profile |
| GET | `/api/trips/user/:userId` | Optional* | Get user's trips |
| POST | `/api/trips` | Optional* | Create new trip |
| PUT | `/api/trips/:id` | Optional* | Update trip |
| DELETE | `/api/trips/:id` | Optional* | Delete trip |

*Auth optional but recommended for production

## Next Steps

1. ✅ Backend authentication routes created
2. ✅ Frontend login/signup connected to backend
3. ✅ JWT token management implemented
4. ✅ Protected routes using auth middleware
5. 🔜 Protect trip routes with authentication
6. 🔜 Add password reset functionality
7. 🔜 Add email verification
8. 🔜 Implement refresh tokens

## Support

For issues or questions:
1. Check browser console for errors
2. Check backend terminal for server errors
3. Verify MongoDB is running
4. Ensure all npm packages are installed
5. Check `.env` file configuration
