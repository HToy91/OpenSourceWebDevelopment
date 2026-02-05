const {timeStamp, error} = require("console"); // Import console methods
const express = require("express"); // Import Express framework
const path = require("path"); // Import path module
const methodOverride = require("method-override");
const app = express(); // Create an Express application
const fs = require("fs"); // Import file system module
const port = process.env.PORT || 3000; // Set port from environment variable or default to 3000
require("dotenv").config(); // Load environment variables from .env file
const mongoose = require("mongoose");
const MONGO_URI = process.env.MONGO_URI; // Get MongoDB URI from environment variables
const employeesRouter = require("./routes/employees"); // Import employees router
const {engine} = require("express-handlebars"); // Import express-handlebars

const session = require("express-session");
const {MongoStore} = require("connect-mongo");
const passport = require("passport");

require("./auth/passport"); // Import passport configuration

// Setup templating engine
app.engine("hbs", engine({
    extname: ".hbs",
    helpers: { // needed for comparison in Handlebars templates. helpers are like functions that can be called from templates
        ifEquals(a, b, options) {
            return a === b ? options.fn(this) : options.inverse(this); // Return true block if equal, else false block
        },
        formatDate(dateString) {
            // const date = new Date(dateString);
            // const year = date.getFullYear();
            // const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
            // const day = date.getDate().toString().padStart(2, '0');
            // return `${year}-${month}-${day}`;

            return new Date(dateString).toISOString().split("T")[0];
        }
    }
})); // Register Handlebars engine
app.set("view engine", "hbs"); // Set view engine to Handlebars
app.set("views", path.join(__dirname, "views")); // Set views directory

// Check if MONGO_URI is defined
if (!MONGO_URI) {
    console.log("Mongo_URI not defined in .env file");
    process.exit(1); // Exit process if MONGO_URI is not defined. 1 indicates failure
}

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));
// Middleware to parse JSON request bodies
app.use(express.json());
app.use(express.urlencoded({extended: true})); // To parse form data
app.use(methodOverride("_method")); // To support PUT and DELETE methods via query parameter

async function connectToMongo() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Failed to connect to MongoDB", err.message);
        process.exit(1); // Exit process if unable to connect. 1 indicates failure
    }
}

// Setup Password authentication
app.use(session({
    secret: process.env.SESSION_SECRET, // Secret for signing session ID cookie
    resave: false, // Don't save session if unmodified
    saveUninitialized: false, // don't create a session until something is stored
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        dbName: "Empl"
    }),
    cookie: {httpOnly: true}
}));

app.use(passport.initialize()); // Initialize Passport
app.use(passport.session()); // Use Passport session

// Middleware to make user object available in all views
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

// Routers (must be mounted AFTER passport/session so req.isAuthenticated exists)
app.use("/", employeesRouter); // Use employees router for all Routes

const authRouter = require("./routes/auth");
app.use("/auth", authRouter);

app.use((req, res) => {
    res.status(404).redirect("/auth/login")
});

// Start the server after connecting to MongoDB
connectToMongo().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
});

// Handle 404 errors
// app.use((req, res) => {
//     res.redirect("/");
// });