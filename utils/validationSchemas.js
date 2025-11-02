const { body } = require('express-validator');

exports.userRegistrationValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.[a-z])(?=.[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
];

exports.workoutValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Workout name is required')
    .isLength({ max: 100 })
    .withMessage('Workout name cannot exceed 100 characters'),
  
  body('type')
    .isIn(['cardio', 'strength', 'flexibility', 'hiit', 'sports'])
    .withMessage('Invalid workout type'),
  
  body('duration')
    .isInt({ min: 1, max: 480 })
    .withMessage('Duration must be between 1 and 480 minutes'),
  
  body('caloriesBurned')
    .isInt({ min: 1 })
    .withMessage('Calories burned must be a positive number')
];

exports.nutritionValidation = [
  body('mealType')
    .isIn(['breakfast', 'lunch', 'dinner', 'snack'])
    .withMessage('Invalid meal type'),
  
  body('foodItems')
    .isArray({ min: 1 })
    .withMessage('At least one food item is required'),
  
  body('foodItems.*.name')
    .trim()
    .notEmpty()
    .withMessage('Food item name is required'),
  
  body('foodItems.*.calories')
    .isFloat({ min: 0 })
    .withMessage('Calories must be a positive number')
];