require('dotenv').config();
const express = require('express');
const methodOverride = require('method-override');
const morgan = require('morgan');

// DATABASE
require('./config/db');

const app = express();

// MIDDLEWARE
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));


app.get("/", (req, res) => {
    res.render("index.ejs");
});


app.listen(process.env.PORT, () => {
    console.log(`Application running on port ${process.env.PORT}`);
})