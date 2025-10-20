
# STAGE 1: Build the ASP.NET Core application
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies
COPY ["HRDataAPI.csproj", "."]
RUN dotnet restore "HRDataAPI.csproj"

# Copy all source code
COPY . .

# Build the application in Release configuration
RUN dotnet publish "HRDataAPI.csproj" -c Release -o /app/publish --no-restore


# STAGE 2: Create the final runtime image
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app

# Copy the published output from the build stage
COPY --from=build /app/publish .

# Set environment variable to make sure the app listens on the container's standard port
ENV ASPNETCORE_URLS=http://+:80

# The API needs to connect to the external SQL Server instance
# We will expose the port and define the entrypoint.
EXPOSE 80
ENTRYPOINT ["dotnet", "HRDataAPI.dll"]