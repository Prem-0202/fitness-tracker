const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)@\w+([.-]?\w+)(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  age: {
    type: Number,
    min: 1,
    max: 120
  },
  weight: {
    type: Number,
    min: 1
  },
  height: {
    type: Number,
    min: 1
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  fitnessGoals: {
    type: String,
    enum: ['weight_loss', 'muscle_gain', 'maintenance', 'endurance', 'weight_gain'],
    default: 'maintenance'
  },
  dailyCalorieTarget: {
    type: Number,
    default: 2000
  },
  dailyProteinTarget: {
    type: Number,
    default: 50
  },
  dailyCarbsTarget: {
    type: Number,
    default: 250
  }
}, {
  timestamps: true
});

// Create index for faster email lookups
userSchema.index({ email: 1 });

// Encrypt password using bcrypt
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(8); // Reduced from 10 to 8 for faster hashing
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Prevent OverwriteModelError
module.exports = mongoose.models.User || mongoose.model('User', userSchema);