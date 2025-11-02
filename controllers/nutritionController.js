const Nutrition = require('../models/Nutrition');

// @desc    Get all nutrition entries for user
// @route   GET /api/nutrition
// @access  Private
exports.getNutritionEntries = async (req, res, next) => {
  try {
    const nutrition = await Nutrition.find({ user: req.user.id })
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: nutrition.length,
      data: nutrition
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create nutrition entry
// @route   POST /api/nutrition
// @access  Private
exports.createNutritionEntry = async (req, res, next) => {
  try {
    req.body.user = req.user.id;
    const nutrition = await Nutrition.create(req.body);

    res.status(201).json({
      success: true,
      data: nutrition
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get nutrition statistics
// @route   GET /api/nutrition/stats
// @access  Private
exports.getNutritionStats = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    let matchCriteria = { user: req.user._id };
    
    if (startDate && endDate) {
      matchCriteria.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const stats = await Nutrition.aggregate([
      {
        $match: matchCriteria
      },
      {
        $group: {
          _id: null,
          totalEntries: { $sum: 1 },
          totalCalories: { $sum: '$totalCalories' },
          avgCalories: { $avg: '$totalCalories' },
          totalProtein: { $sum: '$totalProtein' },
          totalCarbs: { $sum: '$totalCarbs' },
          totalFat: { $sum: '$totalFat' }
        }
      }
    ]);

    const mealTypeStats = await Nutrition.aggregate([
      {
        $match: matchCriteria
      },
      {
        $group: {
          _id: '$mealType',
          count: { $sum: 1 },
          totalCalories: { $sum: '$totalCalories' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: stats[0] || {},
        byMealType: mealTypeStats
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};