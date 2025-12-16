const express = require('express');
const router = express.Router();
const myTeamController = require('../controllers/myTeamController');


router.get('/' , myTeamController.getTeamSquad)


module.exports = router