const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');


router.post('/register' , authController.register)
router.post('/login' , authController.login)
router.post('/verify-email' , authController.verfifyEmail)
router.get('/verify-session' , authController.verfifySession)
router.post('/logout' , authController.logout)

module.exports = router