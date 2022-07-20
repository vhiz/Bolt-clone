const express = require('express')
const app = express()
const { createServer } = require('http')
const { Server } = require('socket.io')
const httpServer = createServer(app)
const io = new Server(httpServer)
const mongoose = require('mongoose')
require('dotenv/config')
const morgan = require('morgan')
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const driverRoutes = require('./routes/driver')


mongoose.connect(process.env.CLONE, () => {
    console.log('mongoose is connected')
})

app.get('/', (req, res) => {
    res.send('welcome')
})

app.use(morgan('combined'))
app.use(express.json())
app.use('/auth', authRoutes)
app.use('/user', userRoutes)
app.use('/driver', driverRoutes)

const Port = process.env.PORT || 3000

httpServer.listen(Port, () => {
    console.log(`APP IS UP AT ${Port}`)
})