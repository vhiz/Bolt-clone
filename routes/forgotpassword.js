const router = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/User')
const { transporter } = require('./nodemailer')

router.post('/forgotUser', async (req, res) => {
    if (req.body.email) {
        const user = await User.findOne({ email: req.body.email })
        if(!user)return res.status(400).send('user not found')
        try {
             var mailOptions = {
            from: '"Reset your Password "<bestcannice@gmail.com>',
            to: user.email,
            subject: 'reset your password',
            html: `<h2>${user.fullname.first} Thank for using this platform</h2>
                <p>Reset your password</p>
                <a href = "http://${req.headers.host}/reset?token=${user.emailToken}">Verify</a>
            `
            }
            
            transporter.sendMail(mailOptions, (error, message) => {
            if (error) {
               console.log(error)
            } else {
                console.log('verification email sent')
            }
            })
            res.status(200).send('check your inbox')
        } catch (error) {
            res.status(400).send(error)
        }
    } else {
        res.send('input email')
    }
})

router.get('/reset', async (req, res) => {
    try {
        const token = req.query.token
        const user = await User.findOne({ emailToken: token })
        if (user) {
            res.render('reset-password',{email: user.email})
        }
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/reset', async (req, res) => {
    try {
        const token = req.query.token
        const user = await User.findOne({ emailToken: token })


        if (req.body.password) {
       try {
         const salt = await bcrypt.genSalt(10)
        req.body.password = await bcrypt.hash(req.body.password, salt)
       } catch (error) {
        res.status(400).send(error)
       }
        }
        
        if (user) {
            user.password = req.body.password
            await user.save()
            res.send('password is changed')
        } else {
            res.send('invalid link')
        }
    
        
    } catch (error) {
        res.status(400).send(error)
    }

})


module.exports = router