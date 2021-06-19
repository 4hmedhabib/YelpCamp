const express = require('express');
const router = express.Router();

const reviews = require('../controllers/reviews')
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware')


const catchAsync = require('../utils/catchAsync');


router.post('/:id/reviews', isLoggedIn, validateReview, catchAsync(reviews.newReview));

router.delete('/:id/reviews/:reviewId', isLoggedIn, isReviewAuthor, reviews.deleteReview);

module.exports = router;