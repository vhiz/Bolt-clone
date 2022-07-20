const router = require('express').Router()
const jwt = require('jsonwebtoken')
require('dotenv/config')

const verifiedToken = (req, res, next) => {
    const authHeaders = req.headers.token
    if (authHeaders) {
        const token = authHeaders.split(" ")[1]
        jwt.verify(token, process.env.TOKEN, (err, verified) => {
            if (err) return res.status(400).send('Token is not correct')
            req.user= verified
        })
    } else {
        return res.status(400).send('you dont acess')
    }
}

const verifiedUser = (req, res, next) => {
    verifiedToken(req, res, () => {
        if (req.user.id == req.params.id || req.user.isAdmin) {
            next()
        } else {
            res.status(400).send('you can only use for your account')
        }
    })
}

const verifiedAdmin = (req, res, next) => {
    verifiedToken(req, res, () => {
        if (req.user.id ==  req.user.isAdmin) {
            next()
        } else {
            res.status(400).send('Admin use only')
        }
    })
}



module.exports= {verifiedAdmin, verifiedUser, verifiedToken}