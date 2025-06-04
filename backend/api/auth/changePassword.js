const express = require('express')
const router = express.Router()
const user = require('../../models/user')
const bcrypt  = require('bcrypt')

router.put('/', async(req, res) => {
    try {
        const email = req.body.email
        const newPsw = req.body.newPsw
        const secQuest = req.body.secQuest

        const userProfil = await user.findOne({
            where : {
                email: email
            }
        })

        if(!userProfil) {
            res.status(404).json({
                success: false,
                error: 'User not found'
            })  
        } else if(userProfil.dataValues.blocked == true) {
            res.status(401).json({
                success: false,
                error: 'User blocked'
            })  
        } else {

            if(userProfil.dataValues.secQuest != secQuest) {
                return res.status(401).json({
                    success: false,
                    error: 'Wrong Secret Question'
                })
            }

            await user.update(
                { 
                    'hashPsw': await bcrypt.hash(newPsw, 10)
                },
                {
                    where: {
                        email: email
                    }
                }
            )
            res.status(200).json({
                success: true
            })
            
        }

    } catch(err) {
        console.log(err)
        res.status(500).json({
            success: false,
            error: err
        })
    }
})

module.exports = router