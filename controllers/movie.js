const express = require('express')
const router = express.Router()

const Movie = require('../models/movie');
// const User = require('../models/user');

// index page (show all movies)
router.get('/', async (req, res) => {
    try {
        const allMovies = await Movie.find({});
        console.log(allMovies);
        res.render('movies/index.ejs', { allMovies })
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
});


router.get('/add', async (req, res) => {
    res.render('movies/add.ejs')
})


router.post('/', async (req, res) => {
    console.log(req.body);
    await Movie.create(req.body);
    res.redirect('/movies/index');
});

router.get('/edit', )

module.exports = router;