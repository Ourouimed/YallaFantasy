const express = require('express');
const router = express.Router();
const myTeamController = require('../controllers/myTeamController');


router.post('/' , myTeamController.getTeam)


module.exports = router