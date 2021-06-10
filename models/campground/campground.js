const mongoose = require('mongoose');
const Review = require('./review')
const Schema = mongoose.Schema;


// CONNECT TO DB
const db = mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
}).then(() => {
    console.log('DATABASE SUCCESSFULLY CONNECTED!!!')
}).catch((error) => {
    console.log('CONNECTION ERROR!')
    console.log(error)
})

const CampgroundSchema = new Schema({
    title: String,
    location: String,
    image: String,
    description: String,
    price: Number,
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }, ]
});

CampgroundSchema.post('findOneAndDelete', async function(doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        });
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema)