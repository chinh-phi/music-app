const express = require('express');
const router = express.Router();
const {ensureAuth, ensureGuest} = require('../middleware/auth');
const siteController =  require('../app/controllers/SiteController');

router.get('/', ensureGuest, siteController.index);

module.exports = router;