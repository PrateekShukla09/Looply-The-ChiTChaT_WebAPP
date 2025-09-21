// src/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  avatar: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    default: 'Hey there! I am using WhatsApp.',
    maxlength: 139
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  contacts: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    name: String,
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  blockedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  inviteKey: {
    type: String,
    unique: true,
    sparse: true
  },
  inviteKeyExpiry: {
    type: Date
  },
  allowInvites: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    this.password = await bcrypt.hash(this.password, 12);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate unique invite key
userSchema.methods.generateInviteKey = function() {
  const crypto = require('crypto');
  const randomString = crypto.randomBytes(6).toString('hex').toUpperCase();
  const timestamp = Date.now().toString(36).toUpperCase();
  return `${randomString}-${timestamp}`;
};

// Check if invite key is valid
userSchema.methods.isInviteKeyValid = function() {
  if (!this.inviteKey || !this.inviteKeyExpiry) return false;
  return new Date() < this.inviteKeyExpiry;
};

module.exports = mongoose.model('User', userSchema);