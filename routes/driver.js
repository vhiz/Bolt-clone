const Driver = require('../models/Driver')
const { verifiedUser, verifiedToken } = require('./verify')

const router = require('express').Router()

router.put('/:id', verifiedUser, async (req, res) => {
    if (req.body.password) {
       try {
         const salt = await bcrypt.genSalt(10)
        req.body.password = await bcrypt.hash(req.body.password, salt)
       } catch (error) {
        res.status(400).send(error)
       }
    }
    
    try {
        const updatedDriver = await Driver.findByIdAndUpdate(req.params.id, {
            $set:req.body
        })
        res.status(400).send(updatedDriver)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.delete('/:id', verifiedUser, async (req, res) => {
    try {
        await Driver.findByIdAndDelete(req.params.id)
        res.status(200).send('User has been deleted')
    } catch (error) {
        res.status(400).send(error)
    }
})

router.get('/:id', verifiedToken ,async (req, res) => {
    try {
        const driver = await Driver.findById(req.params.id)
        res.status(200).send(driver)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.get('/all', verifiedToken, async (req, res) => {
    try {
        const users = await Driver.find()
        res.status(200).send(users)
    } catch (error) {
        res.status(400).send(error)
    }
})
module.exports= router