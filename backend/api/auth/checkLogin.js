const express = require('express')
const router = express.Router()
const user = require('../../models/user')
const bcrypt  = require('bcrypt')
const sequelize = require('sequelize')
const jwt = require('jsonwebtoken')
// Need jwt secret

/** 
 * API-Call for Login auth
 * @param {req.body.email} email email from user
 * @param {req.body.password} password password from user
 * @return {json} success/ error
*/
router.post('/', async(req, res) => {
    try {

        const email = req.body.email
        const password = req.body.password

        const userProfil = await user.findOne({
            where : {
                email: email
            }
        })

        if (!userProfil) {
            res.status(404).json({
                success: false,
                error: 'User not found'
            })  
        } else {

            if (userProfil.dataValues.blocked == true) {
                res.status(204).json({
                    success: false,
                    error: 'User blocked'
                })
            } else {

                const check = await bcrypt.compare(password, userProfil.dataValues.hashPsw)
                if (check) {
                    
                    await user.update(
                        { 
                            'loginAttemps': 0,
                            'lastLogin': sequelize.fn("NOW")
                        },
                        {
                            where: {
                                email: email
                            }
                        }
                    )

                    // Update to jwt secret in prod
                    const jwt_secret = "DasIstEinGeheimnis"
                    const token = jwt.sign({
                        name: userProfil.dataValues.name,
                        surname: userProfil.dataValues.surname,
                        email: userProfil.dataValues.email,
                        id: userProfil.dataValues.id,
                        isAdmin: userProfil.dataValues.admin,
                        blocked: userProfil.dataValues.blocked,
                        }, jwt_secret, 
                        {expiresIn: '3h'})

                    res.status(200).json({
                        success: true,
                        accessToken: token
                    })                
                } else {
                    
                    var blocked = false
                    const loginAtt = userProfil.dataValues.loginAttemps + 1
                    if (loginAtt >= 5) {
                        blocked = true
                    }

                    await user.update(
                        { 
                            'loginAttemps': loginAtt,
                            'blocked': blocked
                         },
                        {
                            where: {
                                email: email
                            }
                        }
                    )
                    res.status(401).json({
                        success: false,
                        error: 'Wrong Password'
                    })                 
                } 
            }
        }

    } catch(err) {
        res.status(500).json({
            success: false,
            error: err
        })        
    }
})

module.exports = router
