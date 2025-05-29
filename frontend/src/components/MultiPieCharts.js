import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import TimeRangeFilter from './TimeRangeFilter';
import TimeRangeUtils from '../utils/TimeRangeUtils';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#bb6bd9', '#f44336', '#4caf50', '#e91e63'];

// רכיב אינדיקטור טעינה
const LoadingIndicator = () => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '250px' }}>
        <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', marginBottom: '10px' }}>⏳</div>
            <div>טוען נתונים...</div>
        </div>
    </div>
);

function MultiPieCharts({ selectedUsers }) {
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
        fetch("http://localhost:8080/track/stats/all-users")
            .then(res => res.json())
            .then(users => {
                const map = {};
                users.forEach(u => {
                    map[u.id] = `${u.firstName} ${u.lastName}`;
                });
                setUsersMap(map);
            })
            .catch(console.error);
    }, []);

    // שליפת נתוני קטגוריות
    useEffect(() => {
        setLoading(prev => ({ ...prev, category: true }));
        const params = new URLSearchParams();
        if (selectedUsers && selectedUsers.length > 0) {
            selectedUsers.forEach(id => params.append('userIds', id));
        }

        // הוספת פרמטרים של טווח זמן
        TimeRangeUtils.addTimeRangeToParams(params, timeRange);

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
    }, [selectedUsers, timeRange]);

    // שליפת נתוני תת-קטגוריות - רק כשיש קטגוריה נבחרת
    useEffect(() => {
        if (!selectedCategory) {
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
    }, [selectedCategory, selectedUsers, timeRange]);

    // שליפת נתוני פריטים - רק כשיש קטגוריה ותת-קטגוריה נבחרות
    useEffect(() => {
        if (!selectedCategory || !selectedSubcategory) {
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
    }, [selectedCategory, selectedSubcategory, selectedUsers, timeRange]);

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

    // רכיב טולטיפ מותאם אישית
    const CustomTooltip = ({ active, payload, chartType }) => {
        if (active && payload && payload.length) {
            const item = payload[0];
            const total = totals[chartType];
            const percentage = ((item.value / total) * 100).toFixed(1);

            return (
                <div style={{
                    backgroundColor: '#fff',
                    padding: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '5px'
                }}>
                    <p style={{ fontWeight: 'bold', color: item.color }}>
                        {item.name}
                    </p>
                    <p>
                        {item.value} פעולות ({percentage}%)
                    </p>
                </div>
            );
        }
        return null;
    };

    // רכיב מקרא מותאם אישית
    const CustomLegend = ({ payload, chartType }) => {
        if (!payload) return null;

        return (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '12px', maxHeight: '200px', overflowY: 'auto' }}>
                {payload.map((entry, index) => {
                    const percentage = ((entry.payload.value / totals[chartType]) * 100).toFixed(1);

                    return (
                        <li
                            key={`item-${index}`}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                marginBottom: '5px',
                                cursor: chartType === 'category' || chartType === 'subcategory' ? 'pointer' : 'default',
                                padding: '3px',
                                borderRadius: '3px',
                                backgroundColor:
                                    (chartType === 'category' && entry.payload.name === selectedCategory) ||
                                        (chartType === 'subcategory' && entry.payload.name === selectedSubcategory)
                                        ? 'rgba(0,0,0,0.05)' : 'transparent'
                            }}
                            onClick={() => {
                                if (chartType === 'category') {
                                    setSelectedCategory(entry.payload.name);
                                    setSelectedSubcategory(null);
                                } else if (chartType === 'subcategory') {
                                    setSelectedSubcategory(entry.payload.name);
                                }
                            }}
                        >
                            <span
                                style={{
                                    display: 'inline-block',
                                    width: '10px',
                                    height: '10px',
                                    backgroundColor: entry.color,
                                    marginRight: '5px'
                                }}
                            />
                            <span style={{ flex: 1 }}>{entry.payload.name}</span>
                            <span style={{ marginLeft: '5px', color: '#666' }}>
                                {entry.payload.value} ({percentage}%)
                            </span>
                        </li>
                    );
                })}
            </ul>
        );
    };

    return (
        <div style={{ marginTop: 40 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h2>ניתוח מדורג לפי קטגוריה, תת-קטגוריה ופריט</h2>

                {/* רכיב סינון לפי זמן */}
                <TimeRangeFilter timeRange={timeRange} setTimeRange={setTimeRange} />
            </div>

            <div className="multi-pie-container" style={{ display: 'flex', gap: '20px', flexWrap: 'nowrap', justifyContent: 'space-between' }}>
                {/* תצוגת קטגוריות */}
                <div className="pie-section" style={{ flex: '1 1 30%', minWidth: '300px', border: '1px solid #eee', borderRadius: '8px', padding: '15px' }}>
                    <h3>קטגוריות</h3>
                    {loading.category ? (
                        <LoadingIndicator />
                    ) : categoryData.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '20px', color: 'gray' }}>
                            אין נתונים להצגה
                        </div>
                    ) : (
                        <div>
                            <div style={{
                                textAlign: 'center',
                                marginBottom: '10px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <span style={{ fontWeight: 'bold' }}>סה"כ: {totals.category} פעולות</span>
                                {timeRange !== 'all' && (
                                    <span style={{ marginRight: '10px', fontSize: '14px', color: '#666' }}>
                                        ({TimeRangeUtils.getTimeRangeDescription(timeRange)})
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

                {/* תצוגת תת-קטגוריות */}
                <div className="pie-section" style={{ flex: '1 1 30%', minWidth: '300px', border: '1px solid #eee', borderRadius: '8px', padding: '15px' }}>
                    <h3>תתי-קטגוריות</h3>
                    {loading.subcategory ? (
                        <LoadingIndicator />
                    ) : !selectedCategory ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '20px',
                            color: 'gray',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '250px'
                        }}>
                            <div style={{ fontSize: '24px', marginBottom: '10px' }}>👈</div>
                            <div>בחר קטגוריה כדי להציג תת-קטגוריות</div>
                        </div>
                    ) : subcategoryData.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '20px', color: 'gray' }}>
                            אין תת-קטגוריות עבור {selectedCategory}
                        </div>
                    ) : (
                        <div>
                            <div style={{
                                textAlign: 'center',
                                marginBottom: '10px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <span style={{ fontWeight: 'bold' }}>סה"כ: {totals.subcategory} פעולות</span>
                                {timeRange !== 'all' && (
                                    <span style={{ marginRight: '10px', fontSize: '14px', color: '#666' }}>
                                        ({TimeRangeUtils.getTimeRangeDescription(timeRange)})
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

                {/* תצוגת פריטים */}
                <div className="pie-section" style={{ flex: '1 1 30%', minWidth: '300px', border: '1px solid #eee', borderRadius: '8px', padding: '15px' }}>
                    <h3>פריטים</h3>
                    {loading.item ? (
                        <LoadingIndicator />
                    ) : !selectedCategory || !selectedSubcategory ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '20px',
                            color: 'gray',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '250px'
                        }}>
                            <div style={{ fontSize: '24px', marginBottom: '10px' }}>👈</div>
                            <div>בחר קטגוריה ותת-קטגוריה כדי להציג פריטים</div>
                        </div>
                    ) : itemData.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '20px', color: 'gray' }}>
                            אין פריטים עבור {selectedSubcategory}
                        </div>
                    ) : (
                        <div>
                            <div style={{
                                textAlign: 'center',
                                marginBottom: '10px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <span style={{ fontWeight: 'bold' }}>סה"כ: {totals.item} פעולות</span>
                                {timeRange !== 'all' && (
                                    <span style={{ marginRight: '10px', fontSize: '14px', color: '#666' }}>
                                        ({TimeRangeUtils.getTimeRangeDescription(timeRange)})
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
    );
}

export default MultiPieCharts;
