# 🚀 Cloud Deployment Guide

This guide covers deploying UserAnalyticsSDK to various cloud platforms for production use.

## 🌐 Deployment Options

| Platform | Backend | Frontend | Database | Difficulty |
|----------|---------|----------|----------|------------|
| **Vercel + Railway** | Railway | Vercel | MongoDB Atlas | ⭐⭐ Easy |
| **Heroku** | Heroku | Heroku | MongoDB Atlas | ⭐⭐ Easy |
| **AWS** | EC2/ECS | S3/CloudFront | DocumentDB | ⭐⭐⭐⭐ Advanced |
| **Google Cloud** | Cloud Run | Firebase | Cloud Firestore | ⭐⭐⭐ Intermediate |

## 🎯 Recommended: Vercel + Railway + MongoDB Atlas

This is the easiest and most cost-effective option for getting started.

### Step 1: Setup MongoDB Atlas

1. **Create Account**: Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. **Create Cluster**: 
   - Choose "Free Tier" (M0)
   - Select region closest to your users
   - Name your cluster (e.g., "useranalytics")

3. **Setup Database Access**:
   ```
   Database Access → Add New Database User
   Username: analytics_user
   Password: [Generate secure password]
   Role: Read and write to any database
   ```

4. **Setup Network Access**:
   ```
   Network Access → Add IP Address
   Access List Entry: 0.0.0.0/0 (Allow access from anywhere)
   ```

5. **Get Connection String**:
   ```
   Clusters → Connect → Connect your application
   Copy connection string: mongodb+srv://analytics_user:<password>@cluster0.xxxxx.mongodb.net/
   ```

### Step 2: Deploy Backend to Railway

1. **Create Account**: Go to [Railway](https://railway.app)

2. **Deploy from GitHub**:
   ```bash
   # Fork the repository first, then:
   Railway → New Project → Deploy from GitHub repo
   Select: UserAnalyticsSDK
   ```

3. **Configure Environment Variables**:
   ```env
   MONGODB_URI=mongodb+srv://analytics_user:<password>@cluster0.xxxxx.mongodb.net/useranalytics
   JWT_SECRET=your-super-secret-jwt-key-here
   CORS_ORIGINS=https://your-frontend-domain.vercel.app
   PORT=8080
   ```

4. **Configure Build**:
   ```json
   // In backend/package.json (if needed)
   {
     "scripts": {
       "start": "./gradlew bootRun",
       "build": "./gradlew build"
     }
   }
   ```

5. **Custom Start Command**:
   ```bash
   cd backend && ./gradlew bootRun
   ```

### Step 3: Deploy Frontend to Vercel

1. **Create Account**: Go to [Vercel](https://vercel.com)

2. **Deploy from GitHub**:
   ```bash
   Vercel → New Project → Import Git Repository
   Select: UserAnalyticsSDK
   Framework Preset: React
   Root Directory: frontend
   ```

3. **Configure Environment Variables**:
   ```env
   REACT_APP_API_URL=https://your-backend.railway.app
   REACT_APP_ENVIRONMENT=production
   ```

4. **Build Settings**:
   ```json
   Build Command: npm run build
   Output Directory: build
   Install Command: npm install
   ```

### Step 4: Update Configuration

1. **Update Backend CORS**:
   ```java
   // In backend CORS configuration
   @CrossOrigin(origins = {"https://your-frontend.vercel.app"})
   ```

2. **Update Frontend API URL**:
   ```javascript
   // In frontend configuration
   const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://your-backend.railway.app';
   ```

## 🔧 Alternative: Heroku Deployment

### Backend on Heroku

1. **Install Heroku CLI**:
   ```bash
   # Download from https://devcenter.heroku.com/articles/heroku-cli
   heroku login
   ```

2. **Create Heroku App**:
   ```bash
   cd backend
   heroku create your-analytics-api
   ```

3. **Configure Environment Variables**:
   ```bash
   heroku config:set MONGODB_URI="mongodb+srv://..."
   heroku config:set JWT_SECRET="your-secret-key"
   heroku config:set CORS_ORIGINS="https://your-frontend.herokuapp.com"
   ```

4. **Create Procfile**:
   ```bash
   # In backend/Procfile
   web: java -jar build/libs/user-analytics-0.0.1-SNAPSHOT.jar --server.port=$PORT
   ```

5. **Deploy**:
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

### Frontend on Heroku

1. **Create Frontend App**:
   ```bash
   cd frontend
   heroku create your-analytics-dashboard
   heroku buildpacks:set mars/create-react-app
   ```

2. **Configure Environment**:
   ```bash
   heroku config:set REACT_APP_API_URL="https://your-analytics-api.herokuapp.com"
   ```

3. **Deploy**:
   ```bash
   git add .
   git commit -m "Deploy frontend to Heroku"
   git push heroku main
   ```

## ☁️ AWS Deployment (Advanced)

### Prerequisites
- AWS Account
- AWS CLI installed
- Docker installed

### Step 1: Setup RDS (Database)
```bash
# Create RDS instance for MongoDB alternative (DocumentDB)
aws docdb create-db-cluster \
    --db-cluster-identifier useranalytics-cluster \
    --engine docdb \
    --master-username admin \
    --master-user-password YourSecurePassword123
```

### Step 2: Deploy Backend with ECS
```dockerfile
# Dockerfile for backend
FROM openjdk:11-jre-slim
COPY build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

### Step 3: Deploy Frontend to S3 + CloudFront
```bash
# Build and deploy frontend
npm run build
aws s3 sync build/ s3://your-analytics-bucket --delete
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

## 🔒 Security Configuration

### SSL/HTTPS Setup
```nginx
# Nginx configuration for HTTPS
server {
    listen 443 ssl;
    server_name your-api-domain.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Environment Variables Security
```bash
# Never commit these to git!
JWT_SECRET=super-secret-key-minimum-32-characters
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
API_ENCRYPTION_KEY=another-secret-key-for-api-encryption
```

## 📊 Monitoring Setup

### Health Check Endpoints
```java
// Add to Spring Boot application
@RestController
public class HealthController {
    
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> status = new HashMap<>();
        status.put("status", "UP");
        status.put("timestamp", Instant.now().toString());
        return ResponseEntity.ok(status);
    }
}
```

### Logging Configuration
```yaml
# application-prod.yml
logging:
  level:
    com.analytics: INFO
    org.springframework: WARN
  pattern:
    console: "%d{yyyy-MM-dd HH:mm:ss} - %msg%n"
  file:
    name: /var/log/analytics/application.log
```

## 🚀 CI/CD Pipeline

### GitHub Actions Example
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Railway
        run: |
          # Railway deployment commands
          
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        run: |
          # Vercel deployment commands
```

## 📈 Performance Optimization

### Database Indexing
```javascript
// MongoDB indexes for better performance
db.userActions.createIndex({ "apiKey": 1, "timestamp": -1 })
db.screenTimes.createIndex({ "apiKey": 1, "userId": 1 })
db.users.createIndex({ "email": 1 }, { unique: true })
```

### Caching Strategy
```java
// Redis caching for frequently accessed data
@Cacheable(value = "userActions", key = "#apiKey + '_' + #userId")
public List<UserAction> getUserActions(String apiKey, String userId) {
    // Implementation
}
```

## 🔍 Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Check frontend domain in backend CORS configuration
   - Verify environment variables are set correctly

2. **Database Connection**:
   - Verify MongoDB Atlas IP whitelist
   - Check connection string format

3. **Build Failures**:
   - Ensure all environment variables are set
   - Check build logs for specific errors

### Useful Commands
```bash
# Check deployment status
heroku logs --tail -a your-app-name

# Test API endpoints
curl -X GET https://your-api.herokuapp.com/health

# Check environment variables
heroku config -a your-app-name
```

---

**Next Steps**: [Environment Setup](./environment.md) | [Monitoring](./monitoring.md)
