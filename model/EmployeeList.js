const mongoose = require('mongoose')

const employeeSchema = new mongoose.Schema(
    {
        name: String,
        email: String,
        location: String,
        position: String,
        salary: Number
    }
)

const employeeModel = mongoose.model(
    "employee", employeeSchema
)

module.exports = {employeeModel}
