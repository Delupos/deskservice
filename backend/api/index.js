const express = require('express')
let router = express.Router()

// Get Routes
const routeCreateUser = require('../api/auth/createUser')
const routeCheckLogin = require('../api/auth/checkLogin')
const routeValidations = require('../api/auth/validations')

// Set Routes
router.use('/createUser', routeCreateUser)
router.use('/checkLogin', routeCheckLogin)
router.use('/validations', routeValidations)

module.exports = router