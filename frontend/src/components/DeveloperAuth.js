import React, { useState } from 'react';
import { buildApiUrl, API_ENDPOINTS } from '../config/api';

function DeveloperAuth({ onAuthSuccess }) {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Login form state
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });

    // Register form state
    const [registerData, setRegisterData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        companyName: ''
    });

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch(
                buildApiUrl(API_ENDPOINTS.DEVELOPER_LOGIN),
                {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: loginData.email,
                    password: loginData.password
                })
            });

            const data = await response.json();

            if (response.ok) {
                // שמירת הטוקן ופרטי המפתח
                localStorage.setItem('developerToken', data.token);
                localStorage.setItem('developerData', JSON.stringify(data.developer));
                localStorage.setItem('apiKey', data.apiKey);
                
                setSuccess('התחברות מוצלחת!');
                setTimeout(() => {
                    onAuthSuccess(data.developer, data.apiKey);
                }, 1000);
            } else {
                setError(data.error || 'שגיאה בהתחברות');
            }
        } catch (err) {
            setError('שגיאת רשת. אנא נסה שוב.');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // בדיקת סיסמאות
        if (registerData.password !== registerData.confirmPassword) {
            setError('הסיסמאות אינן תואמות');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(
                buildApiUrl(API_ENDPOINTS.DEVELOPER_REGISTER),
                {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName: registerData.firstName,
                    lastName: registerData.lastName,
                    email: registerData.email,
                    password: registerData.password,
                    companyName: registerData.companyName
                })
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('רישום מוצלח! כעת תוכל להתחבר עם הפרטים שלך');
                setTimeout(() => {
                    setIsLogin(true);
                    setRegisterData({
                        firstName: '',
                        lastName: '',
                        email: '',
                        password: '',
                        confirmPassword: '',
                        companyName: ''
                    });
                }, 2000);
            } else {
                setError(data.error || 'שגיאה ברישום');
            }
        } catch (err) {
            setError('שגיאת רשת. אנא נסה שוב.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <span className="text-2xl text-white">🔧</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Developer Portal</h1>
                    <p className="text-gray-600">גישה לנתוני האנליטיקס שלך</p>
                </div>

                {/* Auth Card */}
                <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                    {/* Toggle Buttons */}
                    <div className="flex bg-gray-100 rounded-2xl p-1 mb-6">
                        <button
                            onClick={() => {
                                setIsLogin(true);
                                setError('');
                                setSuccess('');
                            }}
                            className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                                isLogin
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-800'
                            }`}
                        >
                            התחברות
                        </button>
                        <button
                            onClick={() => {
                                setIsLogin(false);
                                setError('');
                                setSuccess('');
                            }}
                            className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                                !isLogin
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-800'
                            }`}
                        >
                            הרשמה
                        </button>
                    </div>

                    {/* Error/Success Messages */}
                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
                            {success}
                        </div>
                    )}

                    {/* Login Form */}
                    {isLogin ? (
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    אימייל
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={loginData.email}
                                    onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    placeholder="developer@company.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    סיסמה
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={loginData.password}
                                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    placeholder="••••••••"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'מתחבר...' : 'התחבר'}
                            </button>
                        </form>
                    ) : (
                        /* Register Form */
                        <form onSubmit={handleRegister} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        שם פרטי
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={registerData.firstName}
                                        onChange={(e) => setRegisterData({...registerData, firstName: e.target.value})}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        placeholder="יוחנן"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        שם משפחה
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={registerData.lastName}
                                        onChange={(e) => setRegisterData({...registerData, lastName: e.target.value})}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        placeholder="כהן"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    אימייל
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={registerData.email}
                                    onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    placeholder="developer@company.com"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        סיסמה
                                    </label>
                                    <input
                                        type="password"
                                        required
                                        value={registerData.password}
                                        onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        placeholder="••••••••"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        אימות סיסמה
                                    </label>
                                    <input
                                        type="password"
                                        required
                                        value={registerData.confirmPassword}
                                        onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:from-green-700 hover:to-blue-700 focus:ring-4 focus:ring-green-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'נרשם...' : 'הירשם'}
                            </button>
                        </form>
                    )}
                </div>

                {/* Footer */}
                <div className="text-center mt-6 text-sm text-gray-500">
                    <p>Analytics SDK Developer Portal</p>
                    <p>גישה מאובטחת לנתוני האנליטיקס שלך</p>
                </div>
            </div>
        </div>
    );
}

export default DeveloperAuth;
