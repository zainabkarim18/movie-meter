const isSignedIn = (req, res, next) => {
    if (req.session.user) {
        next()
    } else {
        res.redirect("/users/sign-in");
    }
};

module.exports = isSignedIn;