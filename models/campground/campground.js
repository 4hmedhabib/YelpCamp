const mongoose = require('mongoose');
const Review = require('./review')
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});
const opts = { toJSON: { virtuals: true } };

ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/c_scale,w_200')
})



const CampgroundSchema = new Schema({
    title: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    images: [ImageSchema],
    description: String,
    price: Number,
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }, ]
}, opts);

CampgroundSchema.virtual('properties.popMarkUp').get(function() {
    return `
        <a href="/campgrounds/${this._id}">${this.title}</a>
        <p>${this.description}</p>
    `
})

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