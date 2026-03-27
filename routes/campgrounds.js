const express = require('express');
const router = express.Router();
const CampGround = require('../models/campground');
const { isLoggedIn, validateCampGround, isAuthor } = require('../middleware');

router.get('/', async (req, res) => {
    const campgrounds = await CampGround.find({});
    res.render('campgrounds/index', { campgrounds });
});

router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
});

router.post('/', isLoggedIn, validateCampGround, async (req, res) => {
    const campground = new CampGround(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully created a new camp ground!');
    res.redirect(`/campgrounds/${campground._id}`);
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await CampGround.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
});

router.get('/:id/edit', isLoggedIn, isAuthor, async (req, res) => {
    const { id } = req.params;
    const campground = await CampGround.findById(id);
    res.render('campgrounds/edit', { campground });
});

router.put('/:id', isLoggedIn, isAuthor, validateCampGround, async (req, res) => {
    const { id } = req.params;
    const campground = await CampGround.findByIdAndUpdate(id, req.body.campground, { returnDocument: 'after', runValidators: true });
    req.flash('success', 'Successfully edited a camp ground!');
    res.redirect(`/campgrounds/${campground._id}`);
});

router.delete('/:id', isLoggedIn, isAuthor, async (req, res) => {
    const { id } = req.params;
    await CampGround.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted a camp ground!');
    res.redirect('/campgrounds');
});

module.exports = router;