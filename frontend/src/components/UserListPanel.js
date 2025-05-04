import React,{ useEffect, useState } from "react";

function UserListPanel({ onUserSelect, selectUser, refreshTrigger }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/track/stats/by-user")
      .then(res => res.json())
      .then(data => {
        const userId = Object.keys(data);
        setUsers(userId);
      })
      .catch(err => console.error("Error fetching data: ", err));
  }, [refreshTrigger]);

  return (
    <div>
      <h2>👥 Users</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {users.map(user => (
          <li key={user}>
            <button
              className={selectUser === user ? 'active' : ''}
              onClick={() => onUserSelect(user)}
              style={{
                width: '100%',
                textAlign: 'left',
                fontSize: '14px',
                padding: '10px 15px',
                marginBottom: '8px',
                border: 'none',
                backgroundColor: '#f0f0f0',
                color: '#333',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              {user}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default UserListPanel;