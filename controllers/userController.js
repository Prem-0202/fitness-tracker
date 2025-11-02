const User = require('../models/User');
const { calculateBMI, calculateBMR, calculateDailyCalories } = require('../utils/helpers');
const { successResponse, errorResponse } = require('../utils/responseHandler');

exports.getUserStats = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    const bmi = calculateBMI(user.weight, user.height);
    const bmr = calculateBMR(user.weight, user.height, user.age, user.gender);
    const dailyCalories = calculateDailyCalories(bmr, 'moderate', user.fitnessGoals);
    
    const stats = {
      bmi,
      bmr: Math.round(bmr),
      dailyCalories,
      macroDistribution: calculateMacroDistribution(dailyCalories, user.fitnessGoals)
    };
    
    return successResponse(res, stats, 'User stats calculated successfully');
  } catch (error) {
    return errorResponse(res, 'Error calculating user stats');
  }
};
// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      age: req.body.age,
      weight: req.body.weight,
      height: req.body.height,
      gender: req.body.gender,
      fitnessGoals: req.body.fitnessGoals,
      dailyCalorieTarget: req.body.dailyCalorieTarget
    };

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user dashboard data
// @route   GET /api/users/dashboard
// @access  Private
exports.getDashboard = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    // In a real application, you would aggregate data from workouts and nutrition
    const dashboardData = {
      user: {
        name: user.name,
        fitnessGoals: user.fitnessGoals,
        dailyCalorieTarget: user.dailyCalorieTarget
      },
      weeklyStats: {
        workoutsCompleted: 0,
        totalCaloriesBurned: 0,
        averageWorkoutDuration: 0
      },
      recentActivities: []
    };

    res.status(200).json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};