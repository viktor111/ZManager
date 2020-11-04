const express = require('express');
const router = express.Router();

const EmployeeController = require("../controllers/employeeController");

router.get('/', IndexController.get);

module.exports = router;