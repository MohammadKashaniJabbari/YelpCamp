const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isLoggedIn, storeReturnTo } = require('../middleware');
const users = require('../controllers/users');

router.get('/register', users.renderRegisterForm);

router.post('/register', users.register);

router.get('/login', users.renderLoginForm);

router.post('/login', storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login);

router.get('/logout', isLoggedIn, users.logout);

module.exports = router;