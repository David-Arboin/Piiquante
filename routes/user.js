const express = require('express');
const router = express.Router();

//--Permet d'assocoé les controlers aux différentes routes
const userCtrl = require('../controllers/user')

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;