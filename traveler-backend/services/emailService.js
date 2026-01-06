const nodemailer = require('nodemailer');

// Configure your email service
// For production, use environment variables
const transporter = nodemailer.createTransport({
  service: 'gmail', // or 'smtp.gmail.com'
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'your-app-password' // Use App Password for Gmail
  }
});

// Send login alert email
const sendLoginAlert = async (userEmail, userName, deviceInfo) => {
  const { browser, os, location, ip, timestamp } = deviceInfo;

  const mailOptions = {
    from: process.env.EMAIL_USER || 'your-email@gmail.com',
    to: userEmail,
    subject: '🔐 New Login Alert - Traveler App',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">New Login Detected</h2>
        <p>Hi ${userName},</p>
        <p>We detected a new login to your account. If this was you, you can safely ignore this email.</p>
        
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Login Details:</h3>
          <p><strong>📅 Time:</strong> ${timestamp}</p>
          <p><strong>🌐 Browser:</strong> ${browser}</p>
          <p><strong>💻 Operating System:</strong> ${os}</p>
          <p><strong>📍 Location:</strong> ${location}</p>
          <p><strong>🔢 IP Address:</strong> ${ip}</p>
        </div>
        
        <p style="color: #d9534f;">
          ⚠️ If this wasn't you, please secure your account immediately:
        </p>
        <ul>
          <li>Change your password</li>
          <li>Enable two-factor authentication</li>
          <li>Review your trusted devices</li>
        </ul>
        
        <p style="color: #666; font-size: 12px; margin-top: 30px;">
          This is an automated security alert from Traveler App.
        </p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Login alert sent to:', userEmail);
  } catch (error) {
    console.error('Error sending login alert:', error);
    // Don't throw error - email failure shouldn't block login
  }
};

// Send password change confirmation
const sendPasswordChangeEmail = async (userEmail, userName) => {
  const mailOptions = {
    from: process.env.EMAIL_USER || 'your-email@gmail.com',
    to: userEmail,
    subject: '✅ Password Changed Successfully - Traveler App',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #5cb85c;">Password Changed Successfully</h2>
        <p>Hi ${userName},</p>
        <p>Your password has been changed successfully.</p>
        
        <p style="color: #d9534f;">
          ⚠️ If you didn't make this change, please contact support immediately.
        </p>
        
        <p style="color: #666; font-size: 12px; margin-top: 30px;">
          This is an automated security notification from Traveler App.
        </p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Password change confirmation sent to:', userEmail);
  } catch (error) {
    console.error('Error sending password change email:', error);
  }
};

// Send 2FA enabled confirmation
const send2FAEnabledEmail = async (userEmail, userName) => {
  const mailOptions = {
    from: process.env.EMAIL_USER || 'your-email@gmail.com',
    to: userEmail,
    subject: '🔒 Two-Factor Authentication Enabled - Traveler App',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #5cb85c;">Two-Factor Authentication Enabled</h2>
        <p>Hi ${userName},</p>
        <p>Two-factor authentication has been successfully enabled on your account.</p>
        <p>Your account is now more secure! 🎉</p>
        
        <p style="color: #d9534f;">
          ⚠️ If you didn't enable this, please contact support immediately.
        </p>
        
        <p style="color: #666; font-size: 12px; margin-top: 30px;">
          This is an automated security notification from Traveler App.
        </p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending 2FA enabled email:', error);
  }
};

module.exports = {
  sendLoginAlert,
  sendPasswordChangeEmail,
  send2FAEnabledEmail
};
