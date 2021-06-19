const express = require('express');
const router = express.Router();

const catchAsync = require('../utils/catchAsync');
const campgrounds = require('../controllers/campgrounds')


const { isLoggedIn, isAuthor, validateCampground } = require('../middleware')


router.get('/', campgrounds.index);

router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground));

router.get('/:id', catchAsync(campgrounds.showCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

router.put('/:id/edit', isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground));

router.delete('/:id/delete', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));


module.exports = router;