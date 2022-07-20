const mongoose = require('mongoose')


const userSchema= new mongoose.Schema({
    fullname: ({
        first: { type: String, required: true },
        last:{type:String, required: true}
    }),
    address: { type: String, requried: true },
    password: { type: String,required:true},
    email: { type: String, requried: true },
    isAdmin: { type: Boolean, default: false },
    phoneno: { type: Number, required: true }
},{timestamps:true
})


module.exports = mongoose.model('User', userSchema)