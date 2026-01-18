// Import express library
const express = require("express");
// Import path module
const path = require("path");
// Create an instance of express
const app = express();
// Import file system module
const fs = require("fs");
// Define the port number
const PORT = process.env.PORT || 3000;

// [Week: 2]
require("dotenv").config();
const mongoose = require("mongoose");
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error("MONGO_URI is not defined in environment variables");
    process.exit(1);
}

// Connect to MongoDB
async function connectToMongo() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB");
    }
    catch (err) {
        console.error("Failed to connect to MongoDB", err.message);
        process.exit(1);
    }
}

// Serve static files from the 'public' directory
// Put your static HTML, CSS, and JS files in the 'public' folder
app.use(express.static(path.join(__dirname, "public")));

// Route to serve static HTML file
app.get("/index", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
    console.log("Serving index.html file");
})

// Basic GET route
app.get("/", (req, res) => {
    res.send("Server is running");
});

// Start the server and listen on the defined port
// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });

// Route to serve todo.json file
app.get("/todo", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.sendFile(path.join(__dirname, "todo.json"));
});

app.get("/api/todo", (req, res) => {
    fs.readFile(path.join(__dirname, "todo.json"), "utf8", (err, data) => {
        if (err) {
            res.status(500).send("Error reading todo data");
            return;
        }
        res.json(JSON.parse(data));
    });
});

const todos = new mongoose.Schema({}, {strict: false});
const todo_app = mongoose.model("todos", todos);

async function loadData() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB for data loading");

        // read the json file
        const filePath = path.join(__dirname, "todo.json");
        const rawData = fs.readFileSync(filePath);
        const todos = JSON.parse(rawData);

        // insert data into the collection
        await todo_app.insertMany(todos);
        console.log("Data loaded into MongoDB");

        // close the connection
        await mongoose.connection.close();
    }
    catch (err) {
        console.error("Error loading data into MongoDB", err.message);
        process.exit(1);
    }
}
loadData();

app.get("/api/todos", async (req, res) => {
    const data = await todo_app.find();
    res.json({data});
});

app.get("/api/todos/:id", async (req, res) => {
    console.log(req.params.id);
    const tInfo = req.params.id;
    const todoInfo = await todo_app.find({id: tInfo});
    console.log(todoInfo);
    res.json({todoInfo});
});

connectToMongo()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    });

// Route handling for undefined routes (404)
app.use((req, res) => {
    res.redirect("/index");
});