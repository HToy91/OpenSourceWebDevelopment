const {socket} = require("dgram"); // This line seems to be unused and can be removed. It imports the 'socket' module from 'dgram', which is not needed in this code.
const express = require("express"); // Import the Express framework to create a web server
const app = express(); // Create an instance of the Express application
const http = require("http"); // Import the built-in 'http' module to create an HTTP server
const {Server} = require("socket.io");

const OpenAI = require("openai"); // Import the 'Server' class from the 'socket.io' module to create a Socket.IO server
require("dotenv").config();
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const server = http.createServer(app); // This line is duplicated and should be removed. It creates another HTTP server, which is unnecessary.
const io = new Server(server); // Create a Socket.IO server and attach it to the HTTP server

// Setup static public folder
app.use(express.static("public"));

const users = new Set(); // Create a Set to store unique usernames. Using a Set ensures that there are no duplicate usernames in the chat application.

io.on("connection", (socket) => {
    console.log("A user connected"); // Log when a user connects

    // Event for chat message
    socket.on("chat message", async (msg) => {

        console.log(`Message received: ${msg}`); // Log the received message
        io.emit("chat message", {
            sender: socket.username,
            type: "user",
            text: msg
        });

        if (msg.split(" ")[0] === "@bot") {
            const userMessage = msg.replace("@bot", "").trim(); // Remove the "@bot" prefix and trim any extra whitespace

            const response = await client.responses.create({
                model: "gpt-5.2",
                input: `${userMessage}`
            });

            io.emit("chat message", {
                sender: "Chatbot",
                type: "chatbot",
                text: `${socket.username}, ${response.output_text}`
            });
        }
    });

    // Event for setting username
    socket.on("set username", (username) => {
        socket.username = username;
        users.add(username);
        io.emit("user list", Array.from(users));
    });

    // For disconnection
    socket.on("disconnect", () => {
        console.log(`${socket.username} disconnected`); // Log when a user disconnects
        users.delete(socket.username);
        if (socket.username) {
            io.emit("chat message", `${socket.username} has left the chat`); // Broadcast a message that the user has left

        }

        io.emit("user list", Array.from(users));
    });
});


const port = 3000;
server.listen(3000, () => {
    console.log(`Server is running on http://localhost:${port}`);
}); // Start the server and listen on port 3000