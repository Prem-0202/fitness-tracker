const mongoose = require('mongoose');

const hydrationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    },
    glasses: {
        type: Number,
        required: true,
        min: 0,
        max: 20
    },
    amount: {
        type: Number, // in ml
        required: true,
        min: 0
    }
}, {
    timestamps: true
});

hydrationSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('Hydration', hydrationSchema);