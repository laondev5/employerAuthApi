const express = require('express')
const router = express.Router()
const logoutController = require('../../controllers/logoutController')

// the route for the registration


router.route('/')
    .get(logoutController.handleLogout)



module.exports = router