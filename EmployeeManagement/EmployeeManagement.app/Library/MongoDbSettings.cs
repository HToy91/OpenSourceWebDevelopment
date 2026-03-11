namespace EmployeeManagement.Library;

// MongoDB settings class for configuring the connection to the MongoDB database. Contains properties for the connection string, database name, and collection name.
public class MongoDbSettings
{
    public string ConnectionString { get; set; } = string.Empty;
    public string DatabaseName { get; set; } = string.Empty;
    public string CollectionName { get; set; } = string.Empty;
}