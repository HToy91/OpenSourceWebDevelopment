require('dotenv').config();
const express = require('express');
const app = express();
const {graphqlHTTP} = require('express-graphql');
const {buildSchema} = require('graphql');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
const db = mongoose.connection;
db.once('open', () => console.log('Connected to MongoDB'));

// Mongoose schema
const EmployeeSchema = new mongoose.Schema({
    firstName: {type: String, required: true, trim: true,},
    lastName: {type: String, required: true, trim: true},
    department: {type: String, required: true, trim: true},
    startDate: {type: String, required: true, trim: true},
    jobTitle: {type: String, required: true, trim: true},
    salary: {type: Number, min: 15, required: true},
}, {timestamps: true});

const Employee = mongoose.model('Employee', EmployeeSchema);

// Middleware to parse JSON and URL-encoded request bodies
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Setup GraphQL schema
const schema = buildSchema(`
    type Employee {
        id: ID!
        firstName: String!
        lastName: String!
        department: String!
        startDate: String!
        jobTitle: String!
        salary: Float!
    }
    
    type Query {
        employee(id: ID!): Employee
        employees: [Employee]
    }
    
    type Mutation {
        addEmployee(firstName: String!, lastName: String!, department: String!, startDate: String!, jobTitle: String!, salary: Float!): Employee
        updateEmployee(id: ID!, firstName: String!, lastName: String!, department: String!, startDate: String!, jobTitle: String!, salary: Float!): Employee
        deleteEmployee(id: ID!): String
    }
`);

// Define root resolvers for GraphQL queries and mutations
const root = {
    employees: async () => await Employee.find(),
    employee: async ({id}) => await Employee.findById(id),
    addEmployee: async ({firstName, lastName, department, startDate, jobTitle, salary}) => {
        const newEmployee = new Employee({firstName, lastName, department, startDate: new Date(startDate), jobTitle, salary});
        return await newEmployee.save();
    },
    updateEmployee: async ({id, firstName, lastName, department, startDate, jobTitle, salary}) => {
        return Employee.findByIdAndUpdate(id, {firstName, lastName, department, startDate: new Date(startDate), jobTitle, salary}, {new: true});
    },
    deleteEmployee: async ({id}) => {
        await Employee.findByIdAndDelete(id);
        return `Employee with id ${id} deleted successfully`;
    }
};

// Setup GraphQL endpoint with schema and resolvers
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true // Enable GraphiQL UI for testing queries
}));

app.listen(PORT, () => console.log(`Listening on ${PORT}`));