const mongoose = require('mongoose')

const carSchema = new mongoose.Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    maxPeople: { type: Number, require: true },
    carnumb: [{number: Number, unavailableSeates:{type:[String]}}],
})

module.exports= ('Vehicle', carSchema)