const express = require('express');
const router = express.Router();
const myTeamController = require('../controllers/myTeamController');


router.get('/' , myTeamController.getTeamSquad)
router.post('/save' , myTeamController.saveTeam)


module.exports = router