const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const User = require("../models/User");
const router = express.Router();

// Get route to display register and login
router.get("/register", (req, res) => res.render("auth/register"));

router.get("/login", (req, res) => res.render("auth/login"));

// Post route to handle user registration
router.post("/register", async (req, res) => {
    try {
        const {username, email, password} = req.body;
        const existingUsername = await User.findOne({username});

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).render("auth/register", {error: "Invalid email format"});
        }
        const existingEmail = await User.findOne({email});

        if (existingUsername || existingEmail) {
            return res.status(400).render("auth/register", {error: "Username or Email already exists"});
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create new user
        await User.create({username, email, passwordHash});
        res.redirect("/auth/login");

    } catch (err) {
        res.status(400).render("auth/register", {error: "Registration failed"});
    }
});

// function to validate login input
function validateLogin(req, res, next) {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).render("auth/login", {
            error: "Username and password are required.",
            username,
        });
    }

    next();
}

router.post("/login", validateLogin, (req, res, next) => {
    passport.authenticate("local", (err, user) => {
        if (err) return next(err);

        if (!user) {
            return res.status(401).render("auth/login", {
                error: "Invalid username or password.",
                username: req.body.username,
            });
        }

        req.logIn(user, (err) => {
            if (err) return next(err);
            return res.redirect("/");
        });
    })(req, res, next);
});


// Logout route
router.post("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect("/");
    })
});

module.exports = router;