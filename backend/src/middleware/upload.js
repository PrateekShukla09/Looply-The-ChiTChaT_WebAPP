const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Create subdirectories for different file types
const createUploadDirectories = () => {
  const directories = ['images', 'videos', 'audios', 'documents', 'others'];
  
  directories.forEach(dir => {
    const fullPath = path.join(uploadDir, dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      console.log(`Created upload directory: ${fullPath}`);
    }
  });
};

// Initialize directories
createUploadDirectories();

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { messageType } = req.body;
    let folder = 'others';
    
    // Determine folder based on message type
    if (messageType === 'image') {
      folder = 'images';
    } else if (messageType === 'video') {
      folder = 'videos';
    } else if (messageType === 'audio') {
      folder = 'audios';
    } else if (messageType === 'document') {
      folder = 'documents';
    }
    
    const fullPath = path.join(uploadDir, folder);
    
    // Ensure directory exists
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
    
    cb(null, fullPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileName = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
    cb(null, fileName);
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  const { messageType } = req.body;
  
  // Define allowed file types for each message type
  const allowedTypes = {
    image: {
      mimetypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
      extensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp']
    },
    video: {
      mimetypes: ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv', 'video/webm', 'video/mkv'],
      extensions: ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm', '.mkv']
    },
    audio: {
      mimetypes: ['audio/mp3', 'audio/wav', 'audio/ogg', 'audio/m4a', 'audio/aac', 'audio/mpeg'],
      extensions: ['.mp3', '.wav', '.ogg', '.m4a', '.aac']
    },
    document: {
      mimetypes: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'text/plain'
      ],
      extensions: ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt']
    }
  };
  
  if (!messageType || !allowedTypes[messageType]) {
    return cb(null, true); // Allow all types if messageType is not specified or is 'text'
  }
  
  const fileExtension = path.extname(file.originalname).toLowerCase();
  const isValidExtension = allowedTypes[messageType].extensions.includes(fileExtension);
  const isValidMimetype = allowedTypes[messageType].mimetypes.includes(file.mimetype);
  
  if (isValidExtension && isValidMimetype) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type for ${messageType}. Allowed types: ${allowedTypes[messageType].extensions.join(', ')}`), false);
  }
};

// Configure multer with different size limits for different file types
const getFileSize = (messageType) => {
  const fileSizeLimits = {
    image: 10 * 1024 * 1024,    // 10MB for images
    video: 100 * 1024 * 1024,   // 100MB for videos
    audio: 25 * 1024 * 1024,    // 25MB for audio
    document: 50 * 1024 * 1024, // 50MB for documents
    others: 50 * 1024 * 1024    // 50MB for others
  };
  
  return fileSizeLimits[messageType] || fileSizeLimits.others;
};

// Create multer upload middleware with dynamic file size
const createUploadMiddleware = (messageType) => {
  return multer({
    storage: storage,
    limits: {
      fileSize: getFileSize(messageType),
      files: 1 // Only one file per upload
    },
    fileFilter: fileFilter
  });
};

// Default upload middleware
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB default limit
    files: 1
  },
  fileFilter: fileFilter
});

// Dynamic upload middleware based on message type
const dynamicUpload = (req, res, next) => {
  const { messageType } = req.body;
  const uploadMiddleware = createUploadMiddleware(messageType);
  uploadMiddleware.single('file')(req, res, next);
};

// File deletion utility
const deleteFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Error deleting file:', err);
        reject(err);
      } else {
        console.log('File deleted successfully:', filePath);
        resolve();
      }
    });
  });
};

// Get file info utility
const getFileInfo = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.stat(filePath, (err, stats) => {
      if (err) {
        reject(err);
      } else {
        resolve({
          size: stats.size,
          created: stats.birthtime,
          modified: stats.mtime
        });
      }
    });
  });
};



module.exports = {
  upload,
  dynamicUpload,
  deleteFile,
  getFileInfo,
  createUploadDirectories
};