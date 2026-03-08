using EmployeeManagement.Library;
using HotChocolate;

namespace EmployeeManagement.GraphQL;

// Query class for GraphQL operations related to employee management. Contains methods for retrieving employee records from the database, including fetching all employees and fetching a specific employee by id.
public class Query
{
    // Query method to retrieve all employees. Uses the EmployeeRepository to fetch all employee records from the database and returns them as a list.
    public async Task<List<Employee>> GetEmployees([Service] EmployeeRepository repo)
    {
        return await
            repo
                .GetAsync();
    }

    // Query method to retrieve a specific employee by id. Takes the employee id as a parameter and uses the EmployeeRepository to fetch the corresponding employee record from the database. Returns the employee if found, or null if not found.
    public async Task<Employee?> GetEmployeeById(string id, [Service] EmployeeRepository repo)
    {
        return await
            repo
                .GetByIdAsync(id);
    }
}