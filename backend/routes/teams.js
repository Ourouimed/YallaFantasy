const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamsController');
const multer = require('multer');

// Use memory storage because we'll send the file directly to Cloudinary
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/create' , upload.single("flag") , teamController.create)

module.exports = router