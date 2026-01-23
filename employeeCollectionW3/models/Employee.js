const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
        firstName: {type: String, required: true, trim: true,},
        lastName: {type: String, required: true, trim: true},
        department: {type: String, required: true, trim: true},
        startDate: {type: Date, required: true, trim: true},
        jobTitle: {type: String, required: true, trim: true},
        salary: {type: Number, min: 15, required: true},
    },
    {timestamps: true}
);

// Export the Employee model
module.exports = mongoose.model("Employee", employeeSchema);