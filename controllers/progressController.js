const Progress = require('../models/Progress');

// @desc    Get all progress entries for user
// @route   GET /api/progress
// @access  Private
exports.getProgressEntries = async (req, res, next) => {
  try {
    const progress = await Progress.find({ user: req.user.id })
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: progress.length,
      data: progress
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create progress entry
// @route   POST /api/progress
// @access  Private
exports.createProgressEntry = async (req, res, next) => {
  try {
    req.body.user = req.user.id;
    const progress = await Progress.create(req.body);

    res.status(201).json({
      success: true,
      data: progress
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get progress statistics
// @route   GET /api/progress/stats
// @access  Private
exports.getProgressStats = async (req, res, next) => {
  try {
    const progress = await Progress.find({ user: req.user.id })
      .sort({ date: 1 })
      .select('weight bodyFat muscleMass date');

    const weightProgress = progress.map(entry => ({
      date: entry.date,
      weight: entry.weight,
      bodyFat: entry.bodyFat,
      muscleMass: entry.muscleMass
    }));

    res.status(200).json({
      success: true,
      data: weightProgress
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};