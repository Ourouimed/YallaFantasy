const express = require('express');
const router = express.Router();
const fantasyTeamsController = require('../controllers/fantasyTeamsController');
const verifyJWT = require('../middelware/verifyJWT');

router.post('/', verifyJWT, fantasyTeamsController.createTeam);
router.get('/my-team', verifyJWT, fantasyTeamsController.getMyTeam);
router.post('/squad', verifyJWT, fantasyTeamsController.saveSquad);

module.exports = router;
