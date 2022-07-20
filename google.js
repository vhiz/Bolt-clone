
const nodemailer = require('nodemailer')
const { v4: uuidv4 } = require('uuid')

let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: 'bestcannice@gmail.com',
        pass: 'fhlugiksehtfuvsj',
    }
})

module.exports = transporter