const express = require('express');
const router = express.Router();
const user = require('../../models/user');
const bcrypt = require('bcrypt');

/** 
 * API-Call to create User
 * @param {req.body.email} email email from user
 * @param {req.body.name} name name from user
 * @param {req.body.surname} surname surname from user
 * @param {req.body.password} password password from user
 * @return {json} success/ error
*/
router.post('/', async(req, res) => {
  try {
    
    // Muss noch ausgelagert werden
    if (req.body.masterkey != "FOM-2022") {
      res.status(401).json({
        success: false,
        error: "Invaliden Masterkey"
      })  
      return;     
    }

    const temp = {
        email: req.body.email,
        name: req.body.name,
        surname: req.body.surname,
        hashPsw: await bcrypt.hash(req.body.password, 10)
    }

    await user.create(temp)

    res.status(200).json({
        success: true
    })

  } catch (error) {
    console.log(error)
    res.status(500).json({
        success: false,
        error: error
    })    
  }  
})

module.exports = router
