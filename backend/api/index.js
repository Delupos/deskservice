const express = require('express')
let router = express.Router()

// Get Routes
const routeCreateUser = require('../api/auth/createUser')
const routeCheckLogin = require('../api/auth/checkLogin')
const routeValidations = require('../api/auth/validations')
const routeGetAllUser = require('../api/auth/getAllUsers')

const routeCreateNewTable = require('../api/table/placeNewTable')
const routeGetAllTable = require('../api/table/getAllTables')

const routeCreateBooking = require('../api/bookings/createBooking')
const routeGetAllBookings = require('../api/bookings/getBookings')
const routeGetSpecificBooking = require('../api/bookings/getSpecificBookings')

// Set Routes
router.use('/createUser', routeCreateUser)
router.use('/checkLogin', routeCheckLogin)
router.use('/validations', routeValidations)
router.use('/getAllUser', routeGetAllUser)

router.use('/createTable', routeCreateNewTable)
router.use('/getAllTables', routeGetAllTable)

router.use('/createBooking', routeCreateBooking)
router.use('/getAllBookings', routeGetAllBookings)
router.use('/getSpecificBookings', routeGetSpecificBooking)

module.exports = router