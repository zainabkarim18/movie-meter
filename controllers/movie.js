const express = require('express')
const router = express.Router()
const isAdmin = require("../middleware/isAdmin")
const Movie = require('../models/movie');
const Rate = require('../models/rate');

const cloudinary = require('cloudinary').v2;

(async function () {

    // Configuration
    cloudinary.config({
        cloud_name: 'ddou1t5et',
        api_key: '483863598471435',
        api_secret: 'R2DedvQ3tdUNDUA18V9JI-KkNfw' // Click 'View Credentials' below to copy your API secret
    });

})();


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


router.get('/add',isAdmin, async (req, res) => {
    try { 
        res.render('movies/add.ejs') 
    }catch(err){
        console.log(err);
    }

})

//Multer 
const multer = require("multer");
const User = require('../models/user');
const storage = multer.diskStorage({
    destination:  (req, file, cb) => {
        cb(null, './public/uploads/')
    },
    filename: (req, file, cb) => {
        let extArray = file.mimetype.split("/");
        let extension = extArray[extArray.length - 1];
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + "." + extension);
    }
})

const upload = multer({ storage: storage });

router.post('/add', upload.single('image'), async (req, res) => {
    try{
        const addMovie = await Movie.create(req.body);
        
        if(req.file){
            addMovie.image = req.file.filename;
            console.log("path",req.file.path);
            const uploadResult = await cloudinary.uploader
                .upload(
                req.file.path
                ).then(res=>{
                    console.log("res",res);
                    addMovie.image = res.secure_url;
                })
                .catch((error) => {
                    console.log(error);
                });
        }
        else
            addMovie.image = "https://res.cloudinary.com/ddou1t5et/image/upload/v1722478414/vmqp0glwq0mzm40gtpdd.jpg"
        console.log(req.body);
        await addMovie.save()
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
        try {
            const allRates = await Rate.find({ movie: req.params.id})
            let counter = 0,sum=0,avgRate;
            allRates.forEach(r => {
                counter ++;
                sum+= r.rate;
            });
            if (sum!== 0){
                avgRate = sum / counter;
            }  else{
                avgRate = 0
            }
            try {
                // const user = await User.findById(oneMovie.owner);
                // , user
                // console.log("user",user);
                res.render(`movies/detail.ejs`, { oneMovie, allRates, avgRate });
            } catch (error) {
                console.log(error);
            }
            console.log(avgRate);
            
            
        } catch (err) {
            console.log(err);
        }
        
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

router.put('/update/:id',upload.single('image'), async (req, res) => {
    console.log('add');
    try { 
        console.log(req.body);
        console.log(req.params.id);
        const movieEdit = req.body;
        if (req.file) {
            // movieEdit.image = req.file.filename;
            console.log("path", req.file.path);
            const uploadResult = await cloudinary.uploader
                .upload(
                    req.file.path
                ).then(res => {
                    console.log("res", res);
                    movieEdit.image = res.secure_url;
                })
                .catch((error) => {
                    console.log(error);
                });
        }
        const updateMovie = await Movie.findByIdAndUpdate(req.params.id, movieEdit);
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