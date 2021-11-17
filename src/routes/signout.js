const express = require('express');
const router = express.Router();
const {ensureAuth, ensureGuest} = require('../middleware/auth');
const signoutController =  require('../app/controllers/SignoutController');

router.get('/', ensureGuest, signoutController.index);

module.exports = router;