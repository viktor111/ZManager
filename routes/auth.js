const express = require('express');
const router = express.Router();

const AuthController = require("../controllers/authController");

router.get('/register', AuthController.GetRegister);
router.get('/login', AuthController.GetLogin);
router.get('/resetpass', AuthController.GetResetPassword);

router.post('/register', AuthController.PostRegister);
router.post('/login', AuthController.PostLogin);
router.post('/logout', AuthController.PostLogout);
router.post('/sendResetEmail', AuthController.SendResetEmail)
router.post('/resetpass' ,AuthController.PostResetPassword)

module.exports = router;