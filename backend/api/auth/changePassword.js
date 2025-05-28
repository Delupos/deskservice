const express = require('express')
const router = express.Router()
const user = require('../../models/user')
const bcrypt  = require('bcrypt')

router.put('/', async(req, res) => {
    try {
        const email = req.body.email
        const oldPsw = req.body.oldPsw
        const newPsw = req.body.newPsw

        if(req.body.oldPsw === req.body.newPsw) {
            return res.status(400).json({
                success: false,
                error: 'Das neue Passwort darf nicht dem alten entsprechen'
            }) 
        }

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

            const check = await bcrypt.compare(oldPsw, userProfil.dataValues.hashPsw)

            if(check) {
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
            } else {
                res.status(403).json({
                    success: false,
                    error: "Wrong Password"
                })
            }
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