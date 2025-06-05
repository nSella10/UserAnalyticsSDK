import React, { useState } from 'react';

const SDKIntegrationCode = ({ app, onClose }) => {
  const [copied, setCopied] = useState(false);

  const integrationCode = `// הוסף את הקוד הזה לקובץ MainActivity.java שלך

import com.analytics.analyticstracker.AnalyticsTracker;
import java.util.HashMap;
import java.util.Map;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // אתחול ה-SDK עם URL השרת וה-API Key שלך
        AnalyticsTracker.init(Config.BASE_URL, Config.API_KEY);

        // דוגמה לשליחת אירוע
        Map<String, Object> properties = new HashMap<>();
        properties.put("screen", "MainActivity");
        AnalyticsTracker.trackEvent("user123", "app_opened", properties);
    }

    @Override
    protected void onResume() {
        super.onResume();
        // התחלת מדידת זמן מסך
        AnalyticsTracker.startScreen("MainActivity");
    }

    @Override
    protected void onPause() {
        super.onPause();
        // סיום מדידת זמן מסך
        String userId = "user123"; // החלף ב-ID של המשתמש הנוכחי
        AnalyticsTracker.endScreen(userId);
    }
}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(integrationCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">קוד אינטגרציה ל-SDK</h2>
              <p className="text-gray-600 mt-1">אפליקציה: {app.appName}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* How it works */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-green-900 mb-3">איך זה עובד?</h3>
            <div className="text-sm text-green-800 space-y-2">
              <p>🔑 <strong>ה-API Key הייחודי שלך</strong> מזהה את האפליקציה שלך ומבדיל אותה מאפליקציות אחרות</p>
              <p>📊 <strong>כל הנתונים שנשלחים</strong> מהאפליקציה שלך יכללו את ה-API Key הזה</p>
              <p>🎯 <strong>בדשבורד תראה רק</strong> נתונים מהאפליקציה שלך - לא מאפליקציות אחרות</p>
              <p>⚡ <strong>הנתונים מופיעים</strong> בזמן אמת תוך מספר שניות</p>
            </div>
          </div>

          {/* App Details */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">פרטי האפליקציה</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-blue-800">שם האפליקציה:</span>
                <span className="text-blue-700 mr-2">{app.appName}</span>
              </div>
              <div>
                <span className="font-medium text-blue-800">API Key:</span>
                <span className="text-blue-700 mr-2 font-mono">{app.apiKey}</span>
              </div>
              <div>
                <span className="font-medium text-blue-800">תאריך יצירה:</span>
                <span className="text-blue-700 mr-2">
                  {new Date(app.createdAt).toLocaleDateString('he-IL')}
                </span>
              </div>
              <div>
                <span className="font-medium text-blue-800">סטטוס:</span>
                <span className="text-green-600 mr-2">פעיל</span>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">הוראות אינטגרציה</h3>
            <div className="space-y-3 text-gray-700">
              <div className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</span>
                <p>וודא שה-SDK מותקן בפרויקט האנדרואיד שלך</p>
              </div>
              <div className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</span>
                <p>הגדר את הקובץ local.properties עם BASE_URL ו-API_KEY שלך</p>
              </div>
              <div className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</span>
                <p>העתק את הקוד למטה והדבק אותו ב-MainActivity שלך</p>
              </div>
              <div className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">4</span>
                <p>החלף את "user123" ב-ID ייחודי של המשתמש (למשל מהמערכת שלך)</p>
              </div>
              <div className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">5</span>
                <p>הרץ את האפליקציה ובדוק שהנתונים מגיעים לדשבורד</p>
              </div>
            </div>
          </div>

          {/* Configuration Section */}
          <div className="mb-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-purple-900 mb-3">הגדרת קובץ local.properties</h3>
            <p className="text-purple-800 mb-3">צור או ערוך את הקובץ <code className="bg-purple-100 px-2 py-1 rounded">local.properties</code> בשורש הפרויקט:</p>
            <div className="bg-purple-900 text-purple-100 p-3 rounded font-mono text-sm">
              <div># Android SDK path (יתעדכן אוטומטית)</div>
              <div>sdk.dir=YOUR_ANDROID_SDK_PATH</div>
              <div className="mt-2"># ===== נתונים רגישים - לא לעלות ל-Git =====</div>
              <div># כתובת השרת (עדכן לפי הסביבה שלך)</div>
              <div>BASE_URL=http://YOUR_SERVER_IP:8080/</div>
              <div className="mt-1"># API Key של האפליקציה</div>
              <div>API_KEY={app.apiKey}</div>
            </div>
            <p className="text-purple-700 text-sm mt-2">
              💡 הקובץ הזה לא יעלה ל-Git ושומר על הנתונים הרגישים שלך בבטחה
            </p>
          </div>

          {/* Code Block */}
          <div className="relative">
            <div className="flex items-center justify-between bg-gray-800 text-white px-4 py-2 rounded-t-lg">
              <span className="text-sm font-medium">MainActivity.java</span>
              <button
                onClick={copyToClipboard}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${copied
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-600 hover:bg-gray-500 text-white'
                  }`}
              >
                {copied ? '✓ הועתק!' : 'העתק קוד'}
              </button>
            </div>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-b-lg overflow-x-auto text-sm leading-relaxed">
              <code>{integrationCode}</code>
            </pre>
          </div>

          {/* Additional Notes */}
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 mb-2">הערות חשובות:</h4>
            <ul className="text-yellow-700 text-sm space-y-1">
              <li>• הגדר את הקובץ local.properties עם BASE_URL ו-API_KEY שלך</li>
              <li>• ה-API Key וכתובת השרת נשמרים בקובץ local.properties ולא עולים ל-Git</li>
              <li>• כל משתמש צריך לקבל ID ייחודי עקבי (למשל מהמערכת שלך)</li>
              <li>• ה-API Key מזהה את האפליקציה שלך ומבדיל אותה מאפליקציות אחרות</li>
              <li>• ה-SDK ישלח אוטומטית נתונים לשרת עם ה-API Key שלך</li>
              <li>• הנתונים יופיעו בדשבורד תוך מספר שניות ויהיו מסוננים לפי האפליקציה שלך</li>
              <li>• רק נתונים מהאפליקציה שלך יופיעו בדשבורד - לא נתונים מאפליקציות אחרות</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <div className="flex justify-end space-x-3 space-x-reverse">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              סגור
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SDKIntegrationCode;
