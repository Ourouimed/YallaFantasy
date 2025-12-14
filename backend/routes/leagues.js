const express = require('express');
const router = express.Router();
const leaguesController = require('../controllers/leaguesController');
const verifyJWT = require('../middelware/verifyJWT');

router.post('/', verifyJWT, leaguesController.createLeague);
router.post('/join', verifyJWT, leaguesController.joinLeague);
router.get('/my-leagues', verifyJWT, leaguesController.getMyLeagues);
router.get('/:id', verifyJWT, leaguesController.getLeagueDetails);

module.exports = router;
