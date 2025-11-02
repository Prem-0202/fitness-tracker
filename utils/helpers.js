const moment = require('moment');

// Calculate BMI
exports.calculateBMI = (weight, height) => {
  if (!weight || !height) return null;
  // Convert height from cm to meters
  const heightInMeters = height / 100;
  return (weight / (heightInMeters * heightInMeters)).toFixed(1);
};

// Calculate BMR (Basal Metabolic Rate)
exports.calculateBMR = (weight, height, age, gender) => {
  if (!weight || !height || !age || !gender) return null;
  
  if (gender === 'male') {
    return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
  } else {
    return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
  }
};

// Calculate daily calorie needs based on activity level
exports.calculateDailyCalories = (bmr, activityLevel, fitnessGoal) => {
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9
  };

  const goalMultipliers = {
    weight_loss: 0.8,
    maintenance: 1,
    muscle_gain: 1.1
  };

  const maintenanceCalories = bmr * (activityMultipliers[activityLevel] || 1.55);
  return Math.round(maintenanceCalories * (goalMultipliers[fitnessGoal] || 1));
};

// Calculate calories burned during workout
exports.calculateCaloriesBurned = (weight, duration, metValue) => {
  // MET (Metabolic Equivalent of Task) values for different activities
  return Math.round((metValue * 3.5 * weight * duration) / 200);
};

// Common MET values for different activities
exports.MET_VALUES = {
  walking: 3.5,
  running: 8,
  cycling: 7.5,
  swimming: 6,
  weight_training: 6,
  yoga: 3,
  hiit: 8.5
};

// Format date for display
exports.formatDate = (date) => {
  return moment(date).format('YYYY-MM-DD');
};

// Get start and end of week
exports.getWeekRange = (date = new Date()) => {
  const start = moment(date).startOf('week').toDate();
  const end = moment(date).endOf('week').toDate();
  return { start, end };
};

// Calculate workout streak
exports.calculateStreak = (workouts) => {
  if (!workouts.length) return 0;
  
  let streak = 0;
  const today = moment().startOf('day');
  let currentDate = today;
  
  // Sort workouts by date descending
  const sortedWorkouts = workouts
    .map(w => moment(w.date).startOf('day'))
    .sort((a, b) => b - a);
  
  for (let workoutDate of sortedWorkouts) {
    if (workoutDate.isSame(currentDate)) {
      streak++;
      currentDate = currentDate.subtract(1, 'day');
    } else if (workoutDate.isBefore(currentDate)) {
      break;
    }
  }
  
  return streak;
};

// Generate progress report
exports.generateProgressReport = (progressEntries, startDate, endDate) => {
  if (progressEntries.length < 2) return null;
  
  const sortedEntries = progressEntries.sort((a, b) => new Date(a.date) - new Date(b.date));
  const firstEntry = sortedEntries[0];
  const lastEntry = sortedEntries[sortedEntries.length - 1];
  
  const weightChange = lastEntry.weight - firstEntry.weight;
  const weightChangePercentage = ((weightChange / firstEntry.weight) * 100).toFixed(1);
  
  return {
    startWeight: firstEntry.weight,
    currentWeight: lastEntry.weight,
    weightChange,
    weightChangePercentage,
    totalEntries: progressEntries.length,
    period:` ${moment(startDate).format('MMM D')} - ${moment(endDate).format('MMM D, YYYY')}`
  };
};

// Validate email format
exports.isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Generate random workout suggestions
exports.generateWorkoutSuggestions = (fitnessGoal, availableTime) => {
  const suggestions = {
    weight_loss: [
      { name: 'HIIT Circuit', duration: 30, type: 'hiit' },
      { name: 'Running', duration: 45, type: 'cardio' },
      { name: 'Cycling', duration: 60, type: 'cardio' }
    ],
    muscle_gain: [
      { name: 'Upper Body Strength', duration: 60, type: 'strength' },
      { name: 'Lower Body Power', duration: 45, type: 'strength' },
      { name: 'Full Body Workout', duration: 75, type: 'strength' }
    ],
    endurance: [
      { name: 'Long Distance Run', duration: 60, type: 'cardio' },
      { name: 'Swimming', duration: 45, type: 'cardio' },
      { name: 'Cycling Endurance', duration: 90, type: 'cardio' }
    ]
  };
  
  return suggestions[fitnessGoal] || suggestions.maintenance;
};

// Calculate macro nutrients distribution
exports.calculateMacroDistribution = (totalCalories, goal = 'maintenance') => {
  const distributions = {
    weight_loss: { protein: 0.4, carbs: 0.3, fat: 0.3 },
    muscle_gain: { protein: 0.35, carbs: 0.4, fat: 0.25 },
    maintenance: { protein: 0.3, carbs: 0.4, fat: 0.3 },
    endurance: { protein: 0.25, carbs: 0.55, fat: 0.2 }
  };
  
  const distribution = distributions[goal] || distributions.maintenance;
  
  return {
    protein: Math.round((totalCalories * distribution.protein) / 4), // 4 calories per gram
    carbs: Math.round((totalCalories * distribution.carbs) / 4),
    fat: Math.round((totalCalories * distribution.fat) / 9) // 9 calories per gram
  };
};

// Format duration from minutes to readable string
exports.formatDuration = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
};

// Calculate age from birth date
exports.calculateAge = (birthDate) => {
  return moment().diff(moment(birthDate), 'years');
};

// Sanitize user input
exports.sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return input.trim().replace(/<script\b[^<](?:(?!<\/script>)<[^<])*<\/script>/gi, '');
  }
  return input;
};

// Generate unique filename
exports.generateFilename = (originalName) => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = originalName.split('.').pop();
  return `${timestamp}-${randomString}.${extension};`
};