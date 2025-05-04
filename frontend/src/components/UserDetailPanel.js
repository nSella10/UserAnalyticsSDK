// This component is used to display the user details in the user details panel
import React, { useEffect, useState } from "react";

function UserDetailPanel({ refreshTrigger }) {
    const [data, setData] = useState({});
    const [selectedUser, setSelectedUser] = useState(null);
   

    useEffect(() => {
        fetch('http://localhost:8080/track/stats/by-user-and-action')
            .then(response => response.json())
            .then(data => setData(data))
            .catch(error => console.error('Error fetching user stats:', error));
    }, [refreshTrigger]);
    
    const users = Object.keys(data);

    return (
        <div style={{ marginTop: '60px' }}>
            <h2>📋 Users & Their Actions</h2>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                <div style={{ textAlign: 'left' }}>
                    <h3>Users</h3>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {users.map(user => (
                            <li key={user}>
                                <button
                                    style={{
                                        padding: '8px 16px',
                                        margin: '6px 0',
                                        backgroundColor: selectedUser === user ? '#4f46e5' : '#eee',
                                        color: selectedUser === user ? 'white' : 'black',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => setSelectedUser(user)}
                                >
                                    {user}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                <div style={{ textAlign: 'left' }}>
                    <h3>Actions for: {selectedUser || 'Select a User'}</h3>
                    {selectedUser && (
                        <table border="1" cellPadding="10">
                            <thead>
                                <tr>
                                    <th>Action</th>
                                    <th>Count</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(data[selectedUser]).map(([action, count]) => (
                                    <tr key={action}>
                                        <td>{action}</td>
                                        <td>{count}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}

export default UserDetailPanel;

