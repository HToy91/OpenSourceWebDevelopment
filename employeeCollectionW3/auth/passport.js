// Passport configuration for authentication
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy; // Import Local Strategy for username/password authentication
const bcrypt = require("bcrypt"); // Import bcrypt for password hashing
const User = require("../models/User");

passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const user = await User.findOne({username});

            // Check if user exists
            if (!user) return done(null, false, {message: "Invalid User not found"});

            const ok = await bcrypt.compare(password, user.passwordHash);

            // If password does not match
            if (!ok) return done(null, false, {message: "Invalid Password"});

            return done(null, user); // Successful authentication
        } catch (err) {
            return done(err);
        }
    })
);

// Serialize user to store in session. Serialize means converting user object to an identifier (like user ID)
passport.serializeUser((user, done) => {
    // Store user ID in session
    done(null, user.id);
});

// Deserialize user from session. Deserialize means fetching user details using the ID stored in session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id).lean();
        done(null, user); // Attach user object to req.user
    } catch (err) {
        done(err);
    }
});