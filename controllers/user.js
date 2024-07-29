const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user.js");

const router = express.Router();


// Register
router.get("/sign-up", (req, res, next) => {
    res.render("users/sign-up.ejs");
});

router.post("/sign-up", async (req, res, next) => {
    console.log(req.body)
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const confirmPassword = req.body.confirmPassword;
   
    try {

        const existingUser = await User.findOne({
            username,
            email,
        });

        if (existingUser) {
            return res.send('Ooops somthing went wrong');
        }

        if (password !== confirmPassword) {
            return res.send('Password and Confirm Password must match');
        }

        const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS));
        const payload = {
            username,
            email,
            password: hashedPassword,
        }
        const user = await User.create(payload);
        req.session.user = {
            username: user.username,
            _id: user._id,
        };

        req.session.save(() => {
            res.redirect('/');
        });

        res.send(`Thanks for signing up ${user.username}`);
    } catch (error) {
        // next(error);
        // throw new Error('something went wrong');
        console.log(error);
    }
});

// Login

router.get('/sign-in', (req, res, next) => {
    res.render('users/sign-in.ejs');
});

router.post('/sign-in', async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    console.log(req.body);
    const existingUser = await User.findOne({
        username,
    });

    if (!existingUser) {
        return res.send('Login failed. Please try again.');
    }

    const validPassword = await bcrypt.compare(password, existingUser.password);

    if (!validPassword) {
        res.send('Login failed. Please try again. pass');
    }

    req.session.user = {
        username: existingUser.username,
        role: existingUser.role,
        _id: existingUser._id,
    };

    // res.redirect('/');

    // if we use databse session strategy we need to listen to the session store.
    req.session.save(() => {
        res.redirect("/");
    });
});


router.get("/sign-out", (req, res) => {
    //delete
    req.session.destroy(() => {
        res.redirect("/");
    });
});


module.exports = router;