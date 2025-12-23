# MongoDB Atlas Configuration Guide

## 🚀 Quick Setup Steps

### 1. Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account (no credit card required)
3. Create a new organization and project

### 2. Create a Cluster
1. Click **"Build a Database"**
2. Choose **M0 FREE** tier (perfect for development)
3. Select your preferred cloud provider & region (choose closest to your users)
4. Name your cluster (e.g., `traveler-cluster`)
5. Click **"Create"**

### 3. Configure Database Access
1. Go to **Database Access** (left sidebar)
2. Click **"Add New Database User"**
3. Choose authentication method: **Password**
4. Username: `traveler-admin` (or your choice)
5. Password: Generate a secure password or create your own
   - ⚠️ **Important**: Save this password securely!
6. Database User Privileges: Select **"Read and write to any database"**
7. Click **"Add User"**

### 4. Configure Network Access
1. Go to **Network Access** (left sidebar)
2. Click **"Add IP Address"**
3. For development: Click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - ⚠️ For production: Add specific IP addresses of your deployment servers
4. Click **"Confirm"**

### 5. Get Your Connection String
1. Go back to **Database** (left sidebar)
2. Click **"Connect"** button on your cluster
3. Choose **"Connect your application"**
4. Driver: **Node.js**
5. Version: Select latest (currently 6.0 or later)
6. Copy the connection string, it looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### 6. Update Your .env File
1. Open `.env` file in `traveler-backend/`
2. Replace the `MONGODB_URI` with your connection string
3. Replace `<username>` with your database username
4. Replace `<password>` with your database password
5. Add `/traveler-app` before the `?` to specify database name:

```env
MONGODB_URI=mongodb+srv://traveler-admin:YourPassword123@cluster0.xxxxx.mongodb.net/traveler-app?retryWrites=true&w=majority
```

### 7. Update JWT Secret (Security)
Generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Copy the output and replace `JWT_SECRET` in `.env`

## 🔒 Security Best Practices

### For Development
- ✅ Use `.env` file for local development
- ✅ Add `.env` to `.gitignore` (never commit credentials!)
- ✅ Use `.env.example` as a template for team members

### For Production
1. **Whitelist Specific IPs**: Remove "0.0.0.0/0", add only your server IPs
2. **Strong Passwords**: Use complex passwords for database users
3. **Environment Variables**: Use hosting platform's environment variable system
4. **JWT Secret**: Generate a unique, random 64+ character string
5. **Enable Encryption**: MongoDB Atlas has encryption at rest by default
6. **Regular Backups**: Enable automated backups (available in Atlas)
7. **Monitoring**: Set up alerts in MongoDB Atlas dashboard

## 📊 MongoDB Atlas Dashboard Features

### Database Collections
View and manage your collections:
- `users` - User accounts
- `destinations` - Travel destinations
- `trips` - User trips and bookings

### Metrics & Monitoring
- Real-time performance metrics
- Query performance insights
- Connection statistics
- Storage usage

### Alerts
Set up alerts for:
- High CPU usage
- Connection spikes
- Storage limits
- Security threats

## 🧪 Testing Your Connection

Start your backend server:
```bash
cd traveler-backend
npm start
```

You should see:
```
✅ MongoDB Connected: cluster0-shard-00-00.xxxxx.mongodb.net
📊 Database: traveler-app
🚀 Server is running on port 5000
```

Test the health endpoint:
```bash
curl http://localhost:5000/api/health
```

## 🌐 Deployment Configuration

### Environment Variables for Hosting Platforms

#### Render / Railway / Heroku
Add these environment variables in your platform's dashboard:
- `MONGODB_URI` = Your Atlas connection string
- `JWT_SECRET` = Your generated secret
- `NODE_ENV` = production
- `PORT` = (usually auto-assigned)

#### Vercel / Netlify (for frontend)
Add API base URL:
- `VITE_API_URL` = Your backend API URL

## 🔍 Troubleshooting

### Connection Timeout
- ✅ Check Network Access whitelist in Atlas
- ✅ Verify username and password are correct
- ✅ Ensure special characters in password are URL-encoded

### Authentication Failed
- ✅ Double-check username and password
- ✅ Ensure user has proper permissions
- ✅ Try resetting the database user password

### Database Not Found
- ✅ Add database name in connection string: `/traveler-app?`
- ✅ Database will be created automatically on first write operation

## 📚 Additional Resources

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [MongoDB Node.js Driver](https://www.mongodb.com/docs/drivers/node/current/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [Connection String Reference](https://www.mongodb.com/docs/manual/reference/connection-string/)

## 💡 Pro Tips

1. **Use Database Indexes**: Improve query performance
2. **Monitor Slow Queries**: Atlas provides query performance insights
3. **Set up Backups**: Enable automated backups in Atlas
4. **Use Schema Validation**: Define validation rules for your collections
5. **Connection Pooling**: Mongoose handles this automatically
6. **Upgrade When Needed**: Start with M0 (Free), upgrade as you grow

---

**Need Help?** Check the MongoDB Atlas support documentation or their community forums.
