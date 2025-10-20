
# STAGE 1: Build the Angular Application
FROM node:22.20.0-slim AS build
WORKDIR /app

# Copy package.json/package-lock.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build -- --configuration production

# STAGE 2: Serve the application using Nginx
FROM nginx:alpine AS final
# Copy the built application files from the node build stage
COPY --from=build /app/dist/hr-frontend/browser /usr/share/nginx/html

# Nginx listens on port 80 by default
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]