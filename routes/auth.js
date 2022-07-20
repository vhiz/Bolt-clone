const User = require('../models/User')
const Driver = require('../models/Driver')
const router = require('express').Router()
const bcrypt = require('bcrypt')    
const jwt = require('jsonwebtoken')
const Userverification = require('../models/UserVerification')
require('dotenv/config')
const transporter = require('../google')



transporter.verify((error, sucess) => {
    if (error) {
        console.log(error)
    } else {
        console.log('ready')
        console.log(sucess)
    }
})

//new user

router.post('/user', async (req, res) => {

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
        phoneno:req.body.phoneno
    })
    try {
        const savedUser = await newUser.save()
        res.status(200).send(savedUser)
    } catch (error) {
        res.status(400).send(error.message)
    }
})

router.post('/driver', async (req, res) => {
     const emailexist = await Driver.findOne({ email: req.body.email })
    if(emailexist) return res.status(400).send('email used already')

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
        phoneno: req.body.phoneno
    })

    try {
        const driversaved = await newDriver.save()
        res.status(200).send(driversaved)
    } catch (error) {
        res.status(400).send(error.message)
    }
})


router.post('/login/user', async (req, res) => {
    const user = await User.findOne({ email: req.body.email })
    if(!user)return res.status(400).send('email is not correct')
    
    const validpass = await bcrypt.compare(req.body.password, user.password)
    if (!validpass) return res.status(400).send('password is not correct')
    
    const token = jwt.sign({ id:user._id, isAdmin: user.isAdmin}, process.env.TOKEN, {expiresIn:'24h'})
    res.status(200).send({user, token})
    
    
})

router.post('/login/driver', async (req, res) => {
    const user = await Driver.findOne({ email: req.body.email })
    if(!user)return res.status(400).send('email is not correct')
    
    const validpass = await bcrypt.compare(req.body.password, user.password)
    if (!validpass) return res.status(400).send('password is not correct')
    
    const token = jwt.sign({ id:user._id, isAdmin: user.isAdmin}, process.env.TOKEN, {expiresIn:'24h'})
    res.status(200).send({user, token})
    
    

})

module.exports = router