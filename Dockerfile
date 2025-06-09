# Use OpenJDK 17 as base image
FROM openjdk:17-jdk-slim

# Set working directory
WORKDIR /app

# Copy gradle wrapper files first
COPY backend/gradle/ ./gradle/
COPY backend/gradlew ./gradlew
COPY backend/gradlew.bat ./gradlew.bat

# Copy gradle configuration files
COPY backend/build.gradle ./build.gradle
COPY backend/settings.gradle ./settings.gradle

# Copy source code
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
