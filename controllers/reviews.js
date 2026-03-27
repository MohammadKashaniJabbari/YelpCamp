const Review = require('../models/review');
const CampGround = require('../models/campground');

module.exports.createReview = async (req, res) => {
    const campGround = await CampGround.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campGround.reviews.push(review);
    await review.save();
    await campGround.save();
    req.flash('success', 'Successfully added a review!');
    res.redirect(`/campgrounds/${campGround._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await CampGround.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted a review!');
    res.redirect(`/campgrounds/${id}`);
}