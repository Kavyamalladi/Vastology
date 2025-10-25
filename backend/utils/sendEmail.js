const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Email templates
const emailTemplates = {
  emailVerification: (data) => ({
    subject: 'Verify Your Vastu Vision Account',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email - Vastu Vision</title>
        <style>
          body { font-family: 'Poppins', Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #2A9D8F, #1E8449); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #2A9D8F; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏠 Vastu Vision</h1>
            <p>Welcome to the world of harmonious living!</p>
          </div>
          <div class="content">
            <h2>Hello ${data.firstName}!</h2>
            <p>Thank you for registering with Vastu Vision. To complete your registration and start your journey towards harmonious living, please verify your email address.</p>
            <p>Click the button below to verify your email:</p>
            <a href="${data.verificationUrl}" class="button">Verify Email Address</a>
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background: #e9ecef; padding: 10px; border-radius: 5px;">${data.verificationUrl}</p>
            <p>This verification link will expire in 24 hours.</p>
            <p>If you didn't create an account with Vastu Vision, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 Vastu Vision. All rights reserved.</p>
            <p>Bridging ancient wisdom with modern technology.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  passwordReset: (data) => ({
    subject: 'Reset Your Vastu Vision Password',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password - Vastu Vision</title>
        <style>
          body { font-family: 'Poppins', Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #2A9D8F, #1E8449); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #2A9D8F; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .warning { background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏠 Vastu Vision</h1>
            <p>Password Reset Request</p>
          </div>
          <div class="content">
            <h2>Hello ${data.firstName}!</h2>
            <p>We received a request to reset your password for your Vastu Vision account.</p>
            <p>Click the button below to reset your password:</p>
            <a href="${data.resetUrl}" class="button">Reset Password</a>
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background: #e9ecef; padding: 10px; border-radius: 5px;">${data.resetUrl}</p>
            <div class="warning">
              <strong>⚠️ Important:</strong> This password reset link will expire in 10 minutes for security reasons.
            </div>
            <p>If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 Vastu Vision. All rights reserved.</p>
            <p>Bridging ancient wisdom with modern technology.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  welcome: (data) => ({
    subject: 'Welcome to Vastu Vision!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Vastu Vision</title>
        <style>
          body { font-family: 'Poppins', Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #2A9D8F, #1E8449); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #2A9D8F; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .feature { background: white; padding: 20px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #2A9D8F; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏠 Vastu Vision</h1>
            <p>Welcome to harmonious living!</p>
          </div>
          <div class="content">
            <h2>Hello ${data.firstName}!</h2>
            <p>Welcome to Vastu Vision! We're excited to have you join our community of people who believe in creating harmonious living spaces.</p>
            
            <h3>What you can do with Vastu Vision:</h3>
            <div class="feature">
              <strong>🧠 AI-Powered Analysis:</strong> Get intelligent Vastu recommendations for your space
            </div>
            <div class="feature">
              <strong>👁️ 3D Visualization:</strong> See your space in stunning 3D with energy flow indicators
            </div>
            <div class="feature">
              <strong>🧭 Expert Guidance:</strong> Access to Vastu experts and personalized consultations
            </div>
            <div class="feature">
              <strong>📱 Mobile Access:</strong> Access your Vastu analysis anywhere, anytime
            </div>
            
            <p>Ready to get started? Upload your floor plan and begin your journey towards harmonious living!</p>
            <a href="${data.dashboardUrl}" class="button">Start Your Analysis</a>
          </div>
          <div class="footer">
            <p>&copy; 2024 Vastu Vision. All rights reserved.</p>
            <p>Bridging ancient wisdom with modern technology.</p>
          </div>
        </div>
      </body>
      </html>
    `
  })
};

// Send email function
const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();
    
    // Get email template if template is specified
    let emailOptions = { ...options };
    if (options.template && emailTemplates[options.template]) {
      const template = emailTemplates[options.template](options.data);
      emailOptions = {
        ...emailOptions,
        subject: template.subject,
        html: template.html
      };
    }

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: emailOptions.email,
      subject: emailOptions.subject,
      text: emailOptions.text,
      html: emailOptions.html
    });

    console.log('Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
};

module.exports = sendEmail;
