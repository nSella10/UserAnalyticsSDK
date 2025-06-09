# 🚀 Cloud Deployment Setup Guide

## Step 1: MongoDB Atlas Setup

### 1.1 Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/atlas
2. Click "Try Free"
3. Sign up with your email
4. Verify your email

### 1.2 Create Cluster
1. Choose "Build a Database"
2. Select "FREE" (M0 Sandbox)
3. Choose Cloud Provider: AWS
4. Region: Choose closest to your users
5. Cluster Name: `useranalytics-cluster`
6. Click "Create Cluster"

### 1.3 Create Database User
1. Go to "Database Access" in left menu
2. Click "Add New Database User"
3. Authentication Method: Password
4. Username: `analytics_user`
5. Password: Click "Autogenerate Secure Password" (SAVE THIS!)
6. Database User Privileges: "Read and write to any database"
7. Click "Add User"

### 1.4 Setup Network Access
1. Go to "Network Access" in left menu
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### 1.5 Get Connection String
1. Go to "Clusters"
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Driver: Java, Version: 4.3 or later
5. Copy the connection string:
   ```
   mongodb+srv://analytics_user:<password>@useranalytics-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<password>` with the password you saved

## Step 2: Railway Backend Deployment

### 2.1 Create Railway Account
1. Go to https://railway.app
2. Sign up with GitHub
3. Connect your GitHub account

### 2.2 Deploy Backend
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose "UserAnalyticsSDK"
4. Railway will detect it's a Java project

### 2.3 Configure Environment Variables
In Railway dashboard:
1. Go to your project
2. Click on the backend service
3. Go to "Variables" tab
4. Add these variables:

```env
MONGODB_URI=mongodb+srv://analytics_user:YOUR_PASSWORD@useranalytics-cluster.xxxxx.mongodb.net/useranalytics?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
CORS_ORIGINS=*
PORT=8080
SPRING_PROFILES_ACTIVE=prod
```

### 2.4 Configure Build Settings
1. Go to "Settings" tab
2. Build Command: `cd backend && ./gradlew build`
3. Start Command: `cd backend && java -jar build/libs/*.jar`

## Step 3: Vercel Frontend Deployment

### 3.1 Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub

### 3.2 Deploy Frontend
1. Click "New Project"
2. Import your GitHub repository
3. Framework Preset: React
4. Root Directory: `frontend`
5. Build Command: `npm run build`
6. Output Directory: `build`

### 3.3 Configure Environment Variables
In Vercel dashboard:
1. Go to your project settings
2. Go to "Environment Variables"
3. Add:

```env
REACT_APP_API_URL=https://your-railway-backend-url.railway.app
REACT_APP_ENVIRONMENT=production
```

## Step 4: Update Code for Production

### 4.1 Update Backend CORS
We need to update the backend to accept requests from your Vercel domain.

### 4.2 Update Frontend API Configuration
We need to use environment variables for the API URL.

### 4.3 Test the Deployment
1. Backend health check: https://your-railway-url.railway.app/health
2. Frontend: https://your-vercel-app.vercel.app

## Next Steps
1. Get your Railway backend URL
2. Update Vercel environment variables
3. Test the full flow
4. Update documentation with live URLs

---

**Let's start with MongoDB Atlas setup first!**
