const express = require('express');
const {
  getNutritionEntries,
  createNutritionEntry,
  getNutritionStats
} = require('../controllers/nutritionController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getNutritionEntries)
  .post(createNutritionEntry);

router.get('/stats/nutrition', getNutritionStats);

module.exports = router;