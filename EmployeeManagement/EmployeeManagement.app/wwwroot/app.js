// Handles the frontend logic for the Employee Management application, including fetching, displaying, adding, updating, and deleting employee records through a GraphQL API.

// Endpoint for GraphQL API
const endPoint = "/graphql";

// DOM Elements
const employeeForm = document.getElementById("employeeForm");
const employeeTableBody = document.getElementById("employeeTableBody");
let editingEmployeeId = null;
const formTitle = document.getElementById("formTitle");
const SubmitButton = employeeForm.querySelector('button[type = "submit"]');

const CancelButton = document.getElementById("cancelEdit");

CancelButton.addEventListener("click", (event) => {
    resetForm();
})

// Helper function to make GraphQL requests
async function graphqlRequest(query, variables = {}) {
    const response = await fetch(endPoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ query, variables })
    });

    const result = await response.json();

    if (result.errors) {
        console.error("GraphQL Errors:", result.errors);
        throw result.errors;
    }

    return result.data;
}

// Load employees from the server and render them in the table
async function loadEmployees() {
    const query = `
        query {
            employees {
                id
                firstName
                lastName
                department
                salary
                hireDate
            }
        }
    `;

    const data = await graphqlRequest(query);
    renderEmployees(data.employees);
}

function renderEmployees(employees) {
    // Clear existing rows
    employeeTableBody.innerHTML = "";

    // Handle case when no employees are found
    if (!employees || employees.length === 0) {
        employeeTableBody.innerHTML = `
            <tr>
                <td colspan="5">No employees found.</td>
            </tr>
        `;
        
        return;
    }

    // Create a new row for each employee
    for (const employee of employees) {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${employee.firstName} ${employee.lastName}</td>
            <td>${employee.department}</td>
            <td>$${Number(employee.salary).toFixed(2)}</td>
            <td>${formatDate(employee.hireDate)}</td>
            <td>
                <button class="edit-btn" data-id="${employee.id}">Edit</button>
                <button class="delete-btn" data-id="${employee.id}">Delete</button>
            </td>
        `;

        // Append the row to the table body
        employeeTableBody.appendChild(row);
    }

    // Add event listeners for edit and delete buttons
    const deleteBtn = document.querySelectorAll(".delete-btn")
    const editBtn = document.querySelectorAll(".edit-btn")
    
    deleteBtn.forEach(button => {
        button.addEventListener("click", async (event) => {
            const id = event.target.dataset.id;
            await deleteEmployee(id);
        });
    });
    
    editBtn.forEach(button => {
        button.addEventListener("click", async (event) => {
            const id = event.target.dataset.id;
            await startEdit(id);
        })
    })
}

async function startEdit(id) {
    // Show the cancel button when editing
    CancelButton.style.display = "inline-block";
    
    const query = `
        query {
            employees {
                id
                firstName
                lastName
                department
                salary
                hireDate
            }
        }
    `;
    
    const data = await graphqlRequest(query);
    // Find the employee to edit
    const employee = data.employees.find(e => e.id === id);
    
    if (!employee) {
        alert("Employee not found");
        return;
    }
    
    // Set the form fields with the employee data
    editingEmployeeId = id;
    
    document.getElementById("firstName").value = employee.firstName;
    document.getElementById("lastName").value = employee.lastName;
    document.getElementById("department").value = employee.department;
    document.getElementById("salary").value = employee.salary;
    document.getElementById("hireDate").value = formatDate(employee.hireDate);
    
    // Change the submit button text to indicate update mode
    SubmitButton.textContent = "Update Employee";
    formTitle.innerText = "Edit Employee";
}

// Update an existing employee with the values from the form
async function updateEmployee(event) {
    // Prevent form submission from reloading the page
    event.preventDefault();
    
    // Get updated values from the form
    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const department = document.getElementById("department").value.trim();
    const salary = parseFloat(document.getElementById("salary").value);
    const hireDate = document.getElementById("hireDate").value + "T00:00:00Z";

    const mutation = `
        mutation (
            $id: String!,
            $firstName: String!,
            $lastName: String!,
            $department: String!,
            $salary: Decimal!,
            $hireDate: DateTime!
        ) {
            updateEmployee(
                id: $id,
                firstName: $firstName,
                lastName: $lastName,
                department: $department,
                salary: $salary,
                hireDate: $hireDate
            )
        }
    `;
    
    const result = await graphqlRequest(mutation, {
        id: editingEmployeeId,
        firstName,
        lastName,
        department,
        salary,
        hireDate
    });
    
    if (!result.updateEmployee) {
        alert("Failed to update employee");
    }
    
    resetForm();
    await loadEmployees();
}

// Reset the form to its default state
function resetForm() {
    editingEmployeeId = null;
    employeeForm.reset();
    // Reset the submit button text to default
    SubmitButton.textContent = "Add Employee";
    // Hide the cancel button when not editing
    CancelButton.style.display = "none";
    formTitle.innerText = "Add Employee";
}

// Add a new employee with the values from the form
async function addEmployee(event) {
    // Prevent form submission from reloading the page
    event.preventDefault();

    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const department = document.getElementById("department").value.trim();
    const salary = parseFloat(document.getElementById("salary").value);
    const hireDate = document.getElementById("hireDate").value + "T00:00:00Z";

    const mutation = `
        mutation (
            $firstName: String!,
            $lastName: String!,
            $department: String!,
            $salary: Decimal!,
            $hireDate: DateTime!
        ) {
            addEmployee(
                firstName: $firstName,
                lastName: $lastName,
                department: $department,
                salary: $salary,
                hireDate: $hireDate
            ) {
                id
                firstName
                lastName
            }
        }
    `;

    await graphqlRequest(mutation, {
        firstName,
        lastName,
        department,
        salary,
        hireDate
    });

    resetForm();
    await loadEmployees();
}

// Delete an employee by ID
async function deleteEmployee(id) {
    const mutation = `
        mutation ($id: String!) {
            deleteEmployee(id: $id)
        }
    `;

    await graphqlRequest(mutation, { id });
    await loadEmployees();
}

// Helper function to format date strings for display
function formatDate(dateString) {
    return new Date(dateString).toISOString().split("T")[0];
}

// Event listener for form submission to handle both adding and updating employees
employeeForm.addEventListener("submit", async (event) => {
    // If editingEmployeeId is set, we are in edit mode, otherwise we are adding a new employee
    if (editingEmployeeId) {
        await updateEmployee(event);
    } else {
        await addEmployee(event);
    }
});

// Reset the form and load employees when the page is loaded
resetForm();

// Initial load of employees when the page is ready
(async () => {
    try {
        await loadEmployees();
    } catch (error) {
        console.error("Error loading employees:", error);
    }
})();