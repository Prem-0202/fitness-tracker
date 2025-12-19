const express = require('express');
const router = express.Router();
const { addHydration, getHydration, updateHydration, deleteHydration } = require('../controllers/hydrationcontroller');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// POST /api/hydration - Add hydration entry
router.post('/addhydra', addHydration);

// GET /api/hydration - Get hydration data
router.get('/gethydra', getHydration);

// PUT /api/hydration/:id - Update hydration entry
router.put('/:id', updateHydration);

// DELETE /api/hydration/:id - Delete hydration entry
router.delete('/:id', deleteHydration);

module.exports = router;
