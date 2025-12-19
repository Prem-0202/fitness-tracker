const Nutrition = require('../models/Nutrition');
const User = require('../models/User');

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

// @desc    Get daily nutrition summary
// @route   GET /api/nutrition/daily
// @access  Private
exports.getDailyNutrition = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const user = await User.findById(req.user.id);
    const nutrition = await Nutrition.find({
      user: req.user.id,
      date: { $gte: today, $lt: tomorrow }
    });

    const mealsByType = {
      breakfast: [],
      lunch: [],
      dinner: [],
      snacks: []
    };

    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;

    nutrition.forEach(meal => {
      mealsByType[meal.mealType].push(meal);
      totalCalories += meal.totalCalories;
      totalProtein += meal.totalProtein;
      totalCarbs += meal.totalCarbs;
    });

    res.status(200).json({
      success: true,
      data: {
        meals: mealsByType,
        totals: {
          calories: totalCalories,
          protein: totalProtein,
          carbs: totalCarbs
        },
        goals: {
          calories: user.dailyCalorieTarget,
          protein: user.dailyProteinTarget,
          carbs: user.dailyCarbsTarget
        }
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add food item to meal
// @route   POST /api/nutrition/food
// @access  Private
exports.addFoodItem = async (req, res, next) => {
  try {
    const { mealType, name, calories, protein = 0, carbs = 0 } = req.body;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let nutrition = await Nutrition.findOne({
      user: req.user.id,
      mealType,
      date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) }
    });

    if (nutrition) {
      nutrition.foodItems.push({ name, calories, protein, carbs, quantity: 1 });
      await nutrition.save();
    } else {
      nutrition = await Nutrition.create({
        user: req.user.id,
        mealType,
        foodItems: [{ name, calories, protein, carbs, quantity: 1 }],
        totalCalories: calories
      });
    }

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