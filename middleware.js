module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You Must be Logged In First!')
        return res.redirect('/login')
    }
    next()
}