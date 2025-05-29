import { useState } from 'react';
import UserListPanel from './components/UserListPanel';
import UserClickLog from './components/UserClickLog';
import CategoryBarChart from './components/CategoryBarChart';
import MultiPieCharts from './components/MultiPieCharts';

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  const isUserFilterActive = selectedUsers.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100/20 to-purple-100/20"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      <div className="relative grid grid-cols-1 lg:grid-cols-[320px_1fr] min-h-screen">
        {/* Sidebar */}
        <aside className="lg:sticky lg:top-0 lg:h-screen">
          <UserListPanel
            selectUserIds={selectedUsers}
            onUserSelect={setSelectedUsers}
            refreshTrigger={refreshTrigger}
          />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8 space-y-8 overflow-y-auto">
          {/* Header */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-4">
              User Analytics Dashboard
            </h1>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto lg:mx-0 mb-6"></div>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto lg:mx-0">
              Comprehensive insights into user behavior and engagement patterns
            </p>
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
              />
            </div>
          </div>

          {/* User Click Logs */}
          {isUserFilterActive && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-gray-200 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center text-white text-sm">
                  📋
                </div>
                <h2 className="text-2xl font-bold text-gray-800">User Activity Logs</h2>
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                  {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} selected
                </span>
              </div>
              <div className="space-y-6">
                {selectedUsers.map(userId => (
                  <UserClickLog key={userId} userId={userId} />
                ))}
              </div>
            </div>
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
