const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const app = express();
const ExpressError = require('./utils/ExpressError');
const catchAsync = require('./utils/catchAsync');
const campgroundRoute = require('./routes/campgrounds');
const reviewRoute = require('./routes/reviews');
const mongoose = require('mongoose');


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
// ===============================================================

// SETS
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// USES
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
    secret: 'thisshouldbeabetterscret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() * 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};
app.use(session(sessionConfig))

app.use(flash());

// Routes
// ==========
app.get('/', (req, res) => {
    res.send('HOME PAGE');
});

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    next();
})

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