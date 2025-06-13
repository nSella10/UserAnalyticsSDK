import { useState, useEffect } from 'react';
import UserListPanel from './components/UserListPanel';
import UserClickLog from './components/UserClickLog';
import CategoryBarChart from './components/CategoryBarChart';
import MultiPieCharts from './components/MultiPieCharts';
import DeveloperAuth from './components/DeveloperAuth';
import AppSelector from './components/AppSelector';

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [developer, setDeveloper] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);
  const [showAppSelector, setShowAppSelector] = useState(false);

  // בדיקה אם המפתח כבר מחובר
  useEffect(() => {
    const savedDeveloper = localStorage.getItem('developer');
    const savedApp = localStorage.getItem('selectedApp');

    if (savedDeveloper) {
      try {
        const developerData = JSON.parse(savedDeveloper);
        setDeveloper(developerData);
        setIsAuthenticated(true);

        if (savedApp) {
          const appData = JSON.parse(savedApp);
          setSelectedApp(appData);
          setShowAppSelector(false);
        } else {
          setShowAppSelector(true);
        }
      } catch (error) {
        console.error('Error parsing saved data:', error);
        localStorage.removeItem('developer');
        localStorage.removeItem('selectedApp');
      }
    }
  }, []);

  // ✅ איפוס בחירות כשמשנים אפליקציה
  useEffect(() => {
    if (selectedApp) {
      setSelectedUsers([]);
      setSelectedCategory('');
    }
  }, [selectedApp?.id]); // רק כשה-ID של האפליקציה משתנה

  const handleAuthSuccess = (developerData) => {
    setIsAuthenticated(true);
    setDeveloper(developerData);
    setShowAppSelector(true); // הצגת מסך בחירת אפליקציות

    // שמירה ב-localStorage
    localStorage.setItem('developer', JSON.stringify(developerData));
  };

  const handleAppSelected = (app) => {
    setSelectedApp(app);
    setShowAppSelector(false);

    // ✅ איפוס בחירת משתמשים כשעוברים לאפליקציה חדשה
    setSelectedUsers([]);
    setSelectedCategory('');

    // שמירה ב-localStorage
    localStorage.setItem('selectedApp', JSON.stringify(app));
  };

  const handleBackToApps = () => {
    setSelectedApp(null);
    setShowAppSelector(true);

    // ✅ איפוס כל הבחירות כשחוזרים לבחירת אפליקציות
    setSelectedUsers([]);
    setSelectedCategory('');

    localStorage.removeItem('selectedApp');
  };

  const handleLogout = () => {
    localStorage.removeItem('developer');
    localStorage.removeItem('selectedApp');
    setIsAuthenticated(false);
    setDeveloper(null);
    setSelectedApp(null);
    setShowAppSelector(false);

    // ✅ איפוס כל הבחירות בהתנתקות
    setSelectedUsers([]);
    setSelectedCategory('');
  };
  const [selectedCategory, setSelectedCategory] = useState('');

  const isUserFilterActive = selectedUsers.length > 0;

  // אם המפתח לא מחובר, הצג מסך התחברות
  if (!isAuthenticated) {
    return <DeveloperAuth onAuthSuccess={handleAuthSuccess} />;
  }

  // אם המפתח מחובר אבל לא בחר אפליקציה, הצג מסך בחירת אפליקציות
  if (showAppSelector || !selectedApp) {
    return (
      <AppSelector
        developer={developer}
        onAppSelected={handleAppSelected}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100/20 to-purple-100/20"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      <div className="relative grid grid-cols-1 lg:grid-cols-[280px_1fr] min-h-screen">
        {/* Sidebar */}
        <aside className="lg:sticky lg:top-0 lg:h-screen">
          <UserListPanel
            selectUserIds={selectedUsers}
            onUserSelect={setSelectedUsers}
            refreshTrigger={refreshTrigger}
            selectedApp={selectedApp}
          />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8 space-y-8 overflow-y-auto">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-4">
                Analytics Dashboard
              </h1>
              <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto lg:mx-0 mb-6"></div>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto lg:mx-0">
                Comprehensive insights into user behavior and engagement patterns
              </p>
            </div>

            {/* Developer Info & Logout */}
            <div className="mt-6 lg:mt-0 flex flex-col items-center lg:items-end">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-200 shadow-lg">
                <div className="text-right mb-3">
                  <p className="text-sm text-gray-600">ברוך הבא,</p>
                  <p className="font-bold text-gray-800">{developer?.firstName} {developer?.lastName}</p>
                  <p className="text-xs text-gray-500">{developer?.companyName} • {selectedApp?.appName}</p>
                </div>

                <div className="flex gap-2 mb-3">
                  <button
                    onClick={handleBackToApps}
                    className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-xs font-medium"
                  >
                    החלף אפליקציה
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-xs font-medium"
                  >
                    התנתק
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:scale-[1.02]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-xl">
                  👥
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Active Users</p>
                  <p className="text-2xl font-bold text-gray-800">{selectedUsers.length || 'All'}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:scale-[1.02]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl">
                  📊
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Category Filter</p>
                  <p className="text-2xl font-bold text-gray-800">{selectedCategory || 'All'}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:scale-[1.02]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white text-xl">
                  📈
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Data Status</p>
                  <p className="text-2xl font-bold text-green-600">Live</p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="space-y-8">
            {/* Category Bar Chart */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-sm">
                  📊
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Category Analytics</h2>
              </div>
              <CategoryBarChart
                selectedUsers={selectedUsers}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedApp={selectedApp}
              />
            </div>

            {/* Multi Pie Charts */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white text-sm">
                  🥧
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Distribution Analysis</h2>
              </div>
              <MultiPieCharts
                selectedUsers={selectedUsers}
                selectedCategory={selectedCategory}
                selectedApp={selectedApp}
              />
            </div>
          </div>

          {/* User Click Logs */}
          {isUserFilterActive && (
            <UserClickLog selectedUserIds={selectedUsers} selectedApp={selectedApp} />
          )}

          {/* Footer */}
          <div className="text-center py-8 text-gray-500 text-sm">
            <p>© 2024 User Analytics Dashboard - Real-time insights powered by modern technology</p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
