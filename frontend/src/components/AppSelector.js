// import React, { useState, useEffect } from 'react';
// import SDKIntegrationCode from './SDKIntegrationCode';

// const AppSelector = ({ developer, onAppSelected, onCreateApp, onLogout }) => {
//   const [apps, setApps] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [showCreateForm, setShowCreateForm] = useState(false);
//   const [newApp, setNewApp] = useState({
//     appName: '',
//     description: ''
//   });
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [showSDKCode, setShowSDKCode] = useState(false);
//   const [selectedAppForSDK, setSelectedAppForSDK] = useState(null);

//   useEffect(() => {
//     fetchApps();
//   }, [developer]);

//   const fetchApps = async () => {
//     try {
//       setIsLoading(true);
//       const response = await fetch(`http://localhost:8080/apps/my-apps?developerEmail=${developer.email}`);

//       if (response.ok) {
//         const data = await response.json();
//         setApps(data);
//       } else {
//         setError('שגיאה בטעינת האפליקציות');
//       }
//     } catch (err) {
//       setError('שגיאה בחיבור לשרת');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleCreateApp = async (e) => {
//     e.preventDefault();
//     setError('');
//     setSuccess('');

//     if (!newApp.appName.trim()) {
//       setError('שם האפליקציה הוא שדה חובה');
//       return;
//     }

//     try {
//       const response = await fetch('http://localhost:8080/apps/create', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           appName: newApp.appName,
//           description: newApp.description,
//           developerEmail: developer.email
//         }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setSuccess('אפליקציה נוצרה בהצלחה!');
//         setNewApp({ appName: '', description: '' });
//         setShowCreateForm(false);

//         // הצגת קוד ה-SDK לאפליקציה החדשה
//         setSelectedAppForSDK(data.app);
//         setShowSDKCode(true);

//         fetchApps(); // רענון רשימת האפליקציות
//       } else {
//         setError(data.error || 'שגיאה ביצירת האפליקציה');
//       }
//     } catch (err) {
//       setError('שגיאה בחיבור לשרת');
//     }
//   };

//   const handleSelectApp = (app) => {
//     onAppSelected(app);
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
//           <p className="mt-4 text-gray-600">טוען אפליקציות...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-4xl mx-auto px-4">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-8">
//           <div className="text-center flex-1">
//             <h1 className="text-3xl font-bold text-gray-900 mb-2">האפליקציות שלי</h1>
//             <p className="text-gray-600">ברוך הבא, {developer.firstName} {developer.lastName}</p>
//             <p className="text-sm text-gray-500">{developer.companyName}</p>
//           </div>

//           {/* Logout Button */}
//           <div className="flex-shrink-0">
//             <button
//               onClick={onLogout}
//               className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors font-medium flex items-center gap-2"
//             >
//               <span>🚪</span>
//               התנתק
//             </button>
//           </div>
//         </div>

//         {/* Messages */}
//         {error && (
//           <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
//             {error}
//           </div>
//         )}
//         {success && (
//           <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
//             {success}
//           </div>
//         )}

//         {/* Apps Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
//           {apps.map((app) => (
//             <div key={app.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
//               <div className="flex items-center mb-4">
//                 <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
//                   {app.appName.charAt(0).toUpperCase()}
//                 </div>
//                 <div className="mr-4">
//                   <h3 className="text-lg font-semibold text-gray-900">{app.appName}</h3>
//                   <p className="text-sm text-gray-500">נוצר: {new Date(app.createdAt).toLocaleDateString('he-IL')}</p>
//                 </div>
//               </div>

//               {app.description && (
//                 <p className="text-gray-600 mb-4 text-sm">{app.description}</p>
//               )}

//               <div className="flex justify-between items-center">
//                 <span className="text-sm text-gray-500">
//                   {/* כאן נוסיף מספר משתמשים בעתיד */}
//                   0 משתמשים
//                 </span>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => {
//                       setSelectedAppForSDK(app);
//                       setShowSDKCode(true);
//                     }}
//                     className="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
//                   >
//                     קוד SDK
//                   </button>
//                   <button
//                     onClick={() => handleSelectApp(app)}
//                     className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
//                   >
//                     צפה בנתונים
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}

//           {/* Create New App Card */}
//           <div className="bg-white rounded-lg shadow-md p-6 border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
//             <div className="text-center">
//               <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-2xl mx-auto mb-4">
//                 +
//               </div>
//               <h3 className="text-lg font-semibold text-gray-700 mb-2">אפליקציה חדשה</h3>
//               <p className="text-gray-500 text-sm mb-4">צור אפליקציה חדשה ותתחיל לעקוב אחר המשתמשים</p>
//               <button
//                 onClick={() => setShowCreateForm(true)}
//                 className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
//               >
//                 צור אפליקציה
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Empty State */}
//         {apps.length === 0 && (
//           <div className="text-center py-12">
//             <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 text-4xl mx-auto mb-4">
//               📱
//             </div>
//             <h3 className="text-xl font-semibold text-gray-700 mb-2">אין לך אפליקציות עדיין</h3>
//             <p className="text-gray-500 mb-6">צור את האפליקציה הראשונה שלך ותתחיל לעקוב אחר המשתמשים</p>
//             <button
//               onClick={() => setShowCreateForm(true)}
//               className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
//             >
//               צור אפליקציה ראשונה
//             </button>
//           </div>
//         )}

//         {/* Create App Modal */}
//         {showCreateForm && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
//               <h3 className="text-lg font-semibold mb-4">צור אפליקציה חדשה</h3>

//               <form onSubmit={handleCreateApp}>
//                 <div className="mb-4">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     שם האפליקציה *
//                   </label>
//                   <input
//                     type="text"
//                     value={newApp.appName}
//                     onChange={(e) => setNewApp({ ...newApp, appName: e.target.value })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     placeholder="לדוגמה: MyGame"
//                     required
//                   />
//                 </div>

//                 <div className="mb-6">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     תיאור (אופציונלי)
//                   </label>
//                   <textarea
//                     value={newApp.description}
//                     onChange={(e) => setNewApp({ ...newApp, description: e.target.value })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     placeholder="תיאור קצר של האפליקציה..."
//                     rows="3"
//                   />
//                 </div>

//                 <div className="flex justify-end space-x-3 space-x-reverse">
//                   <button
//                     type="button"
//                     onClick={() => setShowCreateForm(false)}
//                     className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//                   >
//                     ביטול
//                   </button>
//                   <button
//                     type="submit"
//                     className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
//                   >
//                     צור אפליקציה
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}

//         {/* SDK Integration Code Modal */}
//         {showSDKCode && selectedAppForSDK && (
//           <SDKIntegrationCode
//             app={selectedAppForSDK}
//             onClose={() => {
//               setShowSDKCode(false);
//               setSelectedAppForSDK(null);
//             }}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default AppSelector;


import React, { useState, useEffect } from 'react';
import { buildApiUrl, API_ENDPOINTS, authenticatedFetch } from '../config/api';
import SDKIntegrationCode from './SDKIntegrationCode';

const AppSelector = ({ developer, onAppSelected, onCreateApp, onLogout }) => {
  const [apps, setApps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newApp, setNewApp] = useState({
    appName: '',
    description: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showSDKCode, setShowSDKCode] = useState(false);
  const [selectedAppForSDK, setSelectedAppForSDK] = useState(null);

  useEffect(() => {
    if (developer && developer.email) {
      fetchApps();
    }
  }, [developer]);

  const fetchApps = async () => {
    try {
      setIsLoading(true);
      const url = buildApiUrl(API_ENDPOINTS.APPS_MY_APPS, {
        developerEmail: developer.email
      });

      console.log('🔄 Fetching apps for developer:', developer.email);
      const response = await authenticatedFetch(url);

      if (response.ok) {
        const data = await response.json();
        console.log('📱 Apps loaded:', data);
        setApps(data);
        setError('');
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.message || 'Error loading apps');
      }
    } catch (err) {
      console.error('❌ Error fetching apps:', err);
      setError('Error connecting to the server');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateApp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!newApp.appName.trim()) {
      setError('Application name is a required field');
      return;
    }

    try {
      const url = buildApiUrl(API_ENDPOINTS.APPS_CREATE);

      console.log('🔄 Creating new app:', newApp.appName);
      const response = await authenticatedFetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appName: newApp.appName,
          description: newApp.description,
          developerEmail: developer.email
        })
      });

      const data = await response.json();

      if (response.ok) {
        console.log('✅ App created successfully:', data);
        setSuccess('Application created successfully!');
        setNewApp({ appName: '', description: '' });
        setShowCreateForm(false);

        // הצגת קוד ה-SDK לאפליקציה החדשה
        setSelectedAppForSDK(data.app);
        setShowSDKCode(true);

        fetchApps(); // רענון רשימת האפליקציות
      } else {
        console.error('❌ Error creating app:', data);
        setError(data.error || 'Error creating the app');
      }
    } catch (err) {
      console.error('❌ Error creating app:', err);
      setError('Error connecting to the server');
    }
  };


  const handleSelectApp = (app) => {
    onAppSelected(app);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">טוען אפליקציות...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">האפליקציות שלי</h1>
            <p className="text-gray-600">ברוך הבא, {developer.firstName} {developer.lastName}</p>
            <p className="text-sm text-gray-500">{developer.companyName}</p>
          </div>

          {/* Logout Button */}
          <div className="flex-shrink-0">
            <button
              onClick={onLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors font-medium flex items-center gap-2"
            >
              <span>🚪</span>
              התנתק
            </button>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {success}
          </div>
        )}

        {/* Apps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {apps.map((app) => (
            <div key={app.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                  {app.appName.charAt(0).toUpperCase()}
                </div>
                <div className="mr-4">
                  <h3 className="text-lg font-semibold text-gray-900">{app.appName}</h3>
                  <p className="text-sm text-gray-500">נוצר: {new Date(app.createdAt).toLocaleDateString('he-IL')}</p>
                </div>
              </div>

              {app.description && (
                <p className="text-gray-600 mb-4 text-sm">{app.description}</p>
              )}

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {/* כאן נוסיף מספר משתמשים בעתיד */}
                  0 משתמשים
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedAppForSDK(app);
                      setShowSDKCode(true);
                    }}
                    className="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                  >
                    קוד SDK
                  </button>
                  <button
                    onClick={() => handleSelectApp(app)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                  >
                    צפה בנתונים
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Create New App Card */}
          <div className="bg-white rounded-lg shadow-md p-6 border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-2xl mx-auto mb-4">
                +
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">אפליקציה חדשה</h3>
              <p className="text-gray-500 text-sm mb-4">צור אפליקציה חדשה ותתחיל לעקוב אחר המשתמשים</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
              >
                צור אפליקציה
              </button>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {apps.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 text-4xl mx-auto mb-4">
              📱
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">אין לך אפליקציות עדיין</h3>
            <p className="text-gray-500 mb-6">צור את האפליקציה הראשונה שלך ותתחיל לעקוב אחר המשתמשים</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              צור אפליקציה ראשונה
            </button>
          </div>
        )}

        {/* Create App Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold mb-4">צור אפליקציה חדשה</h3>

              <form onSubmit={handleCreateApp}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    שם האפליקציה *
                  </label>
                  <input
                    type="text"
                    value={newApp.appName}
                    onChange={(e) => setNewApp({ ...newApp, appName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="לדוגמה: MyGame"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    תיאור (אופציונלי)
                  </label>
                  <textarea
                    value={newApp.description}
                    onChange={(e) => setNewApp({ ...newApp, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="תיאור קצר של האפליקציה..."
                    rows="3"
                  />
                </div>

                <div className="flex justify-end space-x-3 space-x-reverse">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    ביטול
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    צור אפליקציה
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* SDK Integration Code Modal */}
        {showSDKCode && selectedAppForSDK && (
          <SDKIntegrationCode
            app={selectedAppForSDK}
            onClose={() => {
              setShowSDKCode(false);
              setSelectedAppForSDK(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default AppSelector;
