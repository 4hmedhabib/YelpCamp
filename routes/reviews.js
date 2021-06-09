const express = require('express');
const router = express.Router();
const Campground = require('../models/campground/campground');
const Review = require('../models/campground/review');
const { reviewSchema } = require('../schemas');

const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

router.post('/campgrounds/:id/reviews', validateReview, catchAsync(async(req, res, next) => {

    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    console.log(review);
    campground.reviews.push(review);

    await review.save();
    await campground.save();

    res.redirect(`/campgrounds/${campground._id}`)
}));

router.delete('/campgrounds/:id/reviews/:reviewId', async(req, res, next) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId)
    res.redirect(`/campgrounds/${id}`)
});

module.exports = router;