const express = require('express');
const router = express.Router();
const {ensureAuth, ensureGuest} = require('../middleware/auth');
const registerController =  require('../app/controllers/RegisterController');

router.get('/', ensureGuest, registerController.index);
router.post('/create', ensureGuest, registerController.create);

module.exports = router;