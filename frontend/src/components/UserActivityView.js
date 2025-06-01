import React, { useState, useEffect } from 'react';
import TimeRangeFilter from './TimeRangeFilter';
import TimeRangeUtils from '../utils/TimeRangeUtils';

const UserActivityView = () => {
  const [selectedUser, setSelectedUser] = useState('');
  const [userActions, setUserActions] = useState([]);
  const [screenTimes, setScreenTimes] = useState([]);
  const [screenSummary, setScreenSummary] = useState(null);
  const [users, setUsers] = useState([]);
  const [timeRange, setTimeRange] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // טעינת רשימת משתמשים
  useEffect(() => {
    fetchUsers();
  }, []);

  // טעינת נתוני פעילות כשמשתמש או טווח זמן משתנים
  useEffect(() => {
    if (selectedUser) {
      fetchUserActivity();
    }
  }, [selectedUser, timeRange]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:8080/user-actions/users');
      if (response.ok) {
        const usersData = await response.json();
        setUsers(usersData);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchUserActivity = async () => {
    if (!selectedUser) return;

    setLoading(true);
    setError(null);

    try {
      // בניית URL עם פרמטרי זמן
      const params = new URLSearchParams();
      TimeRangeUtils.addTimeRangeToParams(params, timeRange);

      // טעינת פעולות משתמש
      const actionsResponse = await fetch(
        `http://localhost:8080/user-actions/user-activity/${selectedUser}?${params.toString()}`
      );
      
      // טעינת זמני מסך מה-collection החדש
      const screenTimeResponse = await fetch(
        `http://localhost:8080/screen-time/user-screen-time/${selectedUser}?${params.toString()}`
      );

      // טעינת סיכום זמני מסך לפי קטגוריות
      const summaryResponse = await fetch(
        `http://localhost:8080/screen-time/user-screen-summary/${selectedUser}?${params.toString()}`
      );

      if (actionsResponse.ok && screenTimeResponse.ok && summaryResponse.ok) {
        const actionsData = await actionsResponse.json();
        const screenTimeData = await screenTimeResponse.json();
        const summaryData = await summaryResponse.json();

        setUserActions(actionsData);
        setScreenTimes(screenTimeData);
        setScreenSummary(summaryData);
      } else {
        setError('שגיאה בטעינת נתוני הפעילות');
      }
    } catch (error) {
      console.error('Error fetching user activity:', error);
      setError('שגיאה בחיבור לשרת');
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (actionName) => {
    switch (actionName) {
      case 'click_category':
        return '🖱️';
      case 'screen_view':
        return '📱';
      case 'screen_duration':
        return '⏱️';
      default:
        return '📅';
    }
  };

  const getActionColor = (actionName) => {
    switch (actionName) {
      case 'click_category':
        return 'bg-blue-100 text-blue-800';
      case 'screen_view':
        return 'bg-green-100 text-green-800';
      case 'screen_duration':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'ספורט':
        return '⚽';
      case 'טכנולוגיה':
        return '💻';
      case 'בידור':
        return '🎬';
      case 'חדשות':
        return '📰';
      case 'דף ראשי':
        return '🏠';
      default:
        return '📂';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200 shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <h3 className="flex items-center gap-2 text-xl font-bold text-gray-800">
            🕒 פעילות משתמש מפורטת
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            צפייה בפעולות ולחיצות של המשתמש עם זמנים קריאים ומשך זמן במסכים
          </p>
        </div>
        <div className="p-6">
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2 text-gray-700">בחר משתמש:</label>
              <select 
                value={selectedUser} 
                onChange={(e) => setSelectedUser(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="">בחר משתמש...</option>
                {users.map(user => (
                  <option key={user} value={user}>
                    {user}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2 text-gray-700">טווח זמן:</label>
              <TimeRangeFilter 
                timeRange={timeRange} 
                setTimeRange={setTimeRange}
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {loading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">טוען נתונים...</p>
            </div>
          )}

          {!loading && selectedUser && (
            <div className="space-y-6">
              {/* סיכום זמני מסך לפי קטגוריות */}
              {screenSummary && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-gray-200 shadow-lg">
                  <div className="p-6 border-b border-gray-200">
                    <h4 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                      📊 סיכום זמני מסך לפי קטגוריות
                    </h4>
                    <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
                      <span>⏱️ סה"כ זמן: <strong>{screenSummary.totalTimeFormatted}</strong></span>
                      <span>📱 סה"כ מסכים: <strong>{screenSummary.totalScreens}</strong></span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {screenSummary.categories && screenSummary.categories.map((category, index) => (
                        <div key={index} className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-3">
                            <h5 className="font-semibold text-gray-800 flex items-center gap-2">
                              {getCategoryIcon(category.category)}
                              {category.category}
                            </h5>
                            <span className="text-sm font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                              {category.percentage}%
                            </span>
                          </div>

                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">זמן כולל:</span>
                              <span className="font-medium text-blue-600">{category.durationFormatted}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">ביקורים:</span>
                              <span className="font-medium">{category.visits}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">ממוצע לביקור:</span>
                              <span className="font-medium text-green-600">{category.averageTimePerVisit}</span>
                            </div>
                          </div>

                          {/* פס התקדמות */}
                          <div className="mt-3">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${category.percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* פעולות משתמש */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-lg">
                <div className="p-4 border-b border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-800">פעולות ולחיצות</h4>
                  <p className="text-sm text-gray-600">
                    {userActions.length} פעולות נמצאו
                  </p>
                </div>
                <div className="p-4">
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {userActions.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">אין פעולות להצגה</p>
                    ) : (
                      userActions.map((action, index) => (
                        <div key={action.id || index} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{getActionIcon(action.actionName)}</span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActionColor(action.actionName)}`}>
                                {action.actionName}
                              </span>
                            </div>
                            <span className="text-sm text-gray-500">
                              {action.timestamp}
                            </span>
                          </div>
                          
                          {action.duration && (
                            <div className="text-sm text-blue-600 mb-1">
                              ⏱️ משך זמן: {action.duration}
                            </div>
                          )}
                          
                          {action.properties && Object.keys(action.properties).length > 0 && (
                            <div className="text-sm text-gray-600">
                              {Object.entries(action.properties).map(([key, value]) => (
                                <span key={key} className="mr-3">
                                  <strong>{key}:</strong> {value}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* זמני מסך */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-lg">
                <div className="p-4 border-b border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-800">זמן במסכים</h4>
                  <p className="text-sm text-gray-600">
                    {screenTimes.length} רשומות זמן מסך נמצאו
                  </p>
                </div>
                <div className="p-4">
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {screenTimes.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">אין נתוני זמן מסך להצגה</p>
                    ) : (
                      screenTimes.map((screenTime, index) => (
                        <div key={screenTime.id || index} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">📱</span>
                              <span className="font-medium">{screenTime.screenName}</span>
                            </div>
                            <span className="text-sm text-gray-500">
                              {screenTime.timestamp}
                            </span>
                          </div>
                          
                          <div className="text-sm space-y-1">
                            <div className="text-blue-600 font-medium">
                              ⏱️ זמן שהייה: {screenTime.duration}
                            </div>
                            
                            {screenTime.startTime && (
                              <div className="text-gray-600">
                                🟢 התחלה: {screenTime.startTime}
                              </div>
                            )}
                            
                            {screenTime.endTime && (
                              <div className="text-gray-600">
                                🔴 סיום: {screenTime.endTime}
                              </div>
                            )}

                            {screenTime.sessionId && (
                              <div className="text-xs text-gray-500">
                                🔗 סשן: {screenTime.sessionId}
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
              </div>
            </div>
          )}

          {!loading && !selectedUser && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">👤</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">בחר משתמש לצפייה בפעילות</h3>
              <p className="text-gray-600">
                בחר משתמש מהרשימה למעלה כדי לראות את הפעילות המפורטת שלו
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserActivityView;
