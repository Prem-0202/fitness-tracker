const mongoose = require('mongoose');

const nutritionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  mealType: {
    type: String,
    required: [true, 'Please add meal type'],
    enum: ['breakfast', 'lunch', 'dinner', 'snack']
  },
  foodItems: [{
    name: {
      type: String,
      required: true
    },
    calories: {
      type: Number,
      required: true
    },
    protein: {
      type: Number,
      default: 0
    },
    carbs: {
      type: Number,
      default: 0
    },
    fat: {
      type: Number,
      default: 0
    },
    quantity: {
      type: Number,
      default: 1
    },
    unit: {
      type: String,
      default: 'serving'
    }
  }],
  totalCalories: {
    type: Number,
    required: true
  },
  totalProtein: Number,
  totalCarbs: Number,
  totalFat: Number,
  date: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    maxlength: 500
  }
}, {
  timestamps: true
});

// Calculate totals before saving
nutritionSchema.pre('save', function(next) {
  this.totalCalories = this.foodItems.reduce((sum, item) => sum + (item.calories * item.quantity), 0);
  this.totalProtein = this.foodItems.reduce((sum, item) => sum + (item.protein * item.quantity), 0);
  this.totalCarbs = this.foodItems.reduce((sum, item) => sum + (item.carbs * item.quantity), 0);
  this.totalFat = this.foodItems.reduce((sum, item) => sum + (item.fat * item.quantity), 0);
  next();
});

nutritionSchema.index({ user: 1, date: -1 });

module.exports = mongoose.models.Nutrition || mongoose.model('Nutrition', nutritionSchema)