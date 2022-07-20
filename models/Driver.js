const mongoose = require('mongoose')


const driverSchema = new mongoose.Schema({
    fullname: ({
        first: { type: String, required: true },
        last: { type: String, requiredP: true }
    }),
    address: { type: String, requried: true },
    NIN: { type: Number, requried: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    phoneno: { type: Number },
    email: { type: String, required: true },
    state: { type: String, required: true },
    accountno: { type: Number, required: true },
    vehicle: { type: [String] },
    isDriver: { type: Boolean, default: true }
}, { timestamps: true })




module.exports = mongoose.model('Driver', driverSchema)