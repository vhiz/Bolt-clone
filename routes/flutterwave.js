const router = require('express').Router()
require('dotenv/config')
const { verifiedToken } = require('./verify')
const Flutterwave = require('flutterwave-node-v3');
const flw = new Flutterwave(process.env.PUBLIC_KEY, process.env.SECRET_KEY);


router.post('/pay', verifiedToken ,async (req, res) => {
        try {

        const payload = {
               tx_ref:req.body.tx_ref,
                amount:req.body.amount,
                account_bank:req.body.account_bank,
                account_number:req.body.account_number,
                currency:"NGN",
                email:req.body.email,
                phone_number:req.body.phone_number,
                fullname:req.body.fullname
        }

        const response = await flw.Charge.ng(payload)
            console.log(response);
            res.json(response)
    } catch (error) {
            console.log(error)
            res.status(401).send("there was an error")
    }


})



module.exports = router