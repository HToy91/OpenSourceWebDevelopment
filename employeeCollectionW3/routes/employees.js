const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

router.get("/", async (req, res) => {
    const employees = await Employee.find().sort({createdAt: -1}).lean(); // Fetch all employees from DB
    res.render("employees/index", {employees}); // Render employees index view with data
});

// Create route - Add a new employee
router.post("/employees", async (req, res) => {
    try {
        const payload = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            department: req.body.department,
            startDate: req.body.startDate ? new Date(req.body.startDate) : undefined,
            jobTitle: req.body.jobTitle,
            salary: parseFloat(req.body.salary)
        }
        await Employee.create(payload); // Create new employee in DB
        res.redirect("/"); // Redirect to employees list
    } catch (err) {
        const employees = await Employee.find().sort({createdAt: -1}).lean();
        res.status(400).render("employees/index", {
            employees,
            error: "Please fill all required fields correctly.",
            form: req.body // Pre-fill form with previous data
        });
    }
});

// Update route - Update an existing employee
router.put("/employees/:id", async (req, res) => {
    try {
        const payload = {
            ...req.body, // Spread operator to copy all fields. it will overwrite only the fields present in req.body
            startDate: req.body.startDate ? new Date(req.body.startDate) : undefined,
            salary: Number(req.body.salary)
        }
        await Employee.findByIdAndUpdate(req.params.id, payload, {runValidators: true});
        res.redirect("/"); // Redirect to employees list
    } catch (err) {
        const employee = await Employee.findById(req.params.id).lean();
        res.status(400).render("employees/index", {
            employee: {...employee, ...req.body}, // Pre-fill form with previous data
            error: "Update failed: Check required fields."
        });
    }
});

// Edit Page
router.get("/employees/:id/edit", async (req, res) => {
    const employee = await Employee.findById(req.params.id).lean()

    if (!employee) {
        return res.status(404).send("Employee not found!");
    }
    res.render("employees/edit", {employee}); // Render edit view with employee data
});

// Delete route - Delete an employee
router.delete("/employees/:id", async (req, res) => {
    await Employee.findByIdAndDelete(req.params.id);
    res.redirect("/"); // Redirect to employees list
});

module.exports = router; // Export the router