
import React, { useEffect, useState } from 'react';

import TotalActions from './components/TotalActions';
import ActionByDate from './components/ActionByDate';
import UserListPanel from './components/UserListPanel';
import ActivtyGraph from './components/ActivityGraph';
import './App.css';

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectUser, setSelectUser] = useState(null);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className='dashbord-container'>

      <aside className="sidebar" >

        <UserListPanel
          selectUser={selectUser}
          onUserSelect={setSelectUser}
          refreshTrigger={refreshTrigger}
        />
      </aside>

      <main className="main-content">
        <h1 className="dashboard-title">User Analytics Dashboard</h1>
        <TotalActions refreshTrigger={refreshTrigger} />
        <ActivtyGraph selectUser={selectUser} />
      </main>
    </div >

  );
}




export default App;


