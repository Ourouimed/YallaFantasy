const express = require('express');
const router = express.Router();
const leagueController = require('../controllers/leagueController');


router.get('/' , leagueController.getAllLeagues)
router.post('/create' , leagueController.createLeague)
router.post('/join' , leagueController.joinLeague)
router.put('/update/:id' , leagueController.updateLeague)
router.delete('/delete/:id' , leagueController.deleteById)
router.get('/:id' , leagueController.getLeaguePage)

module.exports = router