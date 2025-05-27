
import React, { useEffect, useState } from "react";

function UserListPanel({ onUserSelect, selectUserIds = [], refreshTrigger }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/track/stats/all-users")
      .then(res => res.json())
      .then(data => {
        setUsers(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        console.error("Error fetching users:", err);
        setUsers([]);
      });
  }, [refreshTrigger]);

  const isSelected = (userId) => {
    return selectUserIds?.includes?.(userId);
  };

  const handleToggleUser = (userId) => {
    if (isSelected(userId)) {
      onUserSelect(selectUserIds.filter(id => id !== userId));
    } else {
      onUserSelect([...selectUserIds, userId]);
    }
  };

  const handleClearFilter = () => {
    onUserSelect([]);
  };

  return (
    <div>
      <h2>👥 Users</h2>
      <button
        onClick={handleClearFilter}
        style={{
          width: '100%',
          padding: '10px 15px',
          marginBottom: '12px',
          border: '2px solid #ccc',
          backgroundColor: selectUserIds.length === 0 ? '#ddd' : '#f8f8f8',
          borderRadius: '6px',
          fontWeight: 'bold',
          cursor: 'pointer',
        }}
      >ללא סינון (הצג את כולם)</button>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {users.map(user => (
          <li key={user.id}>
            <button
              onClick={() => handleToggleUser(user.id)}
              style={{
                width: '100%',
                textAlign: 'left',
                fontSize: '14px',
                padding: '10px 15px',
                marginBottom: '8px',
                border: isSelected(user.id) ? '2px solid #5739ff' : '1px solid #ccc',
                backgroundColor: isSelected(user.id) ? '#e0e7ff' : '#f0f0f0',
                color: isSelected(user.id) ? '#000' : '#333',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: isSelected(user.id) ? 'bold' : 'normal',
                transition: 'all 0.2s ease-in-out',
              }}
            >
              {user.firstName} {user.lastName} - {user.email}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserListPanel;

