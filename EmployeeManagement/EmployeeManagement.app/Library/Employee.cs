using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace EmployeeManagement.Library;

// Employee entity representing a single employee record. Uses MongoDB attributes for database mapping.
public class Employee
{
    // Properties
    // Use MongoDB's BsonId and BsonRepresentation attributes to specify that the Id property is the unique identifier for the document and should be stored as an ObjectId in MongoDB.
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public decimal Salary { get; set; }
    public DateTime HireDate { get; set; }
}