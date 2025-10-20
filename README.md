# 🚀 Full-Stack HR Data Import and Management System

This project is a modern, enterprise-grade solution built for HR departments to manage employee data efficiently. It demonstrates a complete, reliable full-stack architecture that handles data input (Excel parsing), persistence, and retrieval through responsive user interfaces.

---

## 🛠️ Technology Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Backend API** | **ASP.NET Core (9.0)** | High-performance, cross-platform API for data processing, validation, and database interaction. |
| **Data Layer** | **Entity Framework Core** | Object-Relational Mapper (ORM) handling all communication with the SQL database, including migrations and queries. |
| **Database** | **MS SQL Server** | Robust and reliable relational database used for persistent storage of employee records. |
| **Data Processing** | **EPPlus** | NuGet package used for securely reading, parsing, and validating data directly from uploaded `.xlsx` files. |
| **Frontend Client** | **Angular** | Modern, component-based framework used to build a single-page application (SPA) for the user interface. |
| **Styling/UI** | **Bootstrap 5** | Industry-standard CSS framework providing a clean, responsive, and professional design layout. |
| **Version Control** | **Git / GitHub** | Standard practice for source code management, change tracking, and repository hosting. |

---

## 🌟 Key Features

* **Excel Upload:** Endpoint to ingest employee records from standard Excel spreadsheets.
* **Data Validation:** Robust backend logic to safely parse dates, numbers, and strings.
* **Real-time Search:** Instantly filters employee records displayed on the frontend.
* **Responsive Design:** Optimized layout for seamless use on desktop and mobile devices.

---

## 📝 Setup and Execution

To run this application, both the API (on port 5120) and the client (on port 4200) must be running concurrently. The Angular client communicates directly with the ASP.NET Core API endpoints.
