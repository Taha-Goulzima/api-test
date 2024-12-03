const mongoose = require('mongoose');

function connection() {
    mongoose.connect("mongodb://127.0.0.1:27017/carsB")
    .then(() => console.log('Connected to the database successfully'))
    .catch((error) => {
        console.error('Database connection error:', error);
        process.exit(1);  
    });
}

module.exports = connection;
