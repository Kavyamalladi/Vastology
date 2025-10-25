const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Import models
const Analysis = require('../models/Analysis');

// Import middleware
const { protect, uploadRateLimit } = require('../middleware/auth');
const { validateFileUpload } = require('../middleware/validation');

// Import utilities
const catchAsync = require('../utils/catchAsync');

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/jpg,image/png,application/pdf').split(',');
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, PNG, and PDF files are allowed.'), false);
  }
};

// Configure multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB
    files: 5 // Maximum 5 files
  }
});

// Helper function to upload file to Cloudinary
const uploadToCloudinary = async (file, folder = 'vastu-vision') => {
  try {
    let uploadOptions = {
      folder,
      resource_type: 'auto',
      quality: 'auto',
      fetch_format: 'auto'
    };

    // If it's an image, optimize it
    if (file.mimetype.startsWith('image/')) {
      const optimizedBuffer = await sharp(file.buffer)
        .resize(1920, 1080, { 
          fit: 'inside',
          withoutEnlargement: true 
        })
        .jpeg({ quality: 85 })
        .toBuffer();

      uploadOptions.format = 'jpg';
      file.buffer = optimizedBuffer;
    }

    const result = await cloudinary.uploader.upload(
      `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
      uploadOptions
    );

    return {
      public_id: result.public_id,
      url: result.secure_url,
      format: result.format,
      width: result.width,
      height: result.height,
      bytes: result.bytes
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('File upload failed');
  }
};

// @desc    Upload files for analysis
// @route   POST /api/upload/files
// @access  Private
router.post('/files', 
  protect, 
  uploadRateLimit, 
  upload.array('files', 5), 
  validateFileUpload,
  catchAsync(async (req, res) => {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const { title, description } = req.body;
    const uploadedFiles = [];

    try {
      // Upload each file to Cloudinary
      for (const file of req.files) {
        const result = await uploadToCloudinary(file, `vastu-vision/users/${req.user.id}`);
        
        uploadedFiles.push({
          filename: result.public_id,
          originalName: file.originalname,
          url: result.url,
          size: result.bytes,
          type: file.mimetype,
          format: result.format,
          dimensions: {
            width: result.width,
            height: result.height
          }
        });
      }

      // Create analysis record
      const analysis = await Analysis.create({
        user: req.user.id,
        title: title || `Analysis ${new Date().toLocaleDateString()}`,
        description: description || '',
        files: uploadedFiles,
        status: 'pending'
      });

      res.status(201).json({
        success: true,
        message: 'Files uploaded successfully',
        data: {
          analysis: {
            id: analysis._id,
            title: analysis.title,
            description: analysis.description,
            files: analysis.files,
            status: analysis.status,
            createdAt: analysis.createdAt
          }
        }
      });

    } catch (error) {
      // If upload fails, clean up any successfully uploaded files
      for (const file of uploadedFiles) {
        try {
          await cloudinary.uploader.destroy(file.filename);
        } catch (cleanupError) {
          console.error('Failed to cleanup file:', cleanupError);
        }
      }

      throw error;
    }
  })
);

// @desc    Upload single file
// @route   POST /api/upload/single
// @access  Private
router.post('/single', 
  protect, 
  uploadRateLimit, 
  upload.single('file'), 
  catchAsync(async (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    try {
      const result = await uploadToCloudinary(req.file, `vastu-vision/users/${req.user.id}`);
      
      res.status(201).json({
        success: true,
        message: 'File uploaded successfully',
        data: {
          file: {
            filename: result.public_id,
            originalName: req.file.originalname,
            url: result.url,
            size: result.bytes,
            type: req.file.mimetype,
            format: result.format,
            dimensions: {
              width: result.width,
              height: result.height
            }
          }
        }
      });

    } catch (error) {
      throw error;
    }
  })
);

// @desc    Delete uploaded file
// @route   DELETE /api/upload/files/:publicId
// @access  Private
router.delete('/files/:publicId', protect, catchAsync(async (req, res) => {
  const { publicId } = req.params;

  try {
    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);
    
    if (result.result === 'ok') {
      res.status(200).json({
        success: true,
        message: 'File deleted successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete file'
    });
  }
}));

// @desc    Get upload statistics
// @route   GET /api/upload/stats
// @access  Private
router.get('/stats', protect, catchAsync(async (req, res) => {
  const userId = req.user.id;

  // Get user's analysis statistics
  const totalAnalyses = await Analysis.countDocuments({ user: userId });
  const totalFiles = await Analysis.aggregate([
    { $match: { user: userId } },
    { $project: { fileCount: { $size: '$files' } } },
    { $group: { _id: null, totalFiles: { $sum: '$fileCount' } } }
  ]);

  const stats = {
    totalAnalyses,
    totalFiles: totalFiles.length > 0 ? totalFiles[0].totalFiles : 0,
    storageUsed: 0, // This would need to be calculated from Cloudinary API
    remainingUploads: 10 - totalAnalyses // Assuming free tier allows 10 analyses
  };

  res.status(200).json({
    success: true,
    data: { stats }
  });
}));

// @desc    Get file info
// @route   GET /api/upload/files/:publicId
// @access  Private
router.get('/files/:publicId', protect, catchAsync(async (req, res) => {
  const { publicId } = req.params;

  try {
    const result = await cloudinary.api.resource(publicId);
    
    res.status(200).json({
      success: true,
      data: {
        file: {
          public_id: result.public_id,
          url: result.secure_url,
          format: result.format,
          size: result.bytes,
          dimensions: {
            width: result.width,
            height: result.height
          },
          createdAt: result.created_at
        }
      }
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: 'File not found'
    });
  }
}));

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 5MB'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Maximum is 5 files'
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected field in file upload'
      });
    }
  }

  if (error.message.includes('Invalid file type')) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  next(error);
});

module.exports = router;
