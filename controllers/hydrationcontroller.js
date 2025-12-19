const Hydration = require('../models/hydration');

// Add hydration entry
exports.addHydration = async (req, res) => {
    try {
        const { glasses, amount } = req.body;
        const userId = req.user.id;
        
        // Validate required fields
        if (!glasses || typeof glasses !== 'number' || glasses <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Glasses must be a positive number'
            });
        }
        
        if (amount && (typeof amount !== 'number' || amount <= 0)) {
            return res.status(400).json({
                success: false,
                message: 'Amount must be a positive number'
            });
        }
        
        // Validate required fields
        if (!glasses || typeof glasses !== 'number' || glasses <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Glasses must be a positive number'
            });
        }
        
        if (amount && (typeof amount !== 'number' || amount <= 0)) {
            return res.status(400).json({
                success: false,
                message: 'Amount must be a positive number'
            });
        }
        
        // Validate required fields
        if (!glasses || typeof glasses !== 'number' || glasses <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Glasses must be a positive number'
            });
        }
        
        if (amount && (typeof amount !== 'number' || amount <= 0)) {
            return res.status(400).json({
                success: false,
                message: 'Amount must be a positive number'
            });
        }
        
        const hydration = new Hydration({
            userId,
            glasses,
            amount: amount || glasses * 250 // 250ml per glass default
        });
        
        await hydration.save();
        
        res.status(201).json({
            success: true,
            data: hydration
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Get hydration data
exports.getHydration = async (req, res) => {
    try {
        const userId = req.user.id;
        const { date, limit = 30 } = req.query;
        
        let query = { userId };
        if (date) {
            const startDate = new Date(date);
            const endDate = new Date(date);
            endDate.setDate(endDate.getDate() + 1);
            query.date = { $gte: startDate, $lt: endDate };
        }
        
        const hydration = await Hydration.find(query)
            .sort({ date: -1 })
            .limit(parseInt(limit));
        
        res.json({
            success: true,
            data: hydration
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update hydration entry
exports.updateHydration = async (req, res) => {
    try {
        const { id } = req.params;
        const { glasses, amount } = req.body;
        const userId = req.user.id;
        
        const hydration = await Hydration.findOneAndUpdate(
            { _id: id, userId },
            { glasses, amount: amount || glasses * 250 },
            { new: true }
        );
        
        if (!hydration) {
            return res.status(404).json({
                success: false,
                message: 'Hydration entry not found'
            });
        }
        
        res.json({
            success: true,
            data: hydration
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Delete hydration entry
exports.deleteHydration = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        
        const hydration = await Hydration.findOneAndDelete({ _id: id, userId });
        
        if (!hydration) {
            return res.status(404).json({
                success: false,
                message: 'Hydration entry not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Hydration entry deleted'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};