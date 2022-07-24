const User = require('../models/User')
const Driver = require('../models/Driver')
const router = require('express').Router()
const bcrypt = require('bcrypt')    
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const nodemailer = require('nodemailer')
const { verifiedAuth } = require('./verify')
const {transporter} = require('./nodemailer')


require('dotenv/config')





//new user

router.post('/user', async (req, res) => {

    const demailexist = await Driver.findOne({ email: req.body.email })
    if (demailexist) return res.status(400).send('email used already as a driver')  
    //if userexist 
    const emailexist = await User.findOne({ email: req.body.email })
    if(emailexist) return res.status(400).send('email used already')

    

    //hased password
     const salt = await bcrypt.genSalt(10)
        const password = await bcrypt.hash(req.body.password, salt)
         

  

    const newUser =await new User({
        fullname: req.body.fullname,
        email: req.body.email,
        password: password,
        address: req.body.address,
        phoneno: req.body.phoneno,
        emailToken:crypto.randomBytes(72).toString('hex')
    })
    try {
        const savedUser = await newUser.save()

        var mailOptions = {
            from: '"Verify your email "<The Invisible>',
            to: newUser.email,
            subject: 'please verify your email',
            html: `<h2>${newUser.fullname.first} Thank for using this platform</h2>
                <p>please verify your mail to continue</p>
                <a href = "http://${req.headers.host}/auth/verify?token=${newUser.emailToken}">Verify</a>
            `
        }


        transporter.sendMail(mailOptions, (error, message) => {
            if (error) {
               console.log(error)
            } else {
                console.log(message)
            }
        })

        res.status(200).send('go to email to verify')
    } catch (error) {
        res.status(400).send(error.message)        
    }
})

router.get('/verify', async (req, res) => {
    try {
        const token = req.query.token
        const user = await User.findOne({ emailToken: token })
        if (user) {
            user.verified = true
            await user.save()

            res.send('email is validated')
        } else {
            res.send('you are not verified')
        }
    } catch (error) {
        res.status(400).send(error)
    }
})

router.get('/verify/driver', async (req, res) => {
    try {
        const token = req.query.token
        const user = await Driver.findOne({ emailToken: token })
        if (user) {
            user.verified = true
            await user.save()

            res.send('email is validated')
        } else {
            res.send('you are not verified')
        }
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/driver', async (req, res) => {
    
    const drive = await User.findOne({ email: req.body.email })
    if(drive) return res.status(400).send('already used as a user')
    
    const emailexist = await Driver.findOne({ email: req.body.email })
    if (emailexist) return res.status(400).send('email used already')
    
   


    const ninexist = await Driver.findOne({ NIN: req.body.NIN })
    if (ninexist) return res.status(400).send('already exist')
    
     const salt = await bcrypt.genSalt(10)
    const password = await bcrypt.hash(req.body.password, salt)

    
    const newDriver = await new Driver({
        fullname: req.body.fullname,
        email: req.body.email,
        password: password,
        NIN: req.body.NIN,
        accountno: req.body.accountno,
        state: req.body.state,
        address: req.body.address,
        phoneno: req.body.phoneno,
        emailToken:crypto.randomBytes(70).toString('hex')
    })

    try {
        const driversaved = await newDriver.save()

        
        var mailOptions = {
            from: '"Verify your email "<The Invisible>',
            to: newDriver.email,
            subject: 'please verify your email',
            html: `<h2>${newDriver.fullname.first} Thank for using this platform Enjoy our driving servises</h2>
                <p>please verify your mail to continue</p>
                <a href = "http://${req.headers.host}/auth/verify/driver?token=${newDriver.emailToken}">Verify</a>
            `
        }


        transporter.sendMail(mailOptions, (error, message) => {
            if (error) {
               console.log(error)
            } else {
                console.log(message)
            }
        })

        res.status(200).send('go to email to verify')
    } catch (error) {
        res.status(400).send(error.message)
    }
})



router.post('/login/user', async (req, res) => {
    const user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(400).send('email is not correct')
    
    if (!user.verified) {
        return res.status(400).send('user not verified got to email and verify')
    }
    const validpass = await bcrypt.compare(req.body.password, user.password)
    if (!validpass) return res.status(400).send('password is not correct')

    
    
    const token = jwt.sign({ id:user._id, isAdmin: user.isAdmin}, process.env.TOKEN, {expiresIn:'24h'})
    res.status(200).send({user, token})
    
    
})

router.post('/login/driver', async (req, res) => {
    const user = await Driver.findOne({ email: req.body.email })
    if (!user) return res.status(400).send('email is not correct')
    
    if (!user.verified) return res.status(400).send('driver is not verified')
   
    const validpass = await bcrypt.compare(req.body.password, user.password)
    if (!validpass) return res.status(400).send('password is not correct')
    
    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.TOKEN, { expiresIn: '24h' })
    res.status(200).send({user, token})
    
    

})

module.exports = router