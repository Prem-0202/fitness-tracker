const express = require('express');
const { updateProfile, getDashboard } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();



router.put('/profile', updateProfile);
router.get('/dashboard', getDashboard);
router.use(protect);

module.exports = router;
