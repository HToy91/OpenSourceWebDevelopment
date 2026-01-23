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

// Setup templating engine
app.engine("hbs", engine({
    extname: ".hbs",
    helpers: { // needed for comparison in Handlebars templates. helpers are like functions that can be called from templates
        ifEquals(a, b, options) {
            return a === b ? options.fn(this) : options.inverse(this); // Return true block if equal, else false block
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
app.use("/", employeesRouter); // Use employees router for all Routes

async function connectToMongo() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Failed to connect to MongoDB", err.message);
        process.exit(1); // Exit process if unable to connect. 1 indicates failure
    }
}

// Start the server after connecting to MongoDB
connectToMongo().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
});