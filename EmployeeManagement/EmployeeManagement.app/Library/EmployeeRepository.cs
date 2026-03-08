using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace EmployeeManagement.Library;

// Repository class for managing employee data in MongoDB. Provides methods for CRUD operations on employee records.
public class EmployeeRepository
{
    // MongoDB collection for employees, initialized in the constructor using the provided MongoDB client and settings.
    private readonly IMongoCollection<Employee> _employees;

    // Constructor that initializes the MongoDB collection for employees using the provided MongoDB client and settings. The settings are used to specify the database name and collection name for employee records.
    public EmployeeRepository(IMongoClient mongoClient, IOptions<MongoDbSettings> settings)
    {
        var database = 
            mongoClient
                .GetDatabase(settings.Value.DatabaseName);
        
        _employees = 
            database
                .GetCollection<Employee>(settings.Value.CollectionName);
    }
    
    // Get all employees
    public async Task<List<Employee>> GetAsync() 
    {
        return await
            _employees
                .Find(emp => true)
                .ToListAsync();
    }
    
    // Get employee by Id
    public async Task<Employee?> GetByIdAsync(string id)
    {
        return await 
            _employees
                .Find(emp => emp.Id == id)
                .FirstOrDefaultAsync();
    }
    
    // Add a new employee
    public async Task<Employee> AddAsync(Employee employee)
    {
        await
            _employees
                .InsertOneAsync(employee);
        
        // Return the employee with the generated Id (if using MongoDB's ObjectId, it will be set after insertion)
        return employee;
    }
    
    // Update an existing employee
    public async Task<bool> UpdateAsync(Employee employee)
    {
        var result =
            await
                _employees
                    .ReplaceOneAsync(emp => emp.Id == employee.Id, employee);
        
        // Return true if the update was successful (i.e., at least one document was modified)
        return result.MatchedCount > 0;
    }
    
    // Delete an employee by Id
    public async Task<bool> DeleteAsync(string id)
    {
        var result =
            await _employees
                .DeleteOneAsync(emp => emp.Id == id);
        
        // Return true if the deletion was successful (i.e., at least one document was deleted)
        return result.DeletedCount > 0;
    }
}