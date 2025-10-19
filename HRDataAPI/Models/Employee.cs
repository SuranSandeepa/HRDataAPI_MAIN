namespace HRDataAPI.Models
{
    public class Employee
    {
        // Primary Key (EF Core recognizes 'Id' as the PK automatically)
        public int Id { get; set; }

        // Data from Excel Column 1 - Made nullable to resolve warning
        public string? FullName { get; set; }

        // Data from Excel Column 2 - Made nullable to resolve warning
        public string? Department { get; set; }

        // Data from Excel Column 3 (Date/Time)
        public DateTime HireDate { get; set; }

        // Data from Excel Column 4 (Currency/Decimal)
        public decimal Salary { get; set; }
    }
}