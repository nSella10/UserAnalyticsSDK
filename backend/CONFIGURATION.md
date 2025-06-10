# User Analytics SDK - Configuration Guide

## 🔧 Configuration Profiles

This project uses Spring Boot profiles to manage different environments:

### 📁 Configuration Files

```
backend/src/main/resources/
├── application.properties              # Base configuration (shared)
├── application-local.properties        # Local development (your computer)
└── application-prod.properties         # Production (AWS Elastic Beanstalk)
```

## 🏠 Local Development Setup

### 1. Create Local Configuration File

Create `backend/src/main/resources/application-local.properties` with your actual values:

```properties
# MongoDB Atlas Connection (your development database)
spring.data.mongodb.uri=mongodb+srv://username:password@cluster.mongodb.net/database-name

# JWT Secret (use a different one in production!)
jwt.secret=your-local-jwt-secret-key-32-characters-minimum

# Server Port
server.port=8080
```

### 2. Run with Local Profile

```bash
# Option 1: Command line argument
./gradlew bootRun --args='--spring.profiles.active=local'

# Option 2: Environment variable
export SPRING_PROFILES_ACTIVE=local
./gradlew bootRun

# Option 3: IDE configuration
# Add VM option: -Dspring.profiles.active=local
```

## ☁️ AWS Elastic Beanstalk Deployment

### 1. Set Environment Variables

In AWS Elastic Beanstalk console, set these environment variables:

```bash
SPRING_PROFILES_ACTIVE=prod
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database-name
JWT_SECRET=your-production-jwt-secret-key-32-characters-minimum
SERVER_PORT=8080
LOG_LEVEL_ROOT=INFO
LOG_LEVEL_APP=INFO
```

### 2. Deploy

The application will automatically use `application-prod.properties` and load values from environment variables.

## 🐳 Docker Deployment

For Docker-based deployments, set these environment variables:

```bash
SPRING_PROFILES_ACTIVE=prod
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database-name
JWT_SECRET=your-production-jwt-secret-key-32-characters-minimum
SERVER_PORT=8080
```

## 🔒 Security Notes

- ✅ **application.properties** - Safe to commit (no secrets)
- ✅ **application-prod.properties** - Safe to commit (uses placeholders)
- ❌ **application-local.properties** - DO NOT commit (contains actual secrets)

## 🧪 Testing Configuration

To verify your configuration is working:

```bash
# Check which profile is active
curl http://localhost:8080/actuator/info

# Check health
curl http://localhost:8080/health
```

## 🔍 Troubleshooting

### Common Issues:

1. **MongoDB Connection Failed**
   - Check your `MONGODB_URI` environment variable
   - Verify network access to MongoDB Atlas

2. **Profile Not Loading**
   - Check `SPRING_PROFILES_ACTIVE` environment variable
   - Verify the profile-specific properties file exists

3. **JWT Errors**
   - Ensure `JWT_SECRET` is at least 32 characters
   - Check the environment variable is set correctly

## 📋 AWS Elastic Beanstalk Checklist

- [ ] Set `SPRING_PROFILES_ACTIVE=prod`
- [ ] Set `MONGODB_URI` with your MongoDB Atlas connection string
- [ ] Set `JWT_SECRET` with a secure 32+ character key
- [ ] Set `SERVER_PORT=8080` (or your preferred port)
- [ ] Deploy your JAR file
- [ ] Test health endpoint: `/health`
