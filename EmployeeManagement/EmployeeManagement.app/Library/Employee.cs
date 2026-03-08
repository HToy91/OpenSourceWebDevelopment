using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace EmployeeManagement.Library;

public class Employee
{
    // Properties
    // Use MongoDB's BsonId and BsonRepresentation attributes to specify that the Id property is the unique identifier for the document and should be stored as an ObjectId in MongoDB.
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Department { get; set; }
    public decimal Salary { get; set; }
    public DateTime HireDate { get; set; }
}