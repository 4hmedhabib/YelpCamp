const Campground = require('../models/campground/campground');

module.exports.index = async(req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
};

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new')
};

module.exports.createCampground = async(req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.author = req.user._id;
    await campground.save()
    req.flash('success', 'Successfully Created New Post')
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.showCampground = async(req, res, next) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!campground) {
        req.flash('error', "Can't Find that Campground!");
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground })
};

module.exports.renderEditForm = async(req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', "Can't Edit that Campground!");
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground });
};

module.exports.updateCampground = async(req, res, next) => {
    const { id } = req.params;
    const editCamp = await Campground.findByIdAndUpdate(id, req.body.campground, { runValidators: true });
    if (!editCamp) {
        req.flash('error', "Can't Find that Campground!");
        return res.redirect('/campgrounds')
    }
    req.flash('success', 'Successfully Edited Campground!')
    res.redirect(`/campgrounds/${id}`);
};

module.exports.deleteCampground = async(req, res, next) => {
    const { id } = req.params;
    const deletedCamp = await Campground.findByIdAndDelete(id);
    if (!deletedCamp) {
        req.flash('error', "Can't Delete that Campground!");
        return res.redirect('/campgrounds')
    }
    req.flash('success', 'Successfully Deleted Campground!');
    res.redirect('/campgrounds');
}