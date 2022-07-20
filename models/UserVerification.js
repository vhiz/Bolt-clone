const mongoose = require('mongoose')

const userVerificationSchema = new mongoose.Schema({
    userId: String,
    unique: String,
    expires: Date,
}, { timestamps: true })

module.exports = mongoose.model('Userverification', userVerificationSchema)