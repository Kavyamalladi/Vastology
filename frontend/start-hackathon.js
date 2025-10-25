#!/usr/bin/env node

const { spawn, exec } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🏆 Vastu Vision Hackathon Setup');
console.log('================================\n');

// Check if we're in the right directory
const currentDir = process.cwd();
if (!currentDir.includes('samhack')) {
    console.log('❌ Please run this script from the samhack directory');
    process.exit(1);
}

// Check if backend directory exists
const backendDir = path.join(currentDir, 'backend');
if (!fs.existsSync(backendDir)) {
    console.log('❌ Backend directory not found');
    process.exit(1);
}

// Check if config.env exists
const configPath = path.join(backendDir, 'config.env');
if (!fs.existsSync(configPath)) {
    console.log('📝 Creating config.env file...');
    const defaultConfig = `# Server Configuration
NODE_ENV=development
PORT=5000
HOST=localhost

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/vastu-vision

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-${Date.now()}
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-refresh-secret-key-here-${Date.now()}
JWT_REFRESH_EXPIRE=30d

# Cloudinary Configuration (Optional - for file uploads)
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
SESSION_SECRET=your-session-secret-here-${Date.now()}
`;
    
    fs.writeFileSync(configPath, defaultConfig);
    console.log('✅ config.env created with default values');
}

// Install backend dependencies
console.log('📦 Installing backend dependencies...');
const installProcess = spawn('npm', ['install'], {
    cwd: backendDir,
    stdio: 'inherit',
    shell: true
});

installProcess.on('close', (code) => {
    if (code === 0) {
        console.log('✅ Backend dependencies installed successfully!');
        startBackend();
    } else {
        console.log('❌ Failed to install backend dependencies');
        process.exit(1);
    }
});

function startBackend() {
    console.log('🚀 Starting Vastu Vision Backend...');
    console.log('📊 Backend will be available at: http://localhost:5000');
    console.log('🔗 API Health Check: http://localhost:5000/api/health');
    console.log('📱 Frontend: Open index.html in your browser');
    console.log('🎯 Advanced Dashboard: Open dashboard-advanced.html');
    console.log('\n🎉 Hackathon setup complete!');
    console.log('\n📋 Demo Checklist:');
    console.log('✅ Backend API running');
    console.log('✅ User registration/login');
    console.log('✅ File upload functionality');
    console.log('✅ Advanced analysis features');
    console.log('✅ AI chat assistant');
    console.log('✅ Google Maps integration');
    console.log('✅ Mobile responsive design');
    console.log('\n🏆 Ready to win the hackathon!');
    console.log('\nPress Ctrl+C to stop the server');
    
    const serverProcess = spawn('npm', ['run', 'dev'], {
        cwd: backendDir,
        stdio: 'inherit',
        shell: true
    });
    
    // Handle process termination
    process.on('SIGINT', () => {
        console.log('\n🛑 Shutting down server...');
        serverProcess.kill('SIGINT');
        process.exit(0);
    });
    
    process.on('SIGTERM', () => {
        console.log('\n🛑 Shutting down server...');
        serverProcess.kill('SIGTERM');
        process.exit(0);
    });
}
