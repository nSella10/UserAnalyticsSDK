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

function UserClickLog({ userId }) {
    const [logs, setLogs] = useState([]);
    const [users, setUsers] = useState([]);
    const [userLabel, setUserLabel] = useState('');
    const [screenSummary, setScreenSummary] = useState(null);
    const [timeRange, setTimeRange] = useState('all');

    // שליפת המשתמשים
    useEffect(() => {
        fetch("http://localhost:8080/track/stats/all-users")
            .then(res => res.json())
            .then(data => setUsers(data))
            .catch(err => console.error("Error fetching users:", err));
    }, []);

    // שליפת הפעולות לפי יוזר
    useEffect(() => {
        if (!userId) return;

        // בניית URL עם פרמטרי זמן
        const params = new URLSearchParams();
        params.append('userId', userId);
        TimeRangeUtils.addTimeRangeToParams(params, timeRange);

        // טען לוגים
        fetch(`http://localhost:8080/track/stats/logs?${params.toString()}`)
            .then(res => res.json())
            .then(data => {
                console.log('Received logs:', data.length, 'items for timeRange:', timeRange);
                setLogs(data);
            })
            .catch(err => console.error("Error fetching logs:", err));

        // טען סיכום זמני מסך
        const summaryParams = new URLSearchParams();
        TimeRangeUtils.addTimeRangeToParams(summaryParams, timeRange);

        fetch(`http://localhost:8080/screen-time/user-screen-summary/${userId}?${summaryParams.toString()}`)
            .then(res => res.json())
            .then(data => setScreenSummary(data))
            .catch(err => console.error("Error fetching screen summary:", err));

        // מצא את היוזר להצגה
        const user = users.find(u => u.id === userId);
        if (user) {
            setUserLabel(`${user.firstName} ${user.lastName} - ${user.email}`);
        } else {
            setUserLabel(userId); // fallback
        }
    }, [userId, users, timeRange]);

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'ספורט':
                return '⚽';
            case 'טכנולוגיה':
                return '💻';
            case 'בידור':
                return '🎬';
            case 'חדשות':
                return '📰';
            case 'דף ראשי':
                return '🏠';
            default:
                return '📂';
        }
    };

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

            {/* Screen Time Summary */}
            {screenSummary && screenSummary.categories && screenSummary.categories.length > 0 && (
                <div className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        📊 סיכום זמני מסך לפי קטגוריות
                    </h3>
                    <div className="mb-3 flex flex-wrap gap-4 text-sm text-gray-600">
                        <span>⏱️ סה"כ זמן: <strong>{screenSummary.totalTimeFormatted}</strong></span>
                        <span>📱 סה"כ מסכים: <strong>{screenSummary.totalScreens}</strong></span>
                    </div>
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
                                        <span>זמן:</span>
                                        <span className="font-medium text-blue-600">{category.durationFormatted}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>ביקורים:</span>
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
            )}

            {logs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                    <span className="text-4xl mb-4 opacity-50">📝</span>
                    <p className="text-lg font-medium mb-2">No actions found</p>
                    <p className="text-sm">This user hasn't performed any tracked actions yet.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse bg-white rounded-xl overflow-hidden shadow-sm">
                        <thead>
                            <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">
                                    Time
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">
                                    Action
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">
                                    Category
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">
                                    Subcategory
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">
                                    Item
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {logs.map((log, index) => (
                                <tr key={index} className="hover:bg-blue-50 transition-colors duration-150">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-mono">
                                        {new Date(log.timestamp).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {log.actionName}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {log.properties?.category ? (
                                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-purple-100 text-purple-800">
                                                {log.properties.category}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {log.properties?.subcategory ? (
                                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800">
                                                {log.properties.subcategory}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {log.properties?.item ? (
                                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-orange-100 text-orange-800">
                                                {log.properties.item}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default UserClickLog;
