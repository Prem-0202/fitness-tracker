const express = require('express');
const {
  getNutritionEntries,
  createNutritionEntry,
  getDailyNutrition,
  addFoodItem
} = require('../controllers/nutritionController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getNutritionEntries)
  .post(createNutritionEntry);

router.get('/daily', getDailyNutrition);
router.post('/food', addFoodItem);

module.exports = router;