require("dotenv").config();
const express = require("express");
const app = express();
const {graphqlHTTP} = require("express-graphql");
const {buildSchema} = require("graphql");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
const db = mongoose.connection;
db.once("open", () => console.log("Connected to MongoDB"));

// Mongoose schema
const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    age: Number
});

const User = mongoose.model("User", UserSchema);

// Middleware to parse JSON and URL-encoded request bodies
app.use(express.static("public"));
// app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup GraphQL schema
const schema = buildSchema(`
    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
    }
    
    type Query {
        user(id: ID!): User
        users: [User]
    }
    
    type Mutation {
        addUser(name: String!, email: String!, age: Int): User
        updateUser(id: ID!, name: String!, email: String!, age: Int): User
        deleteUser(id: ID!): String
    }
`);

// Define root resolvers for GraphQL queries and mutations
const root = {
    users: async () => await User.find(),
    user: async ({id}) => await User.findById(id),
    addUser: async ({name, email, age}) => {
        const newUser = new User({name, email, age});
        return await newUser.save();
    },
    updateUser: async ({id, name, email, age}) => {
        return User.findByIdAndUpdate(id, {name, email, age}, {new: true});
    },
    deleteUSer: async (id) => {
        await User.findByIdAndDelete(id);
        return `User with id ${id} deleted successfully.`;
    }
};

// Setup GraphQL endpoint with schema and resolvers
app.use("/graphql", graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true // Enable GraphiQL UI for testing queries
}));

app.listen(PORT, () => console.log(`Listening on ${PORT}`));