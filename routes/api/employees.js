const express = require('express')
const router = express.Router()
const rolesList = require('../../config/rolesList');
const verifiedRoles = require('../../middleware/verifyRoles')
const {getAllEmployees,
       createNewEmployee, 
       updateEmployee, 
       deleteEmployee,
       getEmployee} = require('../../controllers/employeesController')

router.route('/')
        .get( getAllEmployees)
        .post(verifiedRoles(rolesList.Admin, rolesList.Editor),createNewEmployee)
        .put(verifiedRoles(rolesList.Admin, rolesList.Editor),updateEmployee)
        .delete(verifiedRoles(rolesList.Admin),deleteEmployee);

router.route('/:id')
        .get(getEmployee)

module.exports = router