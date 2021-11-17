const express = require('express');
const router = express.Router();
const passport = require('passport');
const {ensureAuth, ensureGuest} = require('../middleware/auth');
const loginController =  require('../app/controllers/LoginController');

router.get('/', ensureGuest, loginController.index);
router.post('/', loginController.login);
router.get('/google',
  passport.authenticate('google', { scope: ['profile'] }));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/music');
  }
);


module.exports = router;