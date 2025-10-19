using Microsoft.EntityFrameworkCore;
using HRDataAPI.Models;

namespace HRDataAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        // Constructor that accepts options (needed for dependency injection)
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        // Represents the 'Employees' table in the database
        public DbSet<Employee> Employees { get; set; }
    }
}
