import React, { useState } from 'react';

import ActivityGraph from './components/ActivityGraph';
import UserListPanel from './components/UserListPanel';
import UserClickLog from './components/UserClickLog';
import CategoryPieChart from './components/CategoryPieChart';
import CategoryBarChart from './components/CategoryBarChart'; 

import './App.css';

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const isUserFilterActive = selectedUsers.length > 0;

  return (
    <div className="dashboard-container">
      {/* סיידבר עם רשימת יוזרים */}
      <aside className="sidebar">
        <UserListPanel
          selectUserIds={selectedUsers}
          onUserSelect={setSelectedUsers}
          refreshTrigger={refreshTrigger}
        />
      </aside>

      {/* תוכן ראשי של הדשבורד */}
      <main className="main-content">
        <h1 className="dashboard-title">User Analytics Dashboard</h1>

        {/* גרף חדש שמציג לחיצות לפי קטגוריה ויוזר (Stacked Bar) */}
        <CategoryBarChart selectedUsers={selectedUsers} />

        {/* Pie Chart רגיל לפי קטגוריה */}
        <CategoryPieChart selectedUsers={selectedUsers} />

        {/* גרף פעילות לפי זמן */}
        <section className="dashboard-section">
          <ActivityGraph selectedUsers={selectedUsers} />
        </section>

        {/* טבלת לחיצות של יוזרים נבחרים */}
        {isUserFilterActive && (
          <section className="dashboard-section">
            {selectedUsers.map(userId => (
              <UserClickLog key={userId} userId={userId} />
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
