const express = require('express');
const router = express.Router();
const roundController = require('../controllers/roundController');


router.post('/create' , roundController.create)
router.get('/' , roundController.getAllrounds)
router.delete('/delete' , roundController.delete)
router.put('/update/:id' , roundController.update)


module.exports = router