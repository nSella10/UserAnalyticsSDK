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
        <div style={{ marginTop: '40px' }}>
            <h2>📄 Click Log for User: {userLabel}</h2>
            <h3>📜 User Action Logs</h3>

            {logs.length === 0 ? (
                <p>No actions found.</p>
            ) : (
                <table border="1" cellPadding="10">
                    <thead>
                        <tr>
                            <th>Time</th>
                            <th>Action</th>
                            <th>Category</th>
                            <th>Subcategory</th>
                            <th>Item</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map((log, index) => (
                            <tr key={index}>
                                <td>{new Date(log.timestamp).toLocaleString()}</td>
                                <td>{log.actionName}</td>
                                <td>{log.properties?.category || '-'}</td>
                                <td>{log.properties?.subcategory || '-'}</td>
                                <td>{log.properties?.item || '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default UserClickLog;
