const express = require('express');
const router = express.Router();
const { isLoggedIn, validateCampGround, isAuthor } = require('../middleware');
const campgrounds = require('../controllers/campgrounds');

router.route('/')
    .get(campgrounds.index)
    .post(isLoggedIn, validateCampGround, campgrounds.createCampGround);

router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
    .get(campgrounds.showCampGround)
    .put(isLoggedIn, isAuthor, validateCampGround, campgrounds.updateCampGround)
    .delete(isLoggedIn, isAuthor, campgrounds.deleteCampGround);

router.get('/:id/edit', isLoggedIn, isAuthor, campgrounds.renderEditForm);

module.exports = router;