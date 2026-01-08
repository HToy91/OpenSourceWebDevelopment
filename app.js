const express = require("express");
const path = require("path");
const app = express();
const fs = require("fs");
const port = 3000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Basic GET route
app.get("/", (req, res)=>{
    res.send("The server is up and running!");
});

// Route to serve static HTML file
app.get("/index", (req,res)=>{
    res.sendFile(path.join(__dirname, "public", "index.html"));
    console.log("Index.html file served");
});

// Route to secondPage.html
app.get("/secondPage", (req,res)=>{
    res.sendFile(path.join(__dirname, "public", "secondPage.html"));
    console.log("SecondPage.html file served");
});

// Routes for data and date files
// JSON API data route
app.get("/api/data", (req,res)=>{
    res.json({
        message: "Hello from the server",
        timestamp:new Date(),
        items: ["Node.js", "Express", "npm"]
    });
});

app.get("/api/course", (req, res)=>{
    fs.readFile("data.json", "utf-8", (err, data)=>{
        // If fails to read file, send error response
        if(err){
            res.status(500).json({error: "Failed to read data file"});
            return;
        }
        // if successful, parse and send JSON data
        res.json(JSON.parse(data));
    });
});

// Route for running our server
app.listen(port, ()=>{
    console.log(`Server is running on http://localhost:${port}`)
});