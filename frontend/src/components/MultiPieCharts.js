import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import TimeRangeFilter from './TimeRangeFilter';
import TimeRangeUtils from '../utils/TimeRangeUtils';

const COLORS = [
    '#3B82F6', '#8B5CF6', '#10B981', '#F59E0B',
    '#EF4444', '#06B6D4', '#84CC16', '#F97316'
];

// Loading Indicator Component
const LoadingIndicator = () => (
    <div className="flex justify-center items-center h-64">
        <div className="text-center">
            <div className="relative">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mb-4 mx-auto"></div>
                <div className="absolute inset-0 w-12 h-12 border-4 border-purple-200 border-b-purple-500 rounded-full animate-spin mb-4 mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            </div>
            <div className="text-gray-600 font-medium animate-pulse">Loading data...</div>
            <div className="mt-2 flex justify-center space-x-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
        </div>
    </div>
);

function MultiPieCharts({ selectedUsers, selectedApp }) {
    const [categoryData, setCategoryData] = useState([]);
    const [subcategoryData, setSubcategoryData] = useState([]);
    const [itemData, setItemData] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [totals, setTotals] = useState({ category: 0, subcategory: 0, item: 0 });
    const [usersMap, setUsersMap] = useState({});
    const [loading, setLoading] = useState({ category: false, subcategory: false, item: false });
    const [timeRange, setTimeRange] = useState('all'); // 'all', 'day', 'week', 'month'

    // פונקציה לחישוב סך הכל
    const calculateTotal = (data) => data.reduce((sum, item) => sum + item.value, 0);

    // שליפת שמות המשתמשים
    useEffect(() => {
        if (!selectedApp || !selectedApp.apiKey) return;

        fetch(`http://localhost:8080/track/stats/all-users?apiKey=${selectedApp.apiKey}`)
            .then(res => res.json())
            .then(users => {
                const map = {};
                users.forEach(u => {
                    map[u.id] = `${u.firstName} ${u.lastName}`;
                });
                setUsersMap(map);
            })
            .catch(console.error);
    }, [selectedApp]);

    // שליפת נתוני קטגוריות
    useEffect(() => {
        if (!selectedApp || !selectedApp.apiKey) return;

        setLoading(prev => ({ ...prev, category: true }));
        const params = new URLSearchParams();
        if (selectedUsers && selectedUsers.length > 0) {
            selectedUsers.forEach(id => params.append('userIds', id));
        }

        // הוספת פרמטרים של טווח זמן
        TimeRangeUtils.addTimeRangeToParams(params, timeRange);
        params.append('apiKey', selectedApp.apiKey);

        fetch(`http://localhost:8080/track/stats/by-category?${params}`)
            .then(res => res.json())
            .then(json => {
                const formatted = Object.entries(json).map(([category, count]) => ({
                    name: category,
                    value: count
                })).sort((a, b) => b.value - a.value); // מיון לפי ערך יורד

                setCategoryData(formatted);
                setTotals(prev => ({ ...prev, category: calculateTotal(formatted) }));

                // אם יש נתונים וטרם נבחרה קטגוריה, בחר את הראשונה
                if (formatted.length > 0 && !selectedCategory) {
                    setSelectedCategory(formatted[0].name);
                } else if (formatted.length > 0 && !formatted.some(item => item.name === selectedCategory)) {
                    // אם הקטגוריה שנבחרה לא קיימת בנתונים החדשים
                    setSelectedCategory(formatted[0].name);
                    setSelectedSubcategory(null);
                }
                setLoading(prev => ({ ...prev, category: false }));
            })
            .catch(err => {
                console.error(err);
                setLoading(prev => ({ ...prev, category: false }));
            });
    }, [selectedUsers, timeRange, selectedApp]);

    // שליפת נתוני תת-קטגוריות - רק כשיש קטגוריה נבחרת
    useEffect(() => {
        if (!selectedCategory || !selectedApp || !selectedApp.apiKey) {
            setSubcategoryData([]);
            setTotals(prev => ({ ...prev, subcategory: 0 }));
            setLoading(prev => ({ ...prev, subcategory: false }));
            setSelectedSubcategory(null);
            return;
        }

        setLoading(prev => ({ ...prev, subcategory: true }));
        setSubcategoryData([]); // איפוס נתונים קודמים

        const params = new URLSearchParams();
        if (selectedUsers && selectedUsers.length > 0) {
            selectedUsers.forEach(id => params.append('userIds', id));
        }

        // הוסף את הקטגוריה הנבחרת לפרמטרים (חובה)
        params.append('category', selectedCategory);

        // הוספת פרמטרים של טווח זמן
        TimeRangeUtils.addTimeRangeToParams(params, timeRange);
        params.append('apiKey', selectedApp.apiKey);

        fetch(`http://localhost:8080/track/stats/by-subcategory?${params}`)
            .then(res => res.json())
            .then(data => {
                let formatted;

                // טיפול בשני פורמטים אפשריים של תשובה מהשרת
                if (Array.isArray(data)) {
                    // אם התשובה היא מערך של אובייקטים
                    const grouped = {};
                    data.forEach(item => {
                        const subcategory = item.subcategory;
                        if (!grouped[subcategory]) grouped[subcategory] = 0;
                        grouped[subcategory] += item.count;
                    });

                    formatted = Object.entries(grouped).map(([subcategory, count]) => ({
                        name: subcategory,
                        value: count
                    }));
                } else {
                    // אם התשובה היא אובייקט של subcategory => count
                    formatted = Object.entries(data).map(([subcategory, count]) => ({
                        name: subcategory,
                        value: count
                    }));
                }

                // מיון לפי ערך יורד
                formatted = formatted.sort((a, b) => b.value - a.value);

                setSubcategoryData(formatted);
                setTotals(prev => ({ ...prev, subcategory: calculateTotal(formatted) }));

                // אם יש נתונים וטרם נבחרה תת-קטגוריה, בחר את הראשונה
                if (formatted.length > 0 && !selectedSubcategory) {
                    setSelectedSubcategory(formatted[0].name);
                } else if (formatted.length > 0 && !formatted.some(item => item.name === selectedSubcategory)) {
                    // אם תת-הקטגוריה שנבחרה לא קיימת בנתונים החדשים
                    setSelectedSubcategory(formatted[0].name);
                } else if (formatted.length === 0) {
                    // אם אין תת-קטגוריות, אפס את הבחירה
                    setSelectedSubcategory(null);
                }
                setLoading(prev => ({ ...prev, subcategory: false }));
            })
            .catch(err => {
                console.error(err);
                setLoading(prev => ({ ...prev, subcategory: false }));
            });
    }, [selectedCategory, selectedUsers, timeRange, selectedApp]);

    // שליפת נתוני פריטים - רק כשיש קטגוריה ותת-קטגוריה נבחרות
    useEffect(() => {
        if (!selectedCategory || !selectedSubcategory || !selectedApp || !selectedApp.apiKey) {
            setItemData([]);
            setTotals(prev => ({ ...prev, item: 0 }));
            setLoading(prev => ({ ...prev, item: false }));
            return;
        }

        setLoading(prev => ({ ...prev, item: true }));
        setItemData([]); // איפוס נתונים קודמים

        const params = new URLSearchParams();
        if (selectedUsers && selectedUsers.length > 0) {
            selectedUsers.forEach(id => params.append('userIds', id));
        }

        // הוסף את הקטגוריה הנבחרת לפרמטרים (חובה)
        params.append('category', selectedCategory);

        // הוסף את התת-קטגוריה הנבחרת לפרמטרים (חובה)
        params.append('subcategory', selectedSubcategory);

        // הוספת פרמטרים של טווח זמן
        TimeRangeUtils.addTimeRangeToParams(params, timeRange);
        params.append('apiKey', selectedApp.apiKey);

        fetch(`http://localhost:8080/track/stats/by-item?${params}`)
            .then(res => res.json())
            .then(data => {
                let formatted;

                // טיפול בשני פורמטים אפשריים של תשובה מהשרת
                if (Array.isArray(data)) {
                    // אם התשובה היא מערך של אובייקטים
                    const grouped = {};
                    data.forEach(item => {
                        const itemName = item.item;
                        if (!grouped[itemName]) grouped[itemName] = 0;
                        grouped[itemName] += item.count;
                    });

                    formatted = Object.entries(grouped).map(([item, count]) => ({
                        name: item,
                        value: count
                    }));
                } else {
                    // אם התשובה היא אובייקט של item => count
                    formatted = Object.entries(data).map(([item, count]) => ({
                        name: item,
                        value: count
                    }));
                }

                // מיון לפי ערך יורד
                formatted = formatted.sort((a, b) => b.value - a.value);

                setItemData(formatted);
                setTotals(prev => ({ ...prev, item: calculateTotal(formatted) }));
                setLoading(prev => ({ ...prev, item: false }));
            })
            .catch(err => {
                console.error(err);
                setLoading(prev => ({ ...prev, item: false }));
            });
    }, [selectedCategory, selectedSubcategory, selectedUsers, timeRange, selectedApp]);

    // פונקציה לרינדור תוויות בתוך הפאי
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
                fontSize={12}
                fontWeight="bold"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    // Custom Tooltip Component
    const CustomTooltip = ({ active, payload, chartType }) => {
        if (active && payload && payload.length) {
            const item = payload[0];
            const total = totals[chartType];
            const percentage = ((item.value / total) * 100).toFixed(1);

            return (
                <div className="bg-white/95 backdrop-blur-sm p-4 border border-gray-200 rounded-xl shadow-xl animate-fade-in">
                    <div className="flex items-center gap-3 mb-2">
                        <div
                            className="w-4 h-4 rounded-full shadow-sm"
                            style={{ backgroundColor: item.color }}
                        ></div>
                        <p className="font-bold text-gray-800 text-sm">
                            {item.name}
                        </p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm text-gray-600 flex justify-between">
                            <span>Actions:</span>
                            <span className="font-semibold text-gray-800">{item.value.toLocaleString()}</span>
                        </p>
                        <p className="text-sm text-gray-600 flex justify-between">
                            <span>Percentage:</span>
                            <span className="font-semibold" style={{ color: item.color }}>{percentage}%</span>
                        </p>
                    </div>
                    <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{
                                backgroundColor: item.color,
                                width: `${percentage}%`
                            }}
                        ></div>
                    </div>
                </div>
            );
        }
        return null;
    };

    // Custom Legend Component
    const CustomLegend = ({ payload, chartType }) => {
        if (!payload) return null;

        return (
            <ul className="list-none p-0 m-0 text-xs max-h-48 overflow-y-auto custom-scrollbar space-y-1">
                {payload.map((entry, index) => {
                    const percentage = ((entry.payload.value / totals[chartType]) * 100).toFixed(1);
                    const isSelected =
                        (chartType === 'category' && entry.payload.name === selectedCategory) ||
                        (chartType === 'subcategory' && entry.payload.name === selectedSubcategory);

                    return (
                        <li
                            key={`item-${index}`}
                            className={`flex items-center p-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${chartType === 'category' || chartType === 'subcategory'
                                ? 'cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:shadow-md hover:transform hover:scale-[1.02]'
                                : 'cursor-default'
                                } ${isSelected ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-300 shadow-md transform scale-[1.02]' : 'bg-white/50 border border-gray-200 hover:border-blue-300'}`}
                            onClick={() => {
                                if (chartType === 'category') {
                                    setSelectedCategory(entry.payload.name);
                                    setSelectedSubcategory(null);
                                } else if (chartType === 'subcategory') {
                                    setSelectedSubcategory(entry.payload.name);
                                }
                            }}
                        >
                            {/* Animated background effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-400/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>

                            <div
                                className="w-4 h-4 rounded-full mr-3 shadow-md relative z-10 ring-2 ring-white"
                                style={{ backgroundColor: entry.color }}
                            />
                            <div className="flex-1 min-w-0 relative z-10">
                                <div className="font-semibold text-gray-700 truncate text-sm">
                                    {entry.payload.name}
                                </div>
                                <div className="text-xs text-gray-500 mt-0.5">
                                    {entry.payload.value.toLocaleString()} actions
                                </div>
                            </div>
                            <div className="ml-3 text-right relative z-10">
                                <div className="font-bold text-sm" style={{ color: entry.color }}>
                                    {percentage}%
                                </div>
                                {isSelected && (
                                    <div className="w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-1 animate-bounce-subtle">
                                        ✓
                                    </div>
                                )}
                            </div>

                            {/* Progress bar */}
                            <div className="absolute bottom-0 left-0 h-1 bg-gray-200 w-full">
                                <div
                                    className="h-full transition-all duration-500 ease-out"
                                    style={{
                                        backgroundColor: entry.color,
                                        width: `${percentage}%`,
                                        opacity: isSelected ? 1 : 0.6
                                    }}
                                ></div>
                            </div>
                        </li>
                    );
                })}
            </ul>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header with Time Filter */}
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6 mb-8">
                <div className="text-center lg:text-left">
                    <div className="flex items-center gap-3 justify-center lg:justify-start mb-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white text-xl shadow-lg">
                            🔍
                        </div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Hierarchical Analysis
                        </h2>
                    </div>
                    <p className="text-gray-600 text-base max-w-md mx-auto lg:mx-0">
                        Navigate through categories, subcategories, and items with interactive pie charts
                    </p>
                    <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto lg:mx-0 mt-3"></div>
                </div>
                <div className="flex-shrink-0">
                    <TimeRangeFilter timeRange={timeRange} setTimeRange={setTimeRange} />
                </div>
            </div>

            {/* Charts Container */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Categories Chart */}
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-500 hover:transform hover:scale-[1.02] group relative overflow-hidden">
                    {/* Animated background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-sm shadow-lg">
                                📊
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">Categories</h3>
                            <div className="flex-1"></div>
                            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                        </div>
                    </div>

                    <div className="relative z-10">
                        {loading.category ? (
                            <LoadingIndicator />
                        ) : categoryData.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <span className="text-2xl opacity-50">📊</span>
                                </div>
                                <p className="text-sm font-medium text-gray-500">No data available</p>
                                <p className="text-xs text-gray-400 mt-1">Try adjusting your filters</p>
                            </div>
                        ) : (
                            <div>
                                <div className="text-center mb-4">
                                    <span className="font-bold text-gray-700">Total: {totals.category} actions</span>
                                    {timeRange !== 'all' && (
                                        <span className="ml-2 text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                            {TimeRangeUtils.getTimeRangeDescription(timeRange)}
                                        </span>
                                    )}
                                </div>
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie
                                            data={categoryData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={renderCustomizedLabel}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                            animationDuration={800}
                                            onClick={(data) => {
                                                setSelectedCategory(data.name);
                                                setSelectedSubcategory(null);
                                            }}
                                        >
                                            {categoryData.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={COLORS[index % COLORS.length]}
                                                    stroke={entry.name === selectedCategory ? '#000' : 'none'}
                                                    strokeWidth={entry.name === selectedCategory ? 2 : 0}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<CustomTooltip chartType="category" />} />
                                        <Legend
                                            content={<CustomLegend chartType="category" />}
                                            layout="vertical"
                                            verticalAlign="middle"
                                            align="right"
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>
                </div>

                {/* Subcategories Chart */}
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-500 hover:transform hover:scale-[1.02] group relative overflow-hidden">
                    {/* Animated background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-pink-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-sm shadow-lg">
                                🏷️
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">Subcategories</h3>
                            <div className="flex-1"></div>
                            <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                            {selectedCategory && (
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                                    {selectedCategory}
                                </span>
                            )}
                        </div>

                        {loading.subcategory ? (
                            <LoadingIndicator />
                        ) : !selectedCategory ? (
                            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                                <span className="text-4xl mb-4 opacity-50">👈</span>
                                <p className="text-sm font-medium text-center">Select a category to view subcategories</p>
                            </div>
                        ) : subcategoryData.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                                <span className="text-4xl mb-4 opacity-50">🏷️</span>
                                <p className="text-sm font-medium">No subcategories for {selectedCategory}</p>
                            </div>
                        ) : (
                            <div>
                                <div className="text-center mb-4">
                                    <span className="font-bold text-gray-700">Total: {totals.subcategory} actions</span>
                                    {timeRange !== 'all' && (
                                        <span className="ml-2 text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                            {TimeRangeUtils.getTimeRangeDescription(timeRange)}
                                        </span>
                                    )}
                                </div>
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie
                                            data={subcategoryData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={renderCustomizedLabel}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                            animationDuration={800}
                                            onClick={(data) => {
                                                setSelectedSubcategory(data.name);
                                            }}
                                        >
                                            {subcategoryData.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={COLORS[index % COLORS.length]}
                                                    stroke={entry.name === selectedSubcategory ? '#000' : 'none'}
                                                    strokeWidth={entry.name === selectedSubcategory ? 2 : 0}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<CustomTooltip chartType="subcategory" />} />
                                        <Legend
                                            content={<CustomLegend chartType="subcategory" />}
                                            layout="vertical"
                                            verticalAlign="middle"
                                            align="right"
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>
                </div>

                {/* Items Chart */}
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-500 hover:transform hover:scale-[1.02] group relative overflow-hidden">
                    {/* Animated background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-teal-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white text-sm shadow-lg">
                                📦
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">Items</h3>
                            <div className="flex-1"></div>
                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                            {selectedSubcategory && (
                                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full font-medium">
                                    {selectedSubcategory}
                                </span>
                            )}
                        </div>

                        {loading.item ? (
                            <LoadingIndicator />
                        ) : !selectedCategory || !selectedSubcategory ? (
                            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                                <span className="text-4xl mb-4 opacity-50">👈</span>
                                <p className="text-sm font-medium text-center">Select category and subcategory to view items</p>
                            </div>
                        ) : itemData.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                                <span className="text-4xl mb-4 opacity-50">📦</span>
                                <p className="text-sm font-medium">No items for {selectedSubcategory}</p>
                            </div>
                        ) : (
                            <div>
                                <div className="text-center mb-4">
                                    <span className="font-bold text-gray-700">Total: {totals.item} actions</span>
                                    {timeRange !== 'all' && (
                                        <span className="ml-2 text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                            {TimeRangeUtils.getTimeRangeDescription(timeRange)}
                                        </span>
                                    )}
                                </div>
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie
                                            data={itemData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={renderCustomizedLabel}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                            animationDuration={800}
                                        >
                                            {itemData.map((_, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<CustomTooltip chartType="item" />} />
                                        <Legend
                                            content={<CustomLegend chartType="item" />}
                                            layout="vertical"
                                            verticalAlign="middle"
                                            align="right"
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>

    );
}

export default MultiPieCharts;
