import React, { useEffect, useState } from 'react';


function ActionByUser({ refreshTrigger }) {
    const [userCounts, setUserCounts] = useState({});

    useEffect(() => {
        fetch('http://localhost:8080/track/stats/by-user')
            .then(response => response.json())
            .then(data => setUserCounts(data))
            .catch(error => console.error('Error fetching user stats:', error));

    }, [refreshTrigger]);

    return (
        <div style={{ marginTop: '40px' }}>
            <h2>Actions By User</h2>

            <table border="1" cellPadding="10" style={{ margin: '0 auto' }}>
                <thead>
                    <tr>
                        <th>User ID</th>
                        <th>Count</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(userCounts).map(([user, count]) => (
                        <tr key={user}>
                            <td>{user}</td>
                            <td>{count}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ActionByUser;


