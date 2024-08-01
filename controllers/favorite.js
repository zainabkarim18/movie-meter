const express = require('express')
const router = express.Router()

const Movie = require('../models/movie');
const Favorite = require('../models/favorite');
const User = require('../models/user');


router.post('/add/:id', async (req, res) => {
    try {
        const userId = req.session.user._id;
        const movieId = req.params.id;
        let favorite = await Favorite.findOne({user: userId});
        console.log(favorite);
                if (!favorite) {
                    favorite = new Favorite({ user: userId, movies: [movieId]})
                } else if (!favorite.movies.includes(movieId)){
                    favorite.movies.push(movieId);
                }else{
                console.log('added');
                }
                await favorite.save();
                res.redirect(`/movies/favorites`);
            }catch(err){
                console.log(err);
            }
})

router.get('/', async(req,res)=>{
    try {
        const userId = req.session.user._id;
        const favorite = await Favorite.findOne({ user: userId }).populate('movies');
        console.log(favorite);
        res.render('favorites/index.ejs', { movies: favorite.movies} );
    } catch (err) {
        console.log(err);
    }
})

router.delete('/delete/:id', async (req, res) => {
    try {
        const userId = req.session.user._id;
        const movieId = req.params.id;
        let removeMovie = await Favorite.findOne({ user: userId });
        console.log(movieId);
        if (removeMovie){
            removeMovie.movies = removeMovie.movies.filter(id => id.toString() !== movieId)
        }
        console.log(removeMovie);
        console.log(movieId);
        await removeMovie.save()
        res.redirect('/movies/favorites');
    } catch (err) {
        console.log(err);
    }
})
module.exports = router;