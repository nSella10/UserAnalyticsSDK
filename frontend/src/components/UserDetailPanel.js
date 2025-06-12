// This component is used to display the user details in the user details panel
import React, { useEffect, useState } from "react";
import { buildApiUrl, API_ENDPOINTS, authenticatedFetch } from "../config/api";

function UserDetailPanel({ refreshTrigger, selectedApp }) {
    const [data, setData] = useState({});
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    useEffect(() => {
        // Don't fetch if no app is selected
        if (!selectedApp || !selectedApp.apiKey) {
            setData({});
            return;
        }

        setLoading(true);
        setError(null);

        // Build the API URL for user stats by action with API key
        const url = buildApiUrl('/track/stats/by-user-and-action', {
            apiKey: selectedApp.apiKey
        });

        console.log('🔄 Fetching user stats for app:', selectedApp.name);

        authenticatedFetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('📊 User stats data received:', data);
                setData(data);
                setError(null);
            })
            .catch(error => {
                console.error('❌ Error fetching user stats:', error);
                setError(error.message);
                setData({});
            })
            .finally(() => {
                setLoading(false);
            });
    }, [refreshTrigger, selectedApp]);

    const users = Object.keys(data);

    return (
        <div style={{ marginTop: '60px' }}>
            <h2>📋 Users & Their Actions</h2>

            {/* Show app selection message if no app selected */}
            {!selectedApp && (
                <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                    📱 Please select an app to view user statistics
                </div>
            )}

            {/* Show loading state */}
            {loading && (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    🔄 Loading user statistics...
                </div>
            )}

            {/* Show error state */}
            {error && (
                <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>
                    ❌ Error: {error}
                </div>
            )}

            {/* Show data if available */}
            {selectedApp && !loading && !error && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                    <div style={{ textAlign: 'left' }}>
                        <h3>Users ({users.length})</h3>
                        {users.length === 0 ? (
                            <div style={{ color: '#666', fontStyle: 'italic' }}>
                                No users found for this app
                            </div>
                        ) : (
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
                                                cursor: 'pointer',
                                                width: '100%',
                                                textAlign: 'left'
                                            }}
                                            onClick={() => setSelectedUser(user)}
                                        >
                                            👤 {user}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div style={{ textAlign: 'left' }}>
                        <h3>Actions for: {selectedUser || 'Select a User'}</h3>
                        {selectedUser && data[selectedUser] ? (
                            <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#f5f5f5' }}>
                                        <th>Action</th>
                                        <th>Count</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(data[selectedUser]).map(([action, count]) => (
                                        <tr key={action}>
                                            <td>🎯 {action}</td>
                                            <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{count}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : selectedUser ? (
                            <div style={{ color: '#666', fontStyle: 'italic' }}>
                                No actions found for this user
                            </div>
                        ) : (
                            <div style={{ color: '#666', fontStyle: 'italic' }}>
                                Select a user to view their actions
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserDetailPanel;

