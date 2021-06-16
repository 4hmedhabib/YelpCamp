const { campgroundSchema, reviewSchema } = require('./schemas')
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground/campground');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You Must be Logged In First!')
        return res.redirect('/login')
    }
    next()
}


module.exports.isAuthor = async(req, res, nex) => {
    const { id } = req.params;
    const camp = await Campground.findById(id)
    if (!req.user._id.equals(camp.author)) {
        req.flash('error', "You don't have any permission!");
        return res.redirect(`/campgrounds/${id}`)
    }
}

module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(',');
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
};

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
};