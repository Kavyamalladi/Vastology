# Vastology - AI-Powered Vastu Shastra Platform

A comprehensive web application that combines traditional Vastu Shastra principles with modern AI technology to provide personalized architectural and energy flow analysis.

## 🚀 Features

- **AI-Powered Analysis**: Machine learning models for Vastu compliance analysis
- **Interactive Dashboard**: Real-time visualization of energy flows and recommendations
- **User Authentication**: Secure login and registration system
- **File Upload**: Support for floor plans and architectural drawings
- **Advanced Analytics**: Detailed reports and insights
- **Responsive Design**: Works on desktop and mobile devices

## 🏗️ Project Structure

```
Vastology/
├── backend/                 # Node.js backend API
│   ├── config/            # Database and configuration
│   ├── middleware/        # Custom middleware
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── services/          # Business logic services
│   ├── ml/                # Machine learning components
│   └── server.js          # Main server file
├── frontend/              # Frontend HTML/CSS/JS
│   ├── *.html             # Web pages
│   ├── *.css              # Stylesheets
│   └── *.js               # JavaScript files
├── package.json           # Root package configuration
└── .env.example          # Environment variables template
```

## 🚀 Deployment on Vercel

### Prerequisites
- GitHub repository with your code
- MongoDB Atlas account (for production database)
- Vercel account

### GitHub Deployment

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect it's a Node.js project

3. **Set Environment Variables**
   In Vercel dashboard → Project Settings → Environment Variables:

### Environment Variables for Production

Set these in your Vercel dashboard:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vastu-vision
JWT_SECRET=your-production-jwt-secret
NODE_ENV=production
CORS_ORIGIN=https://your-domain.vercel.app
```

## 🛠️ Local Development

### Backend Setup
```bash
cd backend
npm install
npm run dev
```

### Frontend
The frontend is served statically by the backend server.

## 📊 API Endpoints

- `GET /` - Home page
- `GET /login` - Login page
- `GET /register` - Registration page
- `GET /dashboard` - User dashboard
- `GET /dashboard-advanced` - Advanced analytics
- `GET /api/health` - Health check
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/analysis` - Vastu analysis
- `POST /api/upload` - File upload

## 🤖 Machine Learning

The ML pipeline includes:
- Data preprocessing (`ml/data_processor.py`)
- Model training (`ml/model_trainer.py`)
- Prediction service (`ml/predict.py`)
- Pre-trained models for immediate use

## 🔧 Configuration

### Database
- MongoDB for user data and analysis results
- Redis for caching (optional)

### Security
- JWT authentication
- Rate limiting
- CORS protection
- Input sanitization

## 📱 Frontend Pages

- **Home** (`/`) - Landing page with features overview
- **Login** (`/login`) - User authentication
- **Register** (`/register`) - New user registration
- **Dashboard** (`/dashboard`) - Basic user dashboard
- **Advanced Dashboard** (`/dashboard-advanced`) - Detailed analytics
- **Test** (`/test`) - Development testing page

## 🚀 Production Deployment

1. **Vercel Configuration**
   - Automatic deployments from Git
   - Environment variables management
   - Custom domain support

2. **Database Setup**
   - MongoDB Atlas for production database
   - Connection string in environment variables

3. **File Storage**
   - Cloudinary for image uploads
   - Local storage for development

## 📈 Monitoring

- Health check endpoint: `/api/health`
- Error logging and monitoring
- Performance metrics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API endpoints

---

**Built with ❤️ for the Vastu Vision Team**
