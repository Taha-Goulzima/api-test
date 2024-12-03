const mongoose = require('mongoose');
const cinRegex = /^[A-Z]{2}\d{4}$/;

const locationSchema = new mongoose.Schema({
    startDate: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                return value >= new Date();
            },
            message: "Start date must be today or in the future."
        }
    },
    endDate: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                // Check endDate validity using startDate from the object
                return !this.startDate || value > this.startDate;
            },
            message: "End date must be after the start date."
        }
    },
    carId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Car',
        required: true
    },
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
        trim: true
    },
    cin: {
        type: String,
        required: true,
        match: [cinRegex, 'Invalid CIN format. Example: "AB1234"'],
        trim: true
    },
    phoneNumber: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 15,
        trim: true,
        match: [/^\d+$/, "Phone number must contain only digits."]
    },
    address: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 100,
        trim: true
    }
}, {
    timestamps: true 
});

// Add a pre-validation hook to check startDate and endDate relationship during updates
locationSchema.pre('findOneAndUpdate', function(next) {
    const update = this.getUpdate();
    if (update.startDate && update.endDate && new Date(update.endDate) <= new Date(update.startDate)) {
        return next(new Error('End date must be after the start date.'));
    }
    next();
});

module.exports = mongoose.model('Location', locationSchema);

