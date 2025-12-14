const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
// const verifyJWT = require('../middelware/verifyJWT'); // Add if needed, assuming admin protection usually

router.get('/', settingsController.getSettings);
router.put('/', settingsController.updateSettings);

module.exports = router;
