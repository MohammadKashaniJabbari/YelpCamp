const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const campGroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

campGroundSchema.post('findOneAndDelete', async function (campGround) {
    if (campGround?.reviews.length > 0) {
        await Review.deleteMany({ _id: { $in: campGround.reviews } });
    }
});

module.exports = mongoose.model('CampGround', campGroundSchema);