# Use OpenJDK 17 as base image
FROM openjdk:17-jdk-slim

# Set working directory
WORKDIR /app

# Copy gradle wrapper files from root (they work for backend too)
COPY gradle/ ./gradle/
COPY gradlew ./gradlew
COPY gradlew.bat ./gradlew.bat

# Copy backend gradle configuration files
COPY backend/build.gradle ./build.gradle
COPY backend/settings.gradle ./settings.gradle

# Copy backend source code
COPY backend/src/ ./src/

# Make gradlew executable
RUN chmod +x gradlew

# Build the application (skip tests for faster build)
RUN ./gradlew build -x test --no-daemon

# Expose port
EXPOSE 8080

# Set environment variables
ENV SPRING_PROFILES_ACTIVE=prod

# Run the application
CMD ["java", "-jar", "build/libs/*.jar"]
