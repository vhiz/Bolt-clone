const Driver = require('../models/Driver')
const { verifiedAuth, verifiedToken } = require('./verify')
const bcrypt = require('bcrypt')


const router = require('express').Router()

router.put('/:id', verifiedAuth, async (req, res) => {
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

router.delete('/:id', verifiedAuth, async (req, res) => {
    const user = await Driver.findById(req.params.id)
    const deleteuser = await bcrypt.compare(req.body.password, user.password)
    if (deleteuser) {
         try {
        await Driver.findByIdAndDelete(req.params.id)
        res.status(200).send('User has been deleted')
    } catch (error) {
        res.status(400).send(error)
    }
    } else {
        res.status(400).send('input password')
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