const express = require('express')
let router = express.Router()

// Get Routes
const routeCreateUser = require('../api/auth/createUser')
const routeCheckLogin = require('../api/auth/checkLogin')
const routeValidations = require('../api/auth/validations')
const routeGetAllUser = require('../api/auth/getAllUsers')
const routeBlockUser = require('../api/auth/blockUser')
const routeChangePsw = require('../api/auth/changePassword')
const routeDeleteUser = require('../api/auth/deleteUser')

const routeCreateNewTable = require('../api/table/placeNewTable')
const routeGetAllTable = require('../api/table/getAllTables')
const routeDeleteTable = require('../api/table/deleteTable')

const routeCreateBooking = require('../api/bookings/createBooking')
const routeGetAllBookings = require('../api/bookings/getBookings')
const routeGetSpecificBooking = require('../api/bookings/getSpecificBookings')
const routeCheckForFreeTable = require('../api/bookings/checkForFreeTable')
const routeDeleteBooking = require('../api/bookings/deleteBooking')

const routeAppendix = require('../api/images/appendix')

// Middleware
const middleware = require('../api/middleware/verifyToken')

// Set Routes
router.use('/createUser', routeCreateUser)
router.use('/checkLogin', routeCheckLogin)
router.use('/validations', routeValidations)
router.use('/getAllUser', middleware, routeGetAllUser)
router.use('/blockUser', routeBlockUser)
router.use('/changePassword', routeChangePsw)
router.use('/deleteUser/', middleware, routeDeleteUser)

router.use('/createTable', middleware, routeCreateNewTable)
router.use('/getAllTables', middleware, routeGetAllTable)
router.use('/deleteTable/', middleware, routeDeleteTable)

router.use('/createBooking', middleware, routeCreateBooking)
router.use('/getAllBookings', middleware, routeGetAllBookings)
router.use('/getSpecificBookings', middleware, routeGetSpecificBooking)
router.use('/checkForFreeTable', middleware, routeCheckForFreeTable)
router.use('/deleteBooking', middleware, routeDeleteBooking)

router.use('/appendix', routeAppendix)

module.exports = router