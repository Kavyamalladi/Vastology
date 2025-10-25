# Vastu Vision - Hackathon Deployment Guide

## 🚀 Complete Setup Guide for Hackathon Success

This guide will help you deploy the complete Vastu Vision application with all advanced features for a winning hackathon presentation.

## 📋 Prerequisites

### Required Software
- **Node.js** (v16.0.0 or higher)
- **MongoDB** (v4.4 or higher) or **MongoDB Atlas** account
- **Git** (for version control)
- **Cloudinary** account (for file storage)
- **Google Maps API** key (for location analysis)

### Optional but Recommended
- **Redis** (for caching and real-time features)
- **PM2** (for production process management)
- **Nginx** (for reverse proxy)

## 🛠️ Quick Setup (5 Minutes)

### 1. Clone and Setup Backend
```bash
cd samhack/backend
npm install
```

### 2. Environment Configuration
Create `config.env` file in `backend/` directory:
```env
# Server Configuration
NODE_ENV=development
PORT=5000
HOST=localhost

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/vastu-vision

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-refresh-secret-key-here
JWT_REFRESH_EXPIRE=30d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password
EMAIL_FROM=noreply@vastuvision.com

# Google Maps API (Optional)
GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# ML Model API (When Ready)
ML_API_URL=http://localhost:8000
ML_API_KEY=your-ml-api-key

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload Configuration
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/jpg,image/png,application/pdf

# CORS Configuration
CORS_ORIGIN=http://localhost:3000,http://127.0.0.1:3000

# Security
BCRYPT_ROUNDS=12
SESSION_SECRET=your-session-secret-here
```

### 3. Start Backend Server
```bash
# Development mode
npm run dev

# Or production mode
npm start
```

### 4. Seed Database (Optional)
```bash
npm run seed
```

### 5. Access the Application
- **Frontend**: Open `index.html` in your browser
- **Advanced Dashboard**: Open `dashboard-advanced.html`
- **API Health Check**: http://localhost:5000/api/health

## 🎯 Hackathon Features Showcase

### 1. **Complete Directional Analysis** 🎯
- Interactive compass with real-time scoring
- Google Maps integration for surroundings analysis
- Direction-specific recommendations
- Visual energy flow mapping

### 2. **Detailed Room-by-Room Insights** 🏠
- AI-powered room detection
- Element balance analysis
- Furniture placement suggestions
- Color therapy recommendations

### 3. **Energy Flow Mapping & Optimization** 🌊
- Real-time energy flow visualization
- Blocked area identification
- Flow optimization suggestions
- Interactive energy maps

### 4. **Element Mapping Throughout Home** 🗺
- Five elements analysis (Earth, Water, Fire, Air, Space)
- Element balance scoring
- Material and color suggestions
- Element-specific remedies

### 5. **Specific Remedies for All Issues** 💡
- Immediate, short-term, and long-term remedies
- Budget-based recommendations
- DIY vs Professional solutions
- Priority-based implementation

### 6. **Prosperity Zone Identification** 💰
- Wealth, Career, Health, Relationship zones
- Zone activation methods
- Enhancement tips
- Personalized zone scoring

### 7. **Entrance & Exit Optimization** 🚪
- Main entrance analysis
- Pathway optimization
- Threshold analysis
- Welcome energy enhancement

### 8. **Personalized Recommendations** 📊
- Lifestyle-based suggestions
- Budget-conscious recommendations
- Time-based implementation
- Family-specific advice

### 9. **Unlimited AI Chat Assistance** 💬
- Real-time Vastu consultation
- Context-aware responses
- Interactive Q&A
- Personalized advice

### 10. **Overall Vastu Score** 🏆
- Comprehensive scoring system
- Detailed breakdown
- Improvement areas
- Strength identification

## 🚀 Production Deployment

### Using PM2 (Recommended)
```bash
# Install PM2 globally
npm install -g pm2

# Start application
pm2 start server.js --name "vastu-vision"

# Save PM2 configuration
pm2 save
pm2 startup
```

### Using Docker (Optional)
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 📱 Mobile Responsiveness

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- All modern browsers

## 🔧 API Endpoints for Demo

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Advanced Analysis
- `POST /api/advanced/directional-analysis` - Complete directional analysis
- `POST /api/advanced/room-analysis` - Detailed room insights
- `POST /api/advanced/energy-flow` - Energy flow mapping
- `POST /api/advanced/element-mapping` - Element mapping
- `POST /api/advanced/remedies` - Specific remedies
- `POST /api/advanced/prosperity-zones` - Prosperity zones
- `POST /api/advanced/ai-chat` - AI chat assistance

### File Upload
- `POST /api/upload/files` - Upload floor plans
- `POST /api/upload/single` - Single file upload

### Vastu Knowledge
- `GET /api/vastu/rules` - Vastu rules database
- `GET /api/vastu/elements` - Five elements info
- `GET /api/vastu/directions` - Directions info

## 🎨 Frontend Features

### Interactive Dashboard
- Real-time analysis updates
- Animated visualizations
- Interactive compass
- Energy flow animations
- Element mapping charts

### Advanced UI Components
- Tabbed interface
- Modal dialogs
- Real-time chat
- File upload with preview
- Maps integration
- Responsive design

## 🔮 ML Model Integration (When Ready)

When your ML model is ready, update the `ML_API_URL` in `config.env` and the system will automatically integrate with your model for:
- Advanced floor plan analysis
- AI-powered recommendations
- Intelligent chat responses
- Personalized insights

## 📊 Demo Script for Hackathon

### 1. **Opening (30 seconds)**
- Show the landing page with Vastu Vision branding
- Highlight the AI-powered Vastu analysis concept

### 2. **User Registration (30 seconds)**
- Demonstrate the registration process
- Show the beautiful form with validation

### 3. **File Upload & Analysis (1 minute)**
- Upload a floor plan image
- Show the Google Maps integration
- Demonstrate the advanced analysis features

### 4. **Interactive Dashboard (2 minutes)**
- Show the directional analysis with compass
- Demonstrate element mapping
- Show energy flow visualization
- Highlight prosperity zones

### 5. **AI Chat Assistant (1 minute)**
- Ask questions about Vastu
- Show real-time responses
- Demonstrate personalized recommendations

### 6. **Results & Recommendations (1 minute)**
- Show comprehensive analysis results
- Highlight specific remedies
- Demonstrate the scoring system

### 7. **Mobile Responsiveness (30 seconds)**
- Show the app working on mobile
- Highlight responsive design

## 🏆 Winning Features to Highlight

1. **Innovation**: AI-powered Vastu analysis with ML integration
2. **Completeness**: Full-stack application with frontend and backend
3. **User Experience**: Beautiful, responsive design with animations
4. **Functionality**: Comprehensive analysis with real-time features
5. **Scalability**: Production-ready with proper architecture
6. **Integration**: Google Maps, Cloudinary, and ML model ready
7. **Security**: JWT authentication, rate limiting, input validation
8. **Performance**: Optimized with caching and compression

## 🚨 Troubleshooting

### Common Issues
1. **MongoDB Connection**: Ensure MongoDB is running
2. **Port Conflicts**: Change PORT in config.env if needed
3. **File Upload**: Check Cloudinary configuration
4. **CORS Issues**: Update CORS_ORIGIN in config.env

### Quick Fixes
```bash
# Restart backend
npm run dev

# Clear database
npm run seed

# Check logs
pm2 logs vastu-vision
```

## 📞 Support

For hackathon support:
- Check the console for error messages
- Verify all environment variables are set
- Ensure all dependencies are installed
- Test the API endpoints using the health check

## 🎉 Ready to Win!

Your Vastu Vision application is now ready for the hackathon with:
- ✅ Complete backend API
- ✅ Advanced frontend dashboard
- ✅ Google Maps integration
- ✅ AI chat assistant
- ✅ Real-time analysis
- ✅ Mobile responsiveness
- ✅ Production-ready deployment
- ✅ ML model integration ready

**Good luck with your hackathon! 🚀**
