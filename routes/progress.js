const express = require('express');
const {
  getProgressEntries,
  createProgressEntry,
  getProgressStats
} = require('../controllers/progressController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getProgressEntries)
  .post(createProgressEntry);

router.get('/stats/progress', getProgressStats);

module.exports = router;