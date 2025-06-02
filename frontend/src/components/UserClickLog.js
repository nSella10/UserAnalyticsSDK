//import React, { useEffect, useState } from 'react';
//
//function UserClickLog({ userId }) {
//    const [logs, setLogs] = useState([]);
//
//
//    useEffect(() => {
//        if (!userId) return;
//        fetch(`http://localhost:8080/track/stats/logs?userId=${userId}`)
//            .then(res => res.json())
//            .then(data => setLogs(data))
//            .catch(err => console.error("Error fetching logs:", err));
//    }, [userId]);
//
//    return (
//        <div style={{ marginTop: '40px' }}>
//            <h2>📜 User Action Logs</h2>
//            {logs.length === 0 ? (
//                <p>No actions found.</p>
//            ) : (
//                <table border="1" cellPadding="10">
//                    <thead>
//                        <tr>
//                            <th>Time</th>
//                            <th>Action</th>
//                            <th>Category</th>
//                            <th>Subcategory</th>
//                            <th>Item</th>
//                        </tr>
//                    </thead>
//                    <tbody>
//                        {logs.map((log, index) => (
//                            <tr key={index}>
//                                <td>{new Date(log.timestamp).toLocaleString()}</td>
//                                <td>{log.actionName}</td>
//                                <td>{log.properties?.category || '-'}</td>
//                                <td>{log.properties?.subcategory || '-'}</td>
//                                <td>{log.properties?.item || '-'}</td>
//                            </tr>
//                        ))}
//                    </tbody>
//                </table>
//            )}
//        </div>
//    );
//}
//
//export default UserClickLog;
import React, { useEffect, useState } from 'react';
import TimeRangeFilter from './TimeRangeFilter';
import TimeRangeUtils from '../utils/TimeRangeUtils';

function UserClickLog({ userId: initialUserId, selectedUserIds = [] }) {
    const [logs, setLogs] = useState([]);
    const [users, setUsers] = useState([]);
    const [screenSummary, setScreenSummary] = useState(null);
    const [timeRange, setTimeRange] = useState('all');
    const [activeUserId, setActiveUserId] = useState(null);
    const [userLabel, setUserLabel] = useState('');

    // קביעת המשתמשים הזמינים - אם יש selectedUserIds נשתמש בהם, אחרת ביוזר הבודד
    const availableUsers = selectedUserIds.length > 0 ? selectedUserIds : (initialUserId ? [initialUserId] : []);
    const currentUserId = activeUserId || (availableUsers.length > 0 ? availableUsers[0] : initialUserId);

    // הגדרת המשתמש הפעיל הראשוני ועדכון כשהמשתמשים הנבחרים משתנים
    React.useEffect(() => {
        if (availableUsers.length === 0) {
            // אם אין משתמשים נבחרים, נקה את הכל
            setActiveUserId(null);
            setLogs([]);
            setScreenSummary(null);
            setUserLabel('');
        } else if (!activeUserId || !availableUsers.includes(activeUserId)) {
            // אם אין משתמש פעיל או שהמשתמש הפעיל לא ברשימה, בחר את הראשון
            setActiveUserId(availableUsers[0]);
        }
    }, [availableUsers, activeUserId]);

    // שליפת המשתמשים
    useEffect(() => {
        fetch("http://localhost:8080/track/stats/all-users")
            .then(res => res.json())
            .then(data => setUsers(data))
            .catch(err => console.error("Error fetching users:", err));
    }, []);

    // שליפת הפעולות לפי יוזר
    useEffect(() => {
        if (!currentUserId) {
            // אם אין משתמש פעיל, נקה את הנתונים
            setLogs([]);
            setScreenSummary(null);
            setUserLabel('');
            return;
        }

        // בניית URL עם פרמטרי זמן
        const params = new URLSearchParams();
        params.append('userId', currentUserId);
        TimeRangeUtils.addTimeRangeToParams(params, timeRange);

        // טען לוגים וסנן את שורות SCREEN_DURATION
        fetch(`http://localhost:8080/track/stats/logs?${params.toString()}`)
            .then(res => res.json())
            .then(data => {
                console.log('Received logs:', data.length, 'items for timeRange:', timeRange);
                // סינון שורות SCREEN_DURATION
                const filteredLogs = data.filter(log => log.actionName !== 'screen_duration');
                setLogs(filteredLogs);
            })
            .catch(err => console.error("Error fetching logs:", err));

        // טען סיכום זמני מסך
        const summaryParams = new URLSearchParams();
        TimeRangeUtils.addTimeRangeToParams(summaryParams, timeRange);

        fetch(`http://localhost:8080/screen-time/user-screen-summary/${currentUserId}?${summaryParams.toString()}`)
            .then(res => res.json())
            .then(data => {
                // סינון קטגוריית "אחר" מהתוצאות
                if (data && data.categories) {
                    data.categories = data.categories.filter(category => category.category !== 'אחר');
                }
                setScreenSummary(data);
            })
            .catch(err => console.error("Error fetching screen summary:", err));

        // מצא את היוזר להצגה
        const user = users.find(u => u.id === currentUserId);
        if (user) {
            setUserLabel(`${user.firstName} ${user.lastName} - ${user.email}`);
        } else {
            setUserLabel(currentUserId); // fallback
        }
    }, [currentUserId, users, timeRange]);

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'ספורט':
                return '⚽';
            case 'טכנולוגיה':
                return '💻';
            case 'בידור':
                return '🎬';
            case 'מוזיקה':
                return '🎵';
            case 'סרטים':
                return '🎬';
            case 'משחקים':
                return '🎮';
            case 'ספרים':
                return '📚';
            case 'אוכל':
                return '🍽️';
            case 'טיולים':
                return '✈️';
            case 'חדשות':
                return '📰';
            case 'דף ראשי':
                return '🏠';
            case 'עיון בקטגוריות':
                return '📋';
            case 'צפייה בפרטים':
                return '🔍';
            default:
                return '📂';
        }
    };

    // אם אין משתמשים זמינים, הצג הודעה
    if (availableUsers.length === 0) {
        return (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-sm">
                        📋
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">Activity Log</h2>
                </div>
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                    <span className="text-4xl mb-4 opacity-50">👥</span>
                    <p className="text-lg font-medium mb-2">לא נבחרו משתמשים</p>
                    <p className="text-sm">בחר משתמשים מהרשימה כדי לראות את הפעילות שלהם.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-sm">
                        📋
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Activity Log</h2>
                        <p className="text-sm text-gray-600">{userLabel}</p>
                    </div>
                </div>

                {/* פילטר זמן */}
                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">טווח זמן:</label>
                    <TimeRangeFilter
                        timeRange={timeRange}
                        setTimeRange={setTimeRange}
                    />
                </div>
            </div>

            {/* User Tabs - רק אם יש יותר ממשתמש אחד */}
            {availableUsers.length > 1 && (
                <div className="mb-6">
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                            👥 בחר משתמש לצפייה:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {availableUsers.map(userId => {
                                const user = users.find(u => u.id === userId);
                                const displayName = user ? `${user.firstName} ${user.lastName}` : userId;
                                const isActive = userId === currentUserId;

                                return (
                                    <button
                                        key={userId}
                                        onClick={() => setActiveUserId(userId)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                                            isActive
                                                ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                                                : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 shadow-sm'
                                        }`}
                                    >
                                        <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-white' : 'bg-green-400'}`}></span>
                                        {displayName}
                                        {isActive && <span className="text-xs">✓</span>}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Screen Time Summary */}
            {screenSummary && screenSummary.categories && screenSummary.categories.length > 0 && (
                <div className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-5 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        📊 סיכום זמני מסך
                    </h3>

                    {/* סיכום כללי */}
                    <div className="mb-4">
                        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                    ⏱️
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">סה"כ זמן באפליקציה</p>
                                    <p className="text-2xl font-bold text-blue-600">{screenSummary.totalTimeFormatted}</p>
                                    <p className="text-xs text-gray-500">זמן שהייה כולל בכל הקטגוריות</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* פירוט לפי קטגוריות */}
                    <div>
                        <h4 className="text-md font-medium text-gray-700 mb-3">פירוט זמן לפי קטגוריות:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {screenSummary.categories.slice(0, 6).map((category, index) => (
                                <div key={index} className="bg-white rounded-lg p-3 border border-gray-200 hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-medium text-gray-800 flex items-center gap-1 text-sm">
                                            {getCategoryIcon(category.category)}
                                            {category.category}
                                        </span>
                                        <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                                            {category.percentage}%
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-600 space-y-1">
                                        <div className="flex justify-between">
                                            <span>זמן בקטגוריה:</span>
                                            <span className="font-medium text-blue-600">{category.durationFormatted}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>מספר כניסות:</span>
                                            <span className="font-medium">{category.visits}</span>
                                        </div>
                                    </div>
                                    <div className="mt-2">
                                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                                            <div
                                                className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full transition-all duration-300"
                                                style={{ width: `${category.percentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {logs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                    <span className="text-4xl mb-4 opacity-50">📝</span>
                    <p className="text-lg font-medium mb-2">אין פעולות נמצאו</p>
                    <p className="text-sm">המשתמש עדיין לא ביצע פעולות מעוקבות.</p>
                </div>
            ) : (
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                            🎯 פעולות המשתמש
                        </h3>
                        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                            {logs.length} פעולות
                        </span>
                    </div>

                    <div className="space-y-3">
                        {logs.map((log, index) => (
                            <div key={index} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all duration-200 hover:border-blue-300">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                                {log.actionName}
                                            </span>
                                            <span className="text-sm text-gray-500 font-mono">
                                                {new Date(log.timestamp).toLocaleString('he-IL', {
                                                    year: 'numeric',
                                                    month: '2-digit',
                                                    day: '2-digit',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    second: '2-digit'
                                                })}
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {log.properties?.category && (
                                                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-purple-100 text-purple-800">
                                                    {getCategoryIcon(log.properties.category)} {log.properties.category}
                                                </span>
                                            )}
                                            {log.properties?.subcategory && (
                                                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800">
                                                    📂 {log.properties.subcategory}
                                                </span>
                                            )}
                                            {log.properties?.item && (
                                                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-orange-100 text-orange-800">
                                                    🏷️ {log.properties.item}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserClickLog;
