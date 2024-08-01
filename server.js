require('dotenv').config();
const express = require('express');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const isSignedIn = require('./middleware/is-signed-in');
const passUserToView = require('./middleware/pass-user-to-view');
const multer = require("multer");
// DATABASE
require('./config/db');

const app = express();
// app.use(express.static(__dirname + '/public'));
app.use(express.static("public"));
// const upload = multer({ dest: "./public/" });

// CONTROLLERS
const movieCtrl = require('./controllers/movie');
const userCtrl = require('./controllers/user');
const rateCtrl = require('./controllers/rate');
const favoriteCtrl = require('./controllers/favorite')
// const uplodeImage = require('./controllers/uplodeImage');

// MIDDLEWARE
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        store: MongoStore.create({
            mongoUrl: process.env.MONGODB_URL,
        }),
    })
);

app.use(passUserToView);

app.get('/vip-lounge', isSignedIn, (req, res, next) => {
    res.send(`Welcome to the party ${req.session.user.username}.`);
});

// ROUTES
app.use('/movies', movieCtrl);
// app.use('/movie', uplodeImage)
app.use('/users', userCtrl);
app.use('/movies/rates', rateCtrl);
app.use('/movies/favorites', favoriteCtrl);


app.get('/', (req, res, next) => {
    user = req.session.user;
    res.render('index.ejs');
});



app.listen(process.env.PORT, () => {
    console.log(`Application running on port ${process.env.PORT}`);
})