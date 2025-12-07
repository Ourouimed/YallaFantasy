const express = require('express');
const router = express.Router();
const playersController = require('../controllers/playersController');
const multer = require('multer');

// Use memory storage because we'll send the file directly to Cloudinary
const storage = multer.memoryStorage();
const upload = multer({ storage });


router.get('/' , playersController.getAllPlayers)
router.post('/create' , upload.single("player_image") , playersController.create)

module.exports = router