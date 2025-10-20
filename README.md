# 🚀 Full-Stack HR Data Import and Management System

This project is a modern, enterprise-grade solution built for HR departments to manage employee data efficiently. It demonstrates a complete, reliable full-stack architecture that handles data input (Excel parsing), persistence, and retrieval through responsive user interfaces.

---

## 🛠️ Technology Stack

| Component           | Technology                  | Description                                                                                   |
| :------------------ | :-------------------------- | :-------------------------------------------------------------------------------------------- |
| **Backend API**     | **ASP.NET Core (9.0)**      | High-performance, cross-platform REST API for data processing and database interaction.       |
| **Frontend Client** | **Angular**                 | Modern, standalone component-based framework for a clean, responsive SPA.                     |
| **Styling/UI**      | **Bootstrap 5**             | Industry-standard CSS framework providing a professional design layout.                       |
| **Database**        | **MS SQL Server**           | Robust relational database used for persistent storage.                                       |
| **Data Layer**      | **Entity Framework Core**   | ORM handling all communication with SQL Server via Code-First migrations.                     |
| **Deployment**      | **Docker / Docker Compose** | Used to containerize both the API and the Frontend for portable, consistent deployment.       |
| **Data Processing** | **EPPlus**                  | NuGet package for securely reading, parsing, and validating data from uploaded `.xlsx` files. |
| **Version Control** | **Git / GitHub**            | Standard practice for source code management.                                                 |

## 📝 Setup and Execution

To run this application, both the API (on port 5120) and the client (on port 4200) must be running concurrently. The Angular client communicates directly with the ASP.NET Core API endpoints.

## ⚙️ Deployment and Database Notes

To run the Dockerized application, you must handle the authentication link between the Linux-based Docker containers and your Windows-hosted SQL Server instance.

### MS SQL Server Authentication

- **Requirement:** Docker containers cannot use Windows Authentication.
- **Solution:** Your local MS SQL Server instance must be configured for **Mixed Mode Authentication**, and you must create a dedicated SQL Login (e.g., `HRAppDockerUser`) with `db_owner` permissions on the `HRAppDB` database.
- **Connection String:** The connection string in `HRDataAPI/appsettings.json` must be updated to use the host machine's DNS reference and the SQL login:
  ```
  "Server=host.docker.internal\\SQLEXPRESS;Database=HRAppDB;User Id=...;Password=..."
  ```

### Running with Docker Compose

1.  Ensure Docker Desktop is running.
2.  Navigate to the root directory (`HRApp_Project`).
3.  Execute the build and run command:
    ```bash
    docker compose up --build
    ```
4.  **Access:** The application will be available at **`http://localhost:4200`**.
