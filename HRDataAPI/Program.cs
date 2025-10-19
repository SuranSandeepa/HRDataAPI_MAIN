using HRDataAPI.Data;
using Microsoft.EntityFrameworkCore;
using OfficeOpenXml; // Add this using directive for EPPlus

// --- FINAL FIX: Set the EPPlus License Globally before building the app ---
// Using the static LicenseContext property. This may generate an obsolete warning, 
// but it is the most stable way to ensure compilation without additional packages.
ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
// --- END FIX ---

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// --- 1. Register DbContext and use SQL Server ---
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
// --- END 1 ---

// --- 2. Configure CORS for Angular frontend (running on http://localhost:4200 by default) ---
builder.Services.AddCors(options =>
{
    options.AddPolicy("AngularPolicy",
        policy =>
        {
            // IMPORTANT: Ensure this URL matches your Angular development server port
            policy.WithOrigins("http://localhost:4200")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});
// --- END 2 ---

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// --- 3. Enable CORS policy ---
app.UseCors("AngularPolicy");
// --- END 3 ---

app.UseAuthorization();

app.MapControllers();

app.Run();
