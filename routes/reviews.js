const express = require('express');
const router = express.Router({ mergeParams: true });
const Review = require('../models/review');
const CampGround = require('../models/campground');
const { reviewSchema } = require('../schemas');
const ExpressError = require('../utils/ExpressError');

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        next(new ExpressError(msg, 400));
    } else {
        next();
    }
};

router.post('/', validateReview, async (req, res) => {
    const campGround = await CampGround.findById(req.params.id);
    const review = new Review(req.body.review);
    campGround.reviews.push(review);
    await review.save();
    await campGround.save();
    res.redirect(`/campgrounds/${campGround._id}`);
});

router.delete('/:reviewId', async (req, res) => {
    const { id, reviewId } = req.params;
    await CampGround.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
});

module.exports = router;