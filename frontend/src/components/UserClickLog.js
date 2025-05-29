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

function UserClickLog({ userId }) {
    const [logs, setLogs] = useState([]);
    const [users, setUsers] = useState([]);
    const [userLabel, setUserLabel] = useState('');

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

        // טען לוגים
        fetch(`http://localhost:8080/track/stats/logs?userId=${userId}`)
            .then(res => res.json())
            .then(data => setLogs(data))
            .catch(err => console.error("Error fetching logs:", err));

        // מצא את היוזר להצגה
        const user = users.find(u => u.id === userId);
        if (user) {
            setUserLabel(`${user.firstName} ${user.lastName} - ${user.email}`);
        } else {
            setUserLabel(userId); // fallback
        }
    }, [userId, users]);

    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-sm">
                    📋
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Activity Log</h2>
                    <p className="text-sm text-gray-600">{userLabel}</p>
                </div>
            </div>

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
