const express = require('express');
const router = express.Router();
const Campground = require('../models/campground/campground');
const Review = require('../models/campground/review');
const { reviewSchema } = require('../schemas');
const { validateReview } = require('../middleware')


const catchAsync = require('../utils/catchAsync');


router.post('/:id/reviews', validateReview, catchAsync(async(req, res, next) => {

    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);

    await review.save();
    await campground.save();

    res.redirect(`/campgrounds/${campground._id}`)
}));

router.delete('/:id/reviews/:reviewId', async(req, res, next) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId)
    res.redirect(`/campgrounds/${id}`)
});

module.exports = router;