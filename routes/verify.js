const jwt = require('jsonwebtoken')
require('dotenv/config')

const verifiedToken = (req, res, next) => {
    const authheaders = req.headers.token;
    if (authheaders) {
        const token = authheaders
        jwt.verify(token, process.env.TOKEN, (err, verified) => {
            if (err) return res.status(400).send('token is not correct')
            req.user = verified;
            next()
        })
    } else {
        res.status(401).send('you dont have acess to this site')
    }
}


const verifiedAuth = (req, res, next) => {
    verifiedToken(req, res, () => {
        if(req.user.id == req.params.id || req.user.isAdmin) {
            next()
        } else {
            res.status(400).send('You can only change your account')
        }
    })
}

const verifiedAdmin = (req, res, next) => {
    verifiedToken(req, res, () => {
        if (req.user.isAdmin) {
            next()
        } else {
            res.status(400).send('Only admin can acess this page')
        }
    })
}


module.exports= {verifiedToken, verifiedAuth, verifiedAdmin}