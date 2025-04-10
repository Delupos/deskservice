const express = require('express')
let router = express.Router()

// Get Routes
const routeCreateUser = require('../api/auth/createUser')
const routeCheckLogin = require('../api/auth/checkLogin')
const routeValidations = require('../api/auth/validations')
const routeGetAllUser = require('../api/auth/getAllUsers')

// Set Routes
router.use('/createUser', routeCreateUser)
router.use('/checkLogin', routeCheckLogin)
router.use('/validations', routeValidations)
router.use('/getAllUser', routeGetAllUser)

module.exports = router