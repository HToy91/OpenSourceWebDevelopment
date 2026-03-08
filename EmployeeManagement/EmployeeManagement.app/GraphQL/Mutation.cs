using EmployeeManagement.Library;
using HotChocolate;

namespace EmployeeManagement.GraphQL;

public class Mutation
{
    // Mutation method to add a new employee. Takes employee details as parameters and uses the EmployeeRepository to add the employee to the database. Returns the added employee with its generated Id.
    public async Task<Employee> AddEmployee(
        string firstName,
        string lastName,
        string department,
        decimal salary,
        DateTime hireDate,
        [Service] EmployeeRepository repo)
    {
        var employee =
            new Employee
            {
                Id = null,
                FirstName = firstName,
                LastName = lastName,
                Department = department,
                Salary = salary,
                HireDate = hireDate
            };
        
        return await 
            repo
                .AddAsync(employee);
    }
    
    // Mutation method to update an existing employee. Takes the employee Id and updated details as parameters, and uses the EmployeeRepository to update the employee record in the database. Returns a boolean indicating whether the update was successful.
    public async Task<bool> UpdateEmployee(
        string id,
        string firstName,
        string lastName,
        string department,
        decimal salary,
        DateTime hireDate,
        [Service] EmployeeRepository repo)
    {
        var employee =
            new Employee
            {
                Id = id,
                FirstName = firstName,
                LastName = lastName,
                Department = department,
                Salary = salary,
                HireDate = hireDate
            };
        
        return await 
            repo
                .UpdateAsync(employee);
    }
    
    // Mutation method to delete an employee by Id. Takes the employee Id as a parameter and uses the EmployeeRepository to delete the employee record from the database. Returns a boolean indicating whether the deletion was successful.
    public async Task<bool> DeleteEmployee(string id, [Service] EmployeeRepository repo)
    {
        return await
            repo
                .DeleteAsync(id);
    }

    public async Task<Employee?> GetEmployeeById(
        string id,
        [Service] EmployeeRepository repo)
    {
        return await
            repo
                .GetByIdAsync(id);
    }
}