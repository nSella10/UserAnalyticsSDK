// Configuration file for the frontend application
// Reads values from environment variables

const config = {
    // API Base URL - read from environment variable
    API_BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8080',

    // Environment
    ENVIRONMENT: process.env.REACT_APP_ENV || 'development',

    // Debug mode
    DEBUG: process.env.REACT_APP_DEBUG === 'true',

    // API Endpoints
    ENDPOINTS: {
        DEVELOPERS: {
            LOGIN: '/developers/login',
            REGISTER: '/developers/register'
        },
        APPS: '/api/apps',
        ANALYTICS: '/api/analytics',
        TRACK: {
            BASE: '/track',
            STATS: {
                COUNT: '/track/stats/count',
                ALL_USERS: '/track/stats/all-users',
                BY_CATEGORY: '/track/stats/by-category',
                BY_DATE: '/track/stats/by-date',
                BY_USER_BY_DATE: '/track/stats/by-user/by-date',
                LOGS: '/track/stats/logs'
            }
        },
        USER_ACTIONS: '/user-actions/user-activity',
        SCREEN_TIME: {
            USER_SCREEN_TIME: '/screen-time/user-screen-time',
            USER_SCREEN_SUMMARY: '/screen-time/user-screen-summary'
        }
    }
};

export default config;
