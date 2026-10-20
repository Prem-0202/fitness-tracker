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
    minlength: 6,
    select: false
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true  // allows multiple null values
  },
  authProvider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local'
  },
  avatar: {
    type: String  // Google profile picture URL
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


// Encrypt password using bcrypt (only for local auth users)
userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(8);
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