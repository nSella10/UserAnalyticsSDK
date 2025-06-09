# Multi-stage build for better optimization
FROM gradle:8-jdk17 AS build

# Set working directory
WORKDIR /app

# Copy backend files
COPY backend/ ./

# Build the application (skip tests for faster build)
RUN gradle build -x test --no-daemon

# Production stage
FROM openjdk:17-jdk-slim

# Set working directory
WORKDIR /app

# Copy the built jar from build stage
COPY --from=build /app/build/libs/*.jar app.jar

# Expose port
EXPOSE 8080

# Set environment variables
ENV SPRING_PROFILES_ACTIVE=prod

# Run the application
CMD ["java", "-Dserver.port=${PORT:-8080}", "-jar", "app.jar"]
