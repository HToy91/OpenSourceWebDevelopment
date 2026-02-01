// Middleware to ensure the user is authenticated
module.exports = function requireAuth(req, res, next) {
    if (req.isAuthenticated()) return next();
    return res.redirect("/auth/login");
};