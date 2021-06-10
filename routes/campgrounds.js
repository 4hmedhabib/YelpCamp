const express = require('express');
const router = express.Router();

const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground/campground');
const Review = require('../models/campground/review')

const { campgroundSchema } = require('../schemas')

// Data Validation
const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(',');
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
};

router.get('/', async(req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
});

router.get('/new', (req, res) => {
    res.render('campgrounds/new')
});

router.post('/', validateCampground, catchAsync(async(req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('success', 'Successfully Created New Post')
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.get('/:id', catchAsync(async(req, res, next) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    if (!campground) {
        req.flash('error', "Can't Find that Campground!");
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground })
}));

router.get('/:id/edit', catchAsync(async(req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', "Can't Edit that Campground!");
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground });
}));

router.put('/:id/edit', validateCampground, catchAsync(async(req, res, next) => {
    const { id } = req.params;
    const editCamp = await Campground.findByIdAndUpdate(id, req.body.campground, { runValidators: true });
    if (!editCamp) {
        req.flash('error', "Can't Find that Campground!");
        return res.redirect('/campgrounds')
    }
    req.flash('success', 'Successfully Edited Campground!')
    res.redirect(`/campgrounds/${id}`);
}));

router.delete('/:id/delete', catchAsync(async(req, res) => {
    const { id } = req.params;
    const deletedCamp = await Campground.findByIdAndDelete(id);
    if (!deletedCamp) {
        req.flash('error', "Can't Delete that Campground!");
        return res.redirect('/campgrounds')
    }
    req.flash('success', 'Successfully Deleted Campground!');
    res.redirect('/campgrounds');
}));


module.exports = router;