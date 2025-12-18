const express = require('express');
const router = express.Router();
const myTeamController = require('../controllers/myTeamController');


router.get('/' , myTeamController.getTeamSquad)
router.post('/save' , myTeamController.saveTeam)
router.get('/pick-team' , myTeamController.getPickedTeam)
router.post('/pick-team/save' , myTeamController.savePickedTeam)


module.exports = router