const express = require('express')
const router = express.Router()

const Rate = require('../models/rate');
const Movie = require('../models/movie');





router.get('/add/:id', async (req, res) => {
    try {
        // const userId = req.session.user._id;
        const movieId = req.params.id;
        const rate = await Movie.findById(movieId).populate('rates');
        console.log(rate);
        res.render('rates/add.ejs', { rates: rate.rates, movieId })
    } catch (err) {
        console.log(err);
    }
})


router.post('/add', async (req, res) => {
    try {
        const userId = req.session.user._id;
        const movieId = req.body.movie;
        // console.log("movie ", req.body.movie);
        const rate = await Rate.findOne({ user: userId, movie: movieId });
        console.log(rate);
        const obj = {
            rate: req.body.rate,
            comment: req.body.comment,
            movie: movieId,
            user: userId
        }
        if (rate){
            rate.Rate = rate;
            await rate.save();
        }else{
            const addRate = await Rate.create(obj);
            await addRate.save();
        }
        res.redirect(`/movies/detail/${movieId}`);
    } catch (err) {
        console.log(err);
    }
});

router.delete('/delete/:id', async (req, res) => {
    try {
        const userId = req.session.user._id;
        const movieId = req.params.id;
        let removeRate = await Rate.findOne({ user: userId });
        console.log(movieId);
        if (removeRate) {
            removeRate.rate = removeRate.rate.filter(id => id.toString() !== movieId)
        }
        console.log(removeRate);
        console.log(movieId);
        await removeRate.save()
        res.redirect('/movies/rates');
    } catch (err) {
        console.log(err);
    }
})

router.get('/', async (req, res) => {
    console.log('dgfcj');
    try {
        const userId = req.session.user._id;
         const rate = await Rate.find({ user: userId }).populate('movie');
        console.log(rate);
        res.render('rates/index.ejs', { rate } );
    } catch (err) {
        console.log(err);
    }
})



module.exports = router;