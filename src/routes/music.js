const express = require('express');
const router = express.Router();
const {ensureAuth, ensureGuest} = require('../middleware/auth');
const musicController =  require('../app/controllers/MusicController');

router.get('/*', ensureAuth, musicController.index);
module.exports = router;