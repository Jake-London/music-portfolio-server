module.exports = {
    ensureAuthenticated: function(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash('loginError', 'Please log in to view this page');
        res.redirect('/admin/login');
    },

    deleteAuthenticate: function(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        
        res.json({msg: "Please log in to delete this resource"});
    }
}