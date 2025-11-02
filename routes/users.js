const express = require('express');
const { updateProfile, getDashboard } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.put('/profile', updateProfile);
router.get('/dashboard', getDashboard);

module.exports = router;
