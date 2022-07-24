const router = require('express').Router()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const User = require('../models/User')
const { verifiedAuth, verifiedAdmin } = require('./verify')


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
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set:req.body
        })
        res.status(200).send(updatedUser)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.delete('/:id', verifiedAuth, async (req, res) => {
    const user = await User.findById(req.params.id)
    const deleteuser = await bcrypt.compare(req.body.password, user.password)
    if (deleteuser) {
         try {
        await User.findByIdAndDelete(req.params.id)
        res.status(200).send('User has been deleted')
    } catch (error) {
        res.status(400).send(error)
    }
    } else {
        res.status(400).send('input password')
    }
   
})

router.get('/:id', verifiedAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        res.status(200).send(user)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.get('/all', verifiedAdmin, async (req, res) => {
    try {
        const users = await User.find()
        res.status(200).send(users)
    } catch (error) {
        res.status(400).send(error)
    }
})

module.exports= router