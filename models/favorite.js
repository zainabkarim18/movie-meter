const mongoose = require('mongoose');

const favoriteSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    movies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie'
    }],
})

const Favorite = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorite;