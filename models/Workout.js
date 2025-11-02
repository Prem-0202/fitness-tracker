const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please add a workout name'],
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Please add workout type'],
    enum: ['cardio', 'strength', 'flexibility', 'hiit', 'sports']
  },
  duration: {
    type: Number,
    required: [true, 'Please add workout duration in minutes']
  },
  caloriesBurned: {
    type: Number,
    required: [true, 'Please add calories burned']
  },
  intensity: {
    type: String,
    enum: ['low', 'moderate', 'high'],
    default: 'moderate'
  },
  exercises: [{
    name: String,
    sets: Number,
    reps: Number,
    weight: Number,
    duration: Number
  }],
  notes: {
    type: String,
    maxlength: 500
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient querying
workoutSchema.index({ user: 1, date: -1 });

module.exports = mongoose.models.Workout || mongoose.model('Workout',workoutSchema);