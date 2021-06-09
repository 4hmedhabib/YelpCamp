const mongoose = require('mongoose')
const Schema = mongoose.Schema;

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

const reviewSchema = new Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    body: {
        type: String,
    },

});


module.exports = mongoose.model('Review', reviewSchema);