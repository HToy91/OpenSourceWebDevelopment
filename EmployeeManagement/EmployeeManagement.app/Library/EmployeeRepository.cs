using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace EmployeeManagement.Library;

public class EmployeeRepository
{
    private readonly IMongoCollection<Employee> _employees;

    public EmployeeRepository(IMongoClient mongoClient, IOptions<MongoDbSettings> settings)
    {
        var database = 
            mongoClient
                .GetDatabase(settings.Value.DatabaseName);
        _employees = 
            database
                .GetCollection<Employee>("Employees");
    }
    
    // Get all employees
    public async Task<List<Employee>> GetAsync() 
    {
        return await _employees
            .Find(emp => true)
            .ToListAsync();
    }
    
    // Get employee by Id
    public async Task<Employee?> GetByIdAsync(Employee employee)
    {
        return await _employees
            .Find(emp => emp.Id == employee.Id)
            .FirstOrDefaultAsync();
    }
    
    // Add a new employee
    public async Task<Employee> AddAsync(Employee employee)
    {
        await _employees.InsertOneAsync(employee);
        return employee;
    }
    
    // Update an existing employee
    public async Task UpdateAsync(Employee employee)
    {
        await _employees
            .ReplaceOneAsync(emp => emp.Id == employee.Id, employee);
    }
    
    // Delete an employee by Id
    public async Task DeleteAsync(string id)
    {
        await _employees
            .DeleteOneAsync(emp => emp.Id == id);
    }
}