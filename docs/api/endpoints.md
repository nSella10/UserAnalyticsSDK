# 🌐 API Documentation

This document describes the RESTful API endpoints for the UserAnalyticsSDK backend service.

## 🔗 Base URL
```
Production: https://your-api-server.com/
Development: http://localhost:8080/
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

## 📊 API Endpoints

### 👤 User Management

#### Register User
```http
POST /api/users/register
```

**Request Body:**
```json
{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "password": "securePassword123",
    "age": 25,
    "gender": "MALE",
    "company": "Tech Corp"
}
```

**Response:**
```json
{
    "message": "User registered successfully",
    "userId": "507f1f77bcf86cd799439011"
}
```

#### Login User
```http
POST /api/users/login
```

**Request Body:**
```json
{
    "email": "john.doe@example.com",
    "password": "securePassword123"
}
```

**Response:**
```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
        "id": "507f1f77bcf86cd799439011",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@example.com",
        "age": 25,
        "gender": "MALE",
        "company": "Tech Corp"
    }
}
```

#### Get User Profile
```http
GET /api/users/profile
Authorization: Bearer <token>
```

**Response:**
```json
{
    "id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "age": 25,
    "gender": "MALE",
    "company": "Tech Corp",
    "createdAt": "2025-01-15T10:30:00Z"
}
```

### 📱 Application Management

#### Create Application
```http
POST /api/applications
Authorization: Bearer <token>
```

**Request Body:**
```json
{
    "appName": "My Awesome App",
    "description": "A great mobile application"
}
```

**Response:**
```json
{
    "id": "507f1f77bcf86cd799439012",
    "appName": "My Awesome App",
    "description": "A great mobile application",
    "apiKey": "ak_1234567890abcdef",
    "developerId": "507f1f77bcf86cd799439011",
    "createdAt": "2025-01-15T10:30:00Z"
}
```

#### Get User Applications
```http
GET /api/applications
Authorization: Bearer <token>
```

**Response:**
```json
[
    {
        "id": "507f1f77bcf86cd799439012",
        "appName": "My Awesome App",
        "description": "A great mobile application",
        "apiKey": "ak_1234567890abcdef",
        "developerId": "507f1f77bcf86cd799439011",
        "createdAt": "2025-01-15T10:30:00Z"
    }
]
```

### 📊 Analytics Data

#### Track User Action
```http
POST /api/user-actions
```

**Headers:**
```http
X-API-Key: ak_1234567890abcdef
Content-Type: application/json
```

**Request Body:**
```json
{
    "userId": "user123",
    "actionName": "button_click",
    "properties": {
        "button_name": "login",
        "screen": "MainActivity"
    }
}
```

**Response:**
```json
{
    "message": "Action tracked successfully",
    "actionId": "507f1f77bcf86cd799439013"
}
```

#### Track Screen Time
```http
POST /api/screen-times
```

**Headers:**
```http
X-API-Key: ak_1234567890abcdef
Content-Type: application/json
```

**Request Body:**
```json
{
    "userId": "user123",
    "screenName": "MainActivity",
    "startTime": "2025-01-15T10:30:00Z",
    "endTime": "2025-01-15T10:35:00Z",
    "duration": 300000
}
```

**Response:**
```json
{
    "message": "Screen time tracked successfully",
    "screenTimeId": "507f1f77bcf86cd799439014"
}
```

#### Get User Actions
```http
GET /api/user-actions?apiKey=ak_1234567890abcdef&userId=user123&startDate=2025-01-01&endDate=2025-01-31
Authorization: Bearer <token>
```

**Query Parameters:**
- `apiKey` (required): Application API key
- `userId` (optional): Filter by specific user
- `startDate` (optional): Start date (YYYY-MM-DD)
- `endDate` (optional): End date (YYYY-MM-DD)
- `actionName` (optional): Filter by action name

**Response:**
```json
[
    {
        "id": "507f1f77bcf86cd799439013",
        "userId": "user123",
        "actionName": "button_click",
        "properties": {
            "button_name": "login",
            "screen": "MainActivity"
        },
        "timestamp": "2025-01-15T10:30:00Z",
        "apiKey": "ak_1234567890abcdef"
    }
]
```

#### Get Screen Times
```http
GET /api/screen-times?apiKey=ak_1234567890abcdef&userId=user123
Authorization: Bearer <token>
```

**Query Parameters:**
- `apiKey` (required): Application API key
- `userId` (optional): Filter by specific user
- `startDate` (optional): Start date (YYYY-MM-DD)
- `endDate` (optional): End date (YYYY-MM-DD)

**Response:**
```json
[
    {
        "id": "507f1f77bcf86cd799439014",
        "userId": "user123",
        "screenName": "MainActivity",
        "startTime": "2025-01-15T10:30:00Z",
        "endTime": "2025-01-15T10:35:00Z",
        "duration": 300000,
        "apiKey": "ak_1234567890abcdef"
    }
]
```

## 📈 Analytics Aggregation

#### Get User Activity Summary
```http
GET /api/analytics/user-summary?apiKey=ak_1234567890abcdef&userId=user123
Authorization: Bearer <token>
```

**Response:**
```json
{
    "userId": "user123",
    "totalActions": 150,
    "totalScreenTime": 7200000,
    "averageSessionDuration": 480000,
    "mostUsedScreen": "MainActivity",
    "topActions": [
        {
            "actionName": "button_click",
            "count": 45
        },
        {
            "actionName": "screen_view",
            "count": 30
        }
    ]
}
```

## ❌ Error Responses

### 400 Bad Request
```json
{
    "error": "Bad Request",
    "message": "Invalid request parameters",
    "details": "userId is required"
}
```

### 401 Unauthorized
```json
{
    "error": "Unauthorized",
    "message": "Invalid or missing authentication token"
}
```

### 403 Forbidden
```json
{
    "error": "Forbidden",
    "message": "Invalid API key"
}
```

### 404 Not Found
```json
{
    "error": "Not Found",
    "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
    "error": "Internal Server Error",
    "message": "An unexpected error occurred"
}
```

## 🔄 Rate Limiting

- **Rate Limit**: 1000 requests per hour per API key
- **Headers**: 
  - `X-RateLimit-Limit`: Maximum requests per hour
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Time when limit resets

## 📝 Request/Response Format

- **Content-Type**: `application/json`
- **Character Encoding**: UTF-8
- **Date Format**: ISO 8601 (YYYY-MM-DDTHH:mm:ssZ)
- **Timestamps**: UTC timezone

## 🔒 Security Headers

All responses include security headers:
```http
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

---

**Next**: [Authentication Guide](./authentication.md) | [Error Handling](./errors.md)
