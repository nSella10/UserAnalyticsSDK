# 📊 UserAnalyticsSDK

> A comprehensive analytics solution for Android applications with real-time dashboard and developer portal.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Android](https://img.shields.io/badge/Platform-Android-green.svg)](https://developer.android.com)
[![Spring Boot](https://img.shields.io/badge/Backend-Spring%20Boot-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/Frontend-React-blue.svg)](https://reactjs.org)

## 🌟 Overview

UserAnalyticsSDK is a complete analytics platform that enables Android developers to track user behavior, screen time, and custom events in their applications. The platform consists of four main components working together to provide comprehensive analytics insights.

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Android App   │    │  Analytics SDK  │    │   Backend API   │
│                 │───▶│                 │───▶│                 │
│  (Example App)  │    │   (Library)     │    │  (Spring Boot)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
                                                        ▼
┌─────────────────┐                            ┌─────────────────┐
│  Admin Portal   │                            │    MongoDB      │
│                 │◀───────────────────────────│                 │
│    (React)      │                            │   (Database)    │
└─────────────────┘                            └─────────────────┘
```

## 🚀 Features

### 📱 **Android SDK**
- **Easy Integration**: Simple one-line initialization
- **Event Tracking**: Track custom user actions and events
- **Screen Time Monitoring**: Automatic screen duration tracking
- **Real-time Data**: Instant data transmission to backend
- **Offline Support**: Queue events when offline (coming soon)

### 🖥️ **Admin Dashboard**
- **Real-time Analytics**: Live data visualization
- **Multi-App Support**: Manage multiple applications
- **User Segmentation**: Filter data by users and time periods
- **RTL Support**: Full Hebrew language support
- **Developer Authentication**: Secure access control

### ⚙️ **Backend API**
- **RESTful API**: Clean and documented endpoints
- **JWT Authentication**: Secure user management
- **MongoDB Integration**: Scalable data storage
- **API Key Management**: Unique keys per application
- **CORS Support**: Cross-origin resource sharing

### 📊 **Analytics Features**
- User action tracking
- Screen time analysis
- Category-based insights
- Time-based filtering
- Export capabilities

## 📦 Components

| Component | Technology | Description |
|-----------|------------|-------------|
| **Android SDK** | Java | Library for developers to integrate |
| **Example App** | Java/Android | Demonstration application |
| **Backend API** | Spring Boot | RESTful API service |
| **Admin Portal** | React | Web dashboard for analytics |
| **Database** | MongoDB | Data storage and management |

## 🛠️ Quick Start

### Prerequisites
- Android Studio
- Java 8+
- Node.js 14+
- MongoDB
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/nSella10/UserAnalyticsSDK.git
cd UserAnalyticsSDK
```

### 2. Setup Backend
```bash
cd backend
./gradlew bootRun
```

### 3. Setup Frontend
```bash
cd frontend
npm install
npm start
```

### 4. Setup Android
```bash
# Open in Android Studio
# Build and run the example app
```

## 📖 Documentation

- [📚 **Complete Documentation**](./docs/README.md)
- [🔧 **API Reference**](./docs/api/README.md)
- [📱 **SDK Integration Guide**](./docs/sdk/README.md)
- [🚀 **Deployment Guide**](./docs/deployment/README.md)
- [🔒 **Security Setup**](./SECURITY_SETUP.md)

## 📱 Screenshots

### Admin Dashboard
![Dashboard Overview](./docs/images/dashboard-overview.png)
*Real-time analytics dashboard with user activity insights*

### Android Example App
![Android App](./docs/images/android-app.png)
*Example Android application demonstrating SDK integration*

### Developer Portal
![Developer Portal](./docs/images/developer-portal.png)
*Developer registration and application management*

## 🎯 Usage Example

### Android Integration
```java
// Initialize the SDK
AnalyticsTracker.init("https://your-api.com/", "your_api_key");

// Track user events
Map<String, Object> properties = new HashMap<>();
properties.put("category", "sports");
AnalyticsTracker.trackEvent("user123", "click_category", properties);

// Track screen time
AnalyticsTracker.startScreen("MainActivity");
// ... user interacts with screen ...
AnalyticsTracker.endScreen("user123");
```

## 🌟 Live Demo

- 🌐 **Admin Dashboard**: [https://useranalytics-demo.vercel.app](https://useranalytics-demo.vercel.app)
- 📱 **API Documentation**: [https://api-docs.useranalytics.com](https://api-docs.useranalytics.com)
- 📚 **Full Documentation**: [https://docs.useranalytics.com](https://docs.useranalytics.com)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **nSella10** - *Initial work* - [GitHub](https://github.com/nSella10)

## 🙏 Acknowledgments

- Spring Boot community
- React community
- Android development community
- MongoDB team

---

**Made with ❤️ for the developer community**
