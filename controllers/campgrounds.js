const CampGround = require('../models/campground');

module.exports.index = async (req, res) => {
    const campgrounds = await CampGround.find({});
    res.render('campgrounds/index', { campgrounds });
}

module.exports.renderNewForm = (req, res) => res.render('campgrounds/new');

module.exports.createCampGround = async (req, res) => {
    const campground = new CampGround(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully created a new camp ground!');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.showCampGround = async (req, res) => {
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
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campground = await CampGround.findById(id);
    res.render('campgrounds/edit', { campground });
}

module.exports.updateCampGround = async (req, res) => {
    const { id } = req.params;
    const campground = await CampGround.findByIdAndUpdate(id, req.body.campground, { returnDocument: 'after', runValidators: true });
    req.flash('success', 'Successfully edited a camp ground!');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteCampGround = async (req, res) => {
    const { id } = req.params;
    await CampGround.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted a camp ground!');
    res.redirect('/campgrounds');
}