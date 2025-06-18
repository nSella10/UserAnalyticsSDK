import React, { useState } from 'react';

const SDKIntegrationCode = ({ app, onClose }) => {
  const [copied, setCopied] = useState(false);

  const integrationCode = `import com.analytics.analyticstracker.AnalyticsTracker;
import java.util.HashMap;
import java.util.Map;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // אתחול ה-SDK
        AnalyticsTracker.init("https://d1xb34m3k0zeus.cloudfront.net/", "${app.apiKey}");

        // דוגמה לשליחת אירוע
        Map<String, Object> properties = new HashMap<>();
        properties.put("screen", "MainActivity");
        AnalyticsTracker.trackEvent("user123", "app_opened", properties);
    }

    @Override
    protected void onResume() {
        super.onResume();
        AnalyticsTracker.startScreen("MainActivity");
    }

    @Override
    protected void onPause() {
        super.onPause();
        AnalyticsTracker.endScreen("user123"); // החלף ב-ID של המשתמש שלך
    }
}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(integrationCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" dir="rtl">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-right">
              <h2 className="text-2xl font-bold text-gray-900">קוד אינטגרציה ל-SDK</h2>
              <p className="text-gray-600 mt-1">אפליקציה: {app.appName}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 text-right">
          {/* App Details */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2 text-right">פרטי האפליקציה</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="text-right">
                <span className="font-medium text-blue-800">שם האפליקציה:</span>
                <span className="text-blue-700 ml-2">{app.appName}</span>
              </div>
              <div className="text-right">
                <span className="font-medium text-blue-800">API Key:</span>
                <span className="text-blue-700 ml-2 font-mono">{app.apiKey}</span>
              </div>
            </div>
          </div>

          {/* Installation Instructions Link */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-yellow-800 mb-2 text-right">לפני השימוש</h3>
            <p className="text-yellow-700 text-sm text-right">
              עקוב אחר הוראות ההתקנה המלאות ב-GitHub:
              <a href="https://github.com/nSella10/UserAnalyticsSDK#installation"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline mr-1">
                הוראות התקנה
              </a>
            </p>
          </div>

          {/* Code */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900 text-right">קוד לשימוש</h3>
              <button
                onClick={copyToClipboard}
                className={`px-4 py-2 rounded-lg transition-colors ${copied
                    ? 'bg-green-500 text-white'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
              >
                {copied ? 'הועתק!' : 'העתק קוד'}
              </button>
            </div>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm text-left">
              <code>{integrationCode}</code>
            </pre>
          </div>

          {/* Quick Note */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 text-sm text-right">
              💡 <strong>הערה:</strong> החלף את "user123" ב-ID ייחודי של המשתמש שלך
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <div className="flex justify-between">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              סגור
            </button>
            <a
              href="https://github.com/nSella10/UserAnalyticsSDK"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              תיעוד מלא ב-GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SDKIntegrationCode;