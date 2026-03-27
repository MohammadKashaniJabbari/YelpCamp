const express = require('express');
const router = express.Router();
const { isLoggedIn, validateCampGround, isAuthor } = require('../middleware');
const campgrounds = require('../controllers/campgrounds');

router.get('/', campgrounds.index);

router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.post('/', isLoggedIn, validateCampGround, campgrounds.createCampGround);

router.get('/:id', campgrounds.showCampGround);

router.get('/:id/edit', isLoggedIn, isAuthor, campgrounds.renderEditForm);

router.put('/:id', isLoggedIn, isAuthor, validateCampGround, campgrounds.updateCampGround);

router.delete('/:id', isLoggedIn, isAuthor, campgrounds.deleteCampGround);

module.exports = router;