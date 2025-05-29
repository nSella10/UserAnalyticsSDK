import React, { useState } from 'react';

import ActivityGraph from './components/ActivityGraph';
import UserListPanel from './components/UserListPanel';
import UserClickLog from './components/UserClickLog';
import CategoryBarChart from './components/CategoryBarChart'; 
import MultiPieCharts from './components/MultiPieCharts';


import './App.css';

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');


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
        <CategoryBarChart
          selectedUsers={selectedUsers}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        
        />

        
        {/* Pie Chart רגיל לפי קטגוריה */}
        <MultiPieCharts
          selectedUsers={selectedUsers}
          selectedCategory={selectedCategory}
        />
        

    
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
