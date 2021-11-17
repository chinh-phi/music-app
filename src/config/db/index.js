const mongoose = require('mongoose');
async function connect() {
    try {
        await mongoose.connect('mongodb://localhost:27017/Music');
        console.log("Successfully");
    } catch (error) {
        console.log('Failed to connect');
    }
}

module.exports = { connect };