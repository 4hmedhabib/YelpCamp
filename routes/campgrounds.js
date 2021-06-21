const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../cloudinary/index');
const upload = multer({ storage: storage });

const catchAsync = require('../utils/catchAsync');
const campgrounds = require('../controllers/campgrounds')


const { isLoggedIn, isAuthor, validateCampground } = require('../middleware')

router.route('/')
    .get(campgrounds.index)
    // .post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground))
    .post(upload.array('image'), (req, res, ) => {
        console.log(req.body)
        res.send('it Works')
    })

router.get('/new', isLoggedIn, campgrounds.renderNewForm);
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

module.exports = router;