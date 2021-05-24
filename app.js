const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate')
const mongoose = require('mongoose');
const Campground = require('./models/campground/campground');

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
    })

const app = express()


// SETS DECALRE
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

// USE DECLARE
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))


// Routes
// ==========
app.get('/', (req, res) => {
    res.send('HOME PAGE');
});

app.get('/campgrounds', async(req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
});

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new')
});

app.post('/campgrounds', async(req, res) => {
    const camp = await Campground(req.body.campground);
    await camp.save()
    res.redirect(`/campgrounds/${camp._id}`)
})

app.get('/campgrounds/:id', async(req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/show', { campground })

});

app.get('/campgrounds/:id/edit', async(req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    console.log(campground);
    res.render('campgrounds/edit', { campground })
});

app.put('/campgrounds/:id/edit', async(req, res) => {
    const { id } = req.params;
    const editCamp = await Campground.findByIdAndUpdate(id, req.body.campground);
    res.redirect(`/campgrounds/${id}`)
})

app.delete('/campgrounds/:id/delete', async(req, res) => {
    const { id } = req.params;
    const deletedCamp = await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
})




app.listen(3000, () => {
    console.log('App listening on port 3000!');
});