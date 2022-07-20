const Vehicle = require('../models/Vehicle')
const Driver = require('../models/Driver')
const { verifiedAuth, verifiedToken} = require('./verify')


const router = require('express').Router()


router.post('/new/:id',verifiedAuth, async (req, res) => {
    
    const driverId = req.params.id
    const newVehicle = await new Vehicle(req.body)
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

router.get('/all/cars', verifiedToken, async (req, res) => {
    try {
        const cars= await Vehicle.find()
        res.status(200).send(cars)
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