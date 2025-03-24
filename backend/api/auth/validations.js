const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')

/**
 * API-Call to check if jwt is valid
 * @param {req.headers.authorization} jwt The Token to check
 * @return {json} valid/ invalid
 */
router.get('/', async(req, res, next) => {
    try {

        const token = req.headers.authorization

        if(!token) {
            res.status(401).json({
                success: false,
                error: "Token not found!"
            })
            return;
        }

        if(jwt.verify(token, "DasIstEinGeheimnis", {ignoreExpiration: false})){
            
            res.status(200).json({
                success: true
            })
            return;
        } else {
            res.status(403).json({
                success: false,
                error: "Token is invalid!"
            })
            return;
        }

    } catch (err) {
        res.status(500).json({
            success: false,
            error: err
        })
    }
})

module.exports = router
