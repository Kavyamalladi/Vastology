# Vastu Vision Backend API

A comprehensive backend API for the Vastu Vision platform - an AI-powered Vastu Shastra analysis application.

## 🚀 Features

- **User Authentication & Authorization**
  - JWT-based authentication
  - Email verification
  - Password reset functionality
  - Role-based access control

- **File Upload & Management**
  - Cloudinary integration for file storage
  - Image optimization with Sharp
  - Support for JPG, PNG, and PDF files
  - File size and type validation

- **Vastu Analysis Engine**
  - AI-powered floor plan analysis
  - Five elements integration
  - Directional analysis
  - Room-specific recommendations
  - Comprehensive remedy suggestions

- **Vastu Knowledge Base**
  - Extensive Vastu rules database
  - Search and filter functionality
  - Category-based organization
  - Expert-curated content

- **User Management**
  - Profile management
  - Preferences customization
  - Analysis history
  - Statistics and insights

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: Cloudinary
- **Image Processing**: Sharp
- **Email Service**: Nodemailer
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: Express Validator

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd samhack/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp config.env.example config.env
   ```
   
   Update the `config.env` file with your configuration:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/vastu-vision
   JWT_SECRET=your-super-secret-jwt-key
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   EMAIL_HOST=smtp.gmail.com
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-email-password
   ```

4. **Database Setup**
   - Install MongoDB locally or use MongoDB Atlas
   - Update the `MONGODB_URI` in your config.env

5. **Seed the database** (optional)
   ```bash
   npm run seed
   ```

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "gender": "male",
  "password": "Password@123",
  "confirmPassword": "Password@123"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Password@123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### File Upload Endpoints

#### Upload Files for Analysis
```http
POST /api/upload/files
Authorization: Bearer <token>
Content-Type: multipart/form-data

files: [file1, file2, ...]
title: "My Floor Plan Analysis"
description: "Analysis of my new home"
```

### Analysis Endpoints

#### Get All Analyses
```http
GET /api/analysis?page=1&limit=10
```

#### Create Analysis
```http
POST /api/analysis
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My Home Analysis",
  "description": "Analysis of my new home",
  "floorPlan": {
    "orientation": "north",
    "dimensions": {
      "length": 50,
      "width": 30,
      "unit": "sqft"
    }
  }
}
```

#### Start Analysis Processing
```http
POST /api/analysis/:id/start
Authorization: Bearer <token>
```

### Vastu Knowledge Endpoints

#### Get Vastu Rules
```http
GET /api/vastu/rules?category=direction&importance=high
```

#### Search Rules
```http
GET /api/vastu/rules/search?q=kitchen&category=kitchen
```

#### Get Five Elements Info
```http
GET /api/vastu/elements
```

#### Get Directions Info
```http
GET /api/vastu/directions
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

## 📊 Database Models

### User Model
- Personal information (name, email, phone, gender)
- Authentication data (password, verification tokens)
- Preferences and settings
- Subscription information
- Role-based access control

### Analysis Model
- User association
- File attachments
- Floor plan data
- Vastu analysis results
- Status tracking
- Public/private visibility

### VastuRule Model
- Rule information (name, category, description)
- Directional and elemental associations
- Importance and impact ratings
- Remedies and recommendations
- Version control

## 🛡️ Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Request throttling
- **Input Validation**: Data sanitization
- **Password Hashing**: bcrypt encryption
- **JWT Security**: Token-based authentication

## 📈 Performance Optimizations

- **Image Optimization**: Sharp for image processing
- **File Compression**: Gzip compression
- **Database Indexing**: Optimized queries
- **Caching**: Response caching strategies
- **Rate Limiting**: API usage limits

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NODE_ENV` | Environment (development/production) | Yes |
| `PORT` | Server port | Yes |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | JWT signing secret | Yes |
| `JWT_EXPIRE` | JWT expiration time | Yes |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Yes |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Yes |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Yes |
| `EMAIL_HOST` | SMTP host | Yes |
| `EMAIL_USER` | SMTP username | Yes |
| `EMAIL_PASS` | SMTP password | Yes |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Email: support@vastuvision.com
- Documentation: [API Docs](link-to-docs)
- Issues: [GitHub Issues](link-to-issues)

## 🔄 Changelog

### v1.0.0
- Initial release
- User authentication
- File upload functionality
- Vastu analysis engine
- Knowledge base integration
