
import React, { useEffect, useState } from "react";

function UserListPanel({ onUserSelect, selectUserIds = [], refreshTrigger, selectedApp }) {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!selectedApp || !selectedApp.apiKey) {
      setUsers([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    // שליחת בקשה עם API Key של האפליקציה הנבחרת
    fetch(`http://localhost:8080/track/stats/all-users?apiKey=${selectedApp.apiKey}`)
      .then(res => res.json())
      .then(data => {
        setUsers(Array.isArray(data) ? data : []);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Error fetching users:", err);
        setUsers([]);
        setIsLoading(false);
      });
  }, [refreshTrigger, selectedApp]);

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
    setSearchTerm('');
  };

  const filteredUsers = users.filter(user => {
    const fullName = `${user.firstName} ${user.lastName} ${user.email}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  const selectedCount = selectUserIds.length;

  return (
    <div className="h-full flex flex-col bg-white/80 backdrop-blur-sm border-r border-gray-200 shadow-lg">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
          <span className="text-2xl">👥</span>
          Users
          {selectedCount > 0 && (
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-semibold px-3 py-1 rounded-full min-w-[24px] h-6 flex items-center justify-center animate-pulse-slow shadow-lg">
              {selectedCount}
            </span>
          )}
        </h2>
      </div>

      {/* Search Input */}
      <div className="p-4 border-b border-gray-100">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400 text-sm">🔍</span>
          </div>
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white/70 backdrop-blur-sm text-sm font-medium placeholder-gray-400"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            >
              <span className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center text-xs hover:bg-gray-300 transition-colors">
                ✕
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Clear Filter Button */}
      <div className="p-4 border-b border-gray-100">
        <button
          onClick={handleClearFilter}
          className={`w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${selectUserIds.length === 0
            ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 text-blue-700 shadow-sm'
            : 'bg-white border-2 border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50'
            } transform hover:scale-[1.02] active:scale-[0.98]`}
        >
          <span className="text-base">🔄</span>
          Show All Users
        </button>
      </div>

      {/* Users List */}
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
            <span className="text-sm font-medium">Loading users...</span>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <span className="text-4xl mb-4 opacity-50">👤</span>
            <p className="text-sm font-medium mb-4">No users found</p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg text-xs font-semibold hover:bg-blue-200 transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <ul className="space-y-2">
            {filteredUsers.map(user => (
              <li key={user.id} className="animate-fade-in">
                <button
                  onClick={() => handleToggleUser(user.id)}
                  className={`w-full p-4 rounded-xl transition-all duration-200 flex items-center gap-4 text-left group relative overflow-hidden ${isSelected(user.id)
                    ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-300 shadow-md transform scale-[1.02]'
                    : 'bg-white/70 border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:shadow-md hover:transform hover:scale-[1.01]'
                    }`}
                >
                  {/* Animated background effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-400/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>

                  {/* User Avatar */}
                  <div className={`relative w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md ${isSelected(user.id)
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                    : 'bg-gradient-to-r from-gray-400 to-gray-500'
                    }`}>
                    {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0 relative z-10">
                    <div className={`font-semibold text-sm truncate ${isSelected(user.id) ? 'text-blue-800' : 'text-gray-800'
                      }`}>
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {user.email}
                    </div>
                  </div>

                  {/* Selected Indicator */}
                  {isSelected(user.id) && (
                    <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md animate-bounce-subtle">
                      ✓
                    </div>
                  )}

                  {/* Selection border effect */}
                  {isSelected(user.id) && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-r"></div>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer Stats */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/80 backdrop-blur-sm">
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-2">
            <span className="text-gray-500 font-medium">Total Users:</span>
            <span className="font-bold text-gray-700 bg-white px-2 py-1 rounded-md shadow-sm">
              {users.length}
            </span>
          </div>
          {selectedCount > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-gray-500 font-medium">Selected:</span>
              <span className="font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-md shadow-sm">
                {selectedCount}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserListPanel;

