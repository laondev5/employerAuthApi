const express = require('express')
const router = express.Router()
const refreshTokenController = require('../../controllers/refreshTokenController')

// the route for the registration


router.route('/')
    .get(refreshTokenController.handleRefreshToken)



module.exports = router