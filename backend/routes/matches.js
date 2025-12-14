const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');


router.post('/create' , matchController.create)
router.get('/:id' , matchController.getMatchDetails)
router.post('/start/:id' , matchController.start)
router.get('/' , matchController.getAllMatches)
router.post('/linup/add' , matchController.addToLinup)
router.post('/linup/update' , matchController.updateLinupPlayer)
router.delete('/linup/delete' , matchController.deleteFromLinup)


module.exports = router