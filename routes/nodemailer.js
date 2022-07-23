
const nodemailer = require('nodemailer')
require('dotenv/config')


let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS
    },
    tls: {
        rejectUnauthorized:false
    }
})
module.exports= {transporter}
