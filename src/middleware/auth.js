module.exports = {
    ensureAuth: (req, res, next) => {
        if (req.isAuthenticated() || req.session.isAuth) {
            console.log("Authenticated");
            return next();
        } else {
            console.log("Not Authenticated");
            res.redirect('/login');
        }
    },

    ensureGuest: (req, res, next) => {
        if (req.isAuthenticated() || req.session.isAuth) {
            console.log("Authenticated");
            res.redirect('/music');;
        } else {
            console.log("Not Authenticated");
            return next();
        }
    },
}