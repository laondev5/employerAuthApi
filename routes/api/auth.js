const express = require('express')
const router = express.Router()
const authController = require('../../controllers/authController')

// the route for the registration


router.route('/')
    .post(authController.handleLogin)



module.exports = router