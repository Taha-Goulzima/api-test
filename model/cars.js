const mongoose = require('mongoose');

const registrationRegex = /^[0-9]{4}-[A-Za-z]{1}-[0-9]{2}$/; 

const carSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,  
        minlength: 2,
        maxlength: 50,
        trim: true
    },
    immatricule: { 
        type: String,
        required: true,  
        unique: true, 
        trim: true,
        match: [registrationRegex, 'Invalid registration format (e.g., "1234-A-65")'],
        index: true // Optional index for faster lookups
    },
    year: {
        type: Number,
        required: true,  
        validate: {
            validator: function(value) {
                const currentYear = new Date().getFullYear();
                return value > 0 && value <= currentYear; 
            },
            message: (props) => `The year must be a positive number and less than or equal to ${new Date().getFullYear()}.`
        }
    },
    kilometers: { 
        type: Number,
        required: true,  
        validate: {
            validator: function(value) {
                return value >= 0; 
            },
            message: 'Kilometers should be a positive number or zero.'
        }
    },
    pricePerDay: { 
        type: Number,
        required: true,  
        min: 0, 
        max: 1000000 
    },
    createdAt: {
        type: Date,
        default: Date.now // Optional field to track when the car record was created
    }
});

module.exports = mongoose.model('Car', carSchema);
