const express = require('express')
const router = express.Router()
const registerController = require('../../controllers/registerController')

// the route for the registration

router.route('/')
    .post(registerController.handleNewUser)



module.exports = router