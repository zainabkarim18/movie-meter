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
    try { 
        res.render('movies/add.ejs') 
    }catch(err){
        console.log(err);
    }

})


router.post('/add', async (req, res) => {
    try{
        console.log(req.body);
        const addMovie = await Movie.create(req.body);
        console.log(addMovie);
        res.redirect('/movies');
    }catch(err){
        console.log(err);
    }
});

router.get('/detail/:id',async(req, res) => {
    try{
        console.log(req.params.id);
        const oneMovie = await Movie.findById(req.params.id);
        console.log(oneMovie);
        res.render(`movies/detail.ejs`, { oneMovie });
    }catch(err){
        console.log(err);
    }
    
});

router.get('/edit/:id', async (req, res) => {
    try{
        console.log(req.params.id);

        const editMovie = await Movie.findById(req.params.id)
        res.render("movies/edit.ejs", { editMovie })
    }catch(err){
        console.log(err);
    }

});


router.put('/update/:id', async (req, res) => {
    console.log('add');
    try { 
        console.log(req.body);
        console.log(req.params.id);
        const updateMovie = await Movie.findByIdAndUpdate(req.params.id, req.body);
        console.log(updateMovie);
        res.redirect('/movies');
    } catch (err) {
        console.log(err);
    }
})

router.delete('/delete/:id', async (req, res) => {
    try {
        console.log(req.params.id);
        const delMovie = await Movie.findByIdAndDelete(req.params.id);
        console.log(delMovie);
        res.redirect('/movies');
    } catch (err) {
        console.log(err);
    }
})

module.exports = router;