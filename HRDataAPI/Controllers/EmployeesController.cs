using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HRDataAPI.Data;
using HRDataAPI.Models;
using OfficeOpenXml; // Required for EPPlus
using System.IO;
using System.Globalization; // Needed for robust parsing

[Route("api/[controller]")] // Base route: /api/employees
[ApiController]
public class EmployeesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    // Dependency Injection: The DbContext is automatically provided here
    public EmployeesController(ApplicationDbContext context)
    {
        _context = context;
    }

    // A. Upload Endpoint: POST /api/employees/upload
    [HttpPost("upload")]
    public async Task<IActionResult> Upload(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest(new { Message = "File not provided." });
        }

        var newEmployees = new List<Employee>();

        try
        {
            using (var stream = new MemoryStream())
            {
                await file.CopyToAsync(stream);
                using (var package = new ExcelPackage(stream))
                {
                    // Assuming data is in the first worksheet (index 0)
                    var worksheet = package.Workbook.Worksheets[0];
                    if (worksheet == null) return BadRequest(new { Message = "Worksheet not found." });

                    var rowCount = worksheet.Dimension.Rows;

                    // Loop starting from row 2 (assuming row 1 is the header)
                    for (int row = 2; row <= rowCount; row++)
                    {
                        // Basic validation: ensure the first column (FullName) is present
                        if (worksheet.Cells[row, 1].Value == null) continue;

                        // Retrieve values from the specific columns
                        var fullName = worksheet.Cells[row, 1].Text?.Trim();
                        var department = worksheet.Cells[row, 2].Text?.Trim();

                        // Column 3 is HireDate (ROBUST PARSING FIX)
                        var hireDateCell = worksheet.Cells[row, 3].Value;
                        DateTime hireDate = DateTime.MinValue; // Default value

                        if (hireDateCell != null)
                        {
                            if (hireDateCell is DateTime date)
                            {
                                hireDate = date; // Case 1: EPPlus returned a DateTime object directly
                            }
                            else if (double.TryParse(hireDateCell.ToString(), NumberStyles.Any, CultureInfo.InvariantCulture, out double dateDouble))
                            {
                                // Case 2: EPPlus returned the Excel OADate (double)
                                try
                                {
                                    hireDate = DateTime.FromOADate(dateDouble);
                                }
                                catch { /* Swallow error, use default date */ }
                            }
                        }

                        // Column 4 is Salary (ROBUST PARSING FIX)
                        var salaryValue = worksheet.Cells[row, 4].Value;
                        decimal salary = 0; // Default salary

                        if (salaryValue != null)
                        {
                            if (salaryValue is decimal dec)
                            {
                                salary = dec;
                            }
                            // Use invariant culture for safe number parsing
                            else if (decimal.TryParse(salaryValue.ToString()?.Trim().Replace("LKR", "").Replace("$", ""),
                                NumberStyles.Currency, CultureInfo.InvariantCulture, out decimal parsedSalary))
                            {
                                salary = parsedSalary;
                            }
                        }


                        var employee = new Employee
                        {
                            FullName = fullName,
                            Department = department,
                            HireDate = hireDate,
                            Salary = salary
                        };

                        newEmployees.Add(employee);
                    }
                }
            }

            if (newEmployees.Any())
            {
                // Save all valid employees to the database in one batch operation
                _context.Employees.AddRange(newEmployees);
                await _context.SaveChangesAsync();
                return Ok(new { Count = newEmployees.Count, Message = $"{newEmployees.Count} employees successfully imported." });
            }

            return BadRequest(new { Message = "No valid employee data found in the Excel sheet. Check column structure." });

        }
        catch (Exception ex)
        {
            // Log the error (in a real app, use a proper logger)
            Console.WriteLine($"Error during Excel import: {ex.Message}");
            return StatusCode(500, new { Message = "An unexpected error occurred during processing." });
        }
    }


    // B. Search/Get Endpoint: GET /api/employees?searchTerm=...
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Employee>>> GetEmployees([FromQuery] string? searchTerm)
    {
        IQueryable<Employee> query = _context.Employees;

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            // Case-insensitive search across FullName and Department
            string search = searchTerm.ToLower();
            query = query.Where(e =>
                e.FullName!.ToLower().Contains(search) ||
                e.Department!.ToLower().Contains(search)
            );
        }

        // Order by FullName for consistent display
        return await query.OrderBy(e => e.FullName).ToListAsync();
    }
}
