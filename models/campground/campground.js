const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// CONNECT TO DB
const db = mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('DATABASE CONNECTED!!!')
}).catch((error) => {
    console.log('CONNECTION ERROR!')
    console.log(error)
})

const yelcampSchema = new Schema({
    title: String,
    location: String,
    image: String,
    description: String,
    price: Number,
});


module.exports = mongoose.model('Campground', yelcampSchema)