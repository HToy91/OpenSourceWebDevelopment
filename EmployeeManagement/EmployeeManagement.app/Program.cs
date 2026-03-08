using EmployeeManagement.Library;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using EmployeeManagement.GraphQL;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// MongoDB connection
builder.Services.Configure<MongoDbSettings>(
    builder.Configuration.GetSection("MongoDbSettings"));

// Register the MongoDB client as a singleton service, ensuring that it is shared across the application and properly disposed of when the application shuts down.
builder.Services.AddSingleton<IMongoClient>(sp =>
{
    var settings = sp.GetRequiredService<IOptions<MongoDbSettings>>().Value;
    return new MongoClient(settings.ConnectionString);
});

// Register the EmployeeRepository as a singleton service, allowing it to be injected into controllers or other services that require access to employee data.
builder.Services.AddSingleton<EmployeeRepository>();

builder.Services
    .AddGraphQLServer()
    .AddQueryType<Query>()
    .AddMutationType<Mutation>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Serve static files and enable default file mapping (e.g., index.html) to allow hosting a frontend application alongside the API. This configuration allows the application to serve static assets such as HTML, CSS, and JavaScript files from the wwwroot folder, enabling a seamless integration of the frontend and backend components of the application.
app.UseDefaultFiles();
app.UseStaticFiles();

app.MapGraphQL();

// app.UseHttpsRedirection();

// API endpoints for CRUD operations on employee records. Using REST to verify database and repository is working correctly.
// GET /employees - Retrieve all employees
// app.MapGet("/employees", async (EmployeeRepository repo) =>
//     {
//         // Retrieve all employee records from the repository and return them as a response to the client.
//         return await
//             repo
//                 .GetAsync();
//     })
//     .WithOpenApi();
//
// // POST /employees - Create a new employee
// app.MapPost("/employees", async (Employee employee, EmployeeRepository repo) =>
//     {
//         // Add a new employee record to the repository and return the created employee with its generated id.
//         var createdEmployee =
//             await
//                 repo
//                     .AddAsync(employee);
//         
//         // Return the created employee as a response to the client.
//         return createdEmployee;
//     })
//     .WithOpenApi();
//
// // GET /employees/{id} - Retrieve an employee by id
// app.MapGet("/employees/{id}", async (string id, EmployeeRepository repo) =>
//     {
//         // Retrieve a specific employee record by its id from the repository.
//         var employee =
//             await
//                 repo
//                     .GetByIdAsync(id);
//         
//         // Check if the employee was found and return the appropriate response.
//         return employee is not null 
//             ? Results.Ok(employee) 
//             : Results.NotFound();
//     })
//     .WithOpenApi();
//
// // PUT /employees/{id} - Update an existing employee
// app.MapPut("/employees/{id}", async (string id, Employee employee, EmployeeRepository repo) =>
//     {
//         employee.Id = id;
//      
//         // Update the employee record in the repository and return a boolean indicating whether the update was successful.
//         var success =
//             await 
//                 repo
//                     .UpdateAsync(employee);
//         
//         // Return a response indicating whether the update was successful or if the employee was not found.
//         return success
//             ? Results.Ok(employee)
//             : Results.NotFound();
//     })
//     .WithOpenApi();
//
// // DELETE /employees/{id} - Delete an employee by id
// app.MapDelete("/employees/{id}", async (string id, EmployeeRepository repo) =>
//     {
//         // Delete the employee record with the specified id from the repository and return a boolean indicating whether the deletion was successful.
//         var success =
//             await
//                 repo
//                     .DeleteAsync(id);
//
//         // Return a response indicating whether the deletion was successful or if the employee was not found.
//         return success
//             ? Results.Ok()
//             : Results.NotFound();
//     })
//     .WithOpenApi();

app.Run();