const express = require('express');
const router = express.Router();
const CampGround = require('../models/campground');
const { campGroundSchema } = require('../schemas');
const ExpressError = require('../utils/ExpressError');

const validateCampGround = (req, res, next) => {
    const { error } = campGroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        next(new ExpressError(msg, 400));
    } else {
        next();
    }
};

router.get('/', async (req, res) => {
    const campgrounds = await CampGround.find({});
    res.render('campgrounds/index', { campgrounds });
});

router.get('/new', (req, res) => {
    res.render('campgrounds/new');
});

router.post('/', validateCampGround, async (req, res) => {
    const campground = new CampGround(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await CampGround.findById(id).populate('reviews');
    res.render('campgrounds/show', { campground });
});

router.get('/:id/edit', async (req, res) => {
    const { id } = req.params;
    const campground = await CampGround.findById(id);
    res.render('campgrounds/edit', { campground });
});

router.put('/:id', validateCampGround, async (req, res) => {
    const { id } = req.params;
    const campground = await CampGround.findByIdAndUpdate(id, req.body.campground, { returnDocument: 'after', runValidators: true });
    res.redirect(`/campgrounds/${campground._id}`);
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    await CampGround.findByIdAndDelete(id);
    res.redirect('/campgrounds');
});

module.exports = router;