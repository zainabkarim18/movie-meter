//Middleware for routes that require a logged in user
module.exports = function (req, res, next) {
    console.log(req.session.user);
    //pass the req/res to the next middleware/route handler
    if (req.session.user && req.session.user.role == "admin") {
        return next();
    } else {
        //Redirect to login if the user is not already logged in
        res.redirect('/');
    }
}


