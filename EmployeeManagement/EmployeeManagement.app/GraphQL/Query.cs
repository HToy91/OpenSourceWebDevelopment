using EmployeeManagement.Library;
using HotChocolate;

namespace EmployeeManagement.GraphQL;

public class Query
{
    public async Task<List<Employee>> GetEmployees([Service] EmployeeRepository repo)
    {
        return await
            repo
                .GetAsync();
    }

    public async Task<Employee?> GetEmployeeById(string id, [Service] EmployeeRepository repo)
    {
        return await
            repo
                .GetByIdAsync(id);
    }
}