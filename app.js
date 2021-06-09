const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');

const ExpressError = require('./utils/ExpressError');
const catchAsync = require('./utils/catchAsync');

const campgroundRoute = require('./routes/campgrounds');
const reviewRoute = require('./routes/reviews');

const mongoose = require('mongoose');


// Data Validation
const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(',');
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
};

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
};

// CONNECT TO DB
const db = mongoose.connect('mongodb://localhost:27017/yelp-camp', {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('DATABASE SUCCESSFULLY CONNECTED!!!');
    })
    .catch((err) => {
        console.log('CONNECTION ERROR!!!');
    });


const app = express()

// SETS DECALRE
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

// USE DECLARE
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));



// Routes
// ==========

app.get('/', (req, res) => {
    res.send('HOME PAGE');
});

app.use('/campgrounds', campgroundRoute);
app.use('/', reviewRoute);

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found!', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Something Went Wrong!' } = err;
    res.status(statusCode).render('campgrounds/error', { err });
});

app.listen(3000, () => {
    console.log('App listening on port 3000!');
});