const Vehicle = require('../models/Vehicle')
const Driver = require('../models/Driver')
const { verifiedAuth, verifiedToken } = require('./verify')
const crypto = require('crypto')


const router = require('express').Router()


router.post('/new/:id',verifiedAuth, async (req, res) => {
    const{carid, ...others}= req.body
    const driverId = req.params.id
    const newVehicle = await new Vehicle({
        carid: crypto.randomBytes(6).toString('hex'),
        ...others
    })
    try {
        const savedcar = await newVehicle.save()
        try {
            await Driver.findByIdAndUpdate(driverId, {
                $push:{vehicle:savedcar._id}
            })
        } catch (error) {
            res.status(400).send(error)
        }
        res.status(200).send(savedcar)
    } catch (error) {
        res.status(400).send(error)
    }
})


router.get('/all', async (req, res) => {
    const { max, min, ...others } = req.query
    try {
        const transports= await Vehicle.find({ ...others,$gt: min | 1, $lt: max || 999 }).limit(req.query.limit)
        return res.status(200).send(transports)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.get('/all/:id', verifiedToken, async (req, res) => {
    try {
        const cars= await Vehicle.findById(req.params.id)
        res.status(200).send(cars)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.get('/countbystates', async (req, res) => {
    const states = req.query.states.split(",")
    try {
        const list = await Promise.all(states.map(state => {
            return Vehicle.countDocuments({state:state})
        }))   
        res.status(200).send(list)
    } catch (error) {
        res.status(400).send(error)
    }
})


router.delete('/:vehicleid/:id',verifiedAuth, async (req, res) => {
    
    const driverId = req.params.id
    try {
         await Vehicle.findByIdAndDelete(req.params.vehicleid)
        try {
            await Driver.findByIdAndUpdate(driverId, {
                $pull:{vehicle:req.params.vehicleid}
            })
            console.log('deleted')
        } catch (error) {
            res.status(400).send(error)
        }
        res.status(200).send("it has been deleted")
    } catch (error) {
        res.status(400).send(error)
    }
})


module.exports = router