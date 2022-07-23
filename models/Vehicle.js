const mongoose = require('mongoose')

const vehicleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    maxPeople: { type: Number, require: true },
    seatnumb: [{ seat: Number, unavailableDates: { type: [String] } }],
    carid:{type: String}
})

module.exports= mongoose.model('Vehicle', vehicleSchema)