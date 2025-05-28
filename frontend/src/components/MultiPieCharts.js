// import React, { useEffect, useState } from 'react';
// import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#bb6bd9', '#f44336', '#4caf50', '#e91e63',
//     '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688'];

// function MultiPieCharts({ selectedUsers }) {
//     const [categoryData, setCategoryData] = useState([]);
//     const [subcategoryData, setSubcategoryData] = useState([]);
//     const [itemData, setItemData] = useState([]);
//     const [selectedCategory, setSelectedCategory] = useState(null);
//     const [selectedSubcategory, setSelectedSubcategory] = useState(null);
//     const [totals, setTotals] = useState({ category: 0, subcategory: 0, item: 0 });
//     const [usersMap, setUsersMap] = useState({});
//     const [loading, setLoading] = useState({ category: false, subcategory: false, item: false });

//     // פונקציה לחישוב סך הכל
//     const calculateTotal = (data) => data.reduce((sum, item) => sum + item.value, 0);

//     // שליפת שמות המשתמשים
//     useEffect(() => {
//         fetch("http://localhost:8080/track/stats/all-users")
//             .then(res => res.json())
//             .then(users => {
//                 const map = {};
//                 users.forEach(u => {
//                     map[u.id] = `${u.firstName} ${u.lastName}`;
//                 });
//                 setUsersMap(map);
//             })
//             .catch(console.error);
//     }, []);

//     // שליפת נתוני קטגוריות
//     useEffect(() => {
//         setLoading(prev => ({ ...prev, category: true }));
//         const params = new URLSearchParams();
//         if (selectedUsers && selectedUsers.length > 0) {
//             selectedUsers.forEach(id => params.append('userIds', id));
//         }

//         fetch(`http://localhost:8080/track/stats/by-category?${params}`)
//             .then(res => res.json())
//             .then(json => {
//                 const formatted = Object.entries(json).map(([category, count]) => ({
//                     name: category,
//                     value: count
//                 })).sort((a, b) => b.value - a.value); // מיון לפי ערך יורד

//                 setCategoryData(formatted);
//                 setTotals(prev => ({ ...prev, category: calculateTotal(formatted) }));

//                 // אם יש נתונים וטרם נבחרה קטגוריה, בחר את הראשונה
//                 if (formatted.length > 0 && !selectedCategory) {
//                     setSelectedCategory(formatted[0].name);
//                 } else if (formatted.length > 0 && !formatted.some(item => item.name === selectedCategory)) {
//                     // אם הקטגוריה שנבחרה לא קיימת בנתונים החדשים
//                     setSelectedCategory(formatted[0].name);
//                     setSelectedSubcategory(null);
//                 }
//                 setLoading(prev => ({ ...prev, category: false }));
//             })
//             .catch(err => {
//                 console.error(err);
//                 setLoading(prev => ({ ...prev, category: false }));
//             });
//     }, [selectedUsers]);

//     // שליפת נתוני תת-קטגוריות כאשר נבחרת קטגוריה
//     useEffect(() => {
//         if (!selectedCategory) return;

//         setLoading(prev => ({ ...prev, subcategory: true }));
//         setSubcategoryData([]); // איפוס נתונים קודמים

//         const params = new URLSearchParams();
//         if (selectedUsers && selectedUsers.length > 0) {
//             selectedUsers.forEach(id => params.append('userIds', id));
//         }
//         params.append('category', selectedCategory);

//         fetch(`http://localhost:8080/track/stats/by-subcategory?${params}`)
//             .then(res => res.json())
//             .then(data => {
//                 let formatted;

//                 // טיפול בשני פורמטים אפשריים של תשובה מהשרת
//                 if (Array.isArray(data)) {
//                     // אם התשובה היא מערך של אובייקטים
//                     const grouped = {};
//                     data.forEach(item => {
//                         const subcategory = item.subcategory;
//                         if (!grouped[subcategory]) grouped[subcategory] = 0;
//                         grouped[subcategory] += item.count;
//                     });

//                     formatted = Object.entries(grouped).map(([subcategory, count]) => ({
//                         name: subcategory,
//                         value: count
//                     }));
//                 } else {
//                     // אם התשובה היא אובייקט של subcategory => count
//                     formatted = Object.entries(data).map(([subcategory, count]) => ({
//                         name: subcategory,
//                         value: count
//                     }));
//                 }

//                 // מיון לפי ערך יורד
//                 formatted = formatted.sort((a, b) => b.value - a.value);

//                 setSubcategoryData(formatted);
//                 setTotals(prev => ({ ...prev, subcategory: calculateTotal(formatted) }));

//                 // אם יש נתונים וטרם נבחרה תת-קטגוריה, בחר את הראשונה
//                 if (formatted.length > 0 && !selectedSubcategory) {
//                     setSelectedSubcategory(formatted[0].name);
//                 } else if (formatted.length > 0 && !formatted.some(item => item.name === selectedSubcategory)) {
//                     // אם תת-הקטגוריה שנבחרה לא קיימת בנתונים החדשים
//                     setSelectedSubcategory(formatted[0].name);
//                 }
//                 setLoading(prev => ({ ...prev, subcategory: false }));
//             })
//             .catch(err => {
//                 console.error(err);
//                 setLoading(prev => ({ ...prev, subcategory: false }));
//             });
//     }, [selectedCategory, selectedUsers]);

//     // שליפת נתוני פריטים כאשר נבחרת תת-קטגוריה
//     useEffect(() => {
//         if (!selectedCategory || !selectedSubcategory) {
//             setItemData([]);
//             setTotals(prev => ({ ...prev, item: 0 }));
//             return;
//         }

//         setLoading(prev => ({ ...prev, item: true }));
//         setItemData([]); // איפוס נתונים קודמים

//         const params = new URLSearchParams();
//         if (selectedUsers && selectedUsers.length > 0) {
//             selectedUsers.forEach(id => params.append('userIds', id));
//         }
//         params.append('category', selectedCategory);
//         params.append('subcategory', selectedSubcategory);

//         fetch(`http://localhost:8080/track/stats/by-item?${params}`)
//             .then(res => res.json())
//             .then(data => {
//                 let formatted;

//                 // טיפול בשני פורמטים אפשריים של תשובה מהשרת
//                 if (Array.isArray(data)) {
//                     // אם התשובה היא מערך של אובייקטים
//                     const grouped = {};
//                     data.forEach(item => {
//                         const itemName = item.item;
//                         if (!grouped[itemName]) grouped[itemName] = 0;
//                         grouped[itemName] += item.count;
//                     });

//                     formatted = Object.entries(grouped).map(([item, count]) => ({
//                         name: item,
//                         value: count
//                     }));
//                 } else {
//                     // אם התשובה היא אובייקט של item => count
//                     formatted = Object.entries(data).map(([item, count]) => ({
//                         name: item,
//                         value: count
//                     }));
//                 }

//                 // מיון לפי ערך יורד
//                 formatted = formatted.sort((a, b) => b.value - a.value);

//                 setItemData(formatted);
//                 setTotals(prev => ({ ...prev, item: calculateTotal(formatted) }));
//                 setLoading(prev => ({ ...prev, item: false }));
//             })
//             .catch(err => {
//                 console.error(err);
//                 setLoading(prev => ({ ...prev, item: false }));
//             });
//     }, [selectedCategory, selectedSubcategory, selectedUsers]);

//     // יצירת Tooltip מותאם אישית
//     const CustomTooltip = ({ active, payload, chartType }) => {
//         if (active && payload && payload.length) {
//             const item = payload[0];
//             const total = totals[chartType];
//             const percentage = ((item.value / total) * 100).toFixed(1);

//             return (
//                 <div style={{
//                     backgroundColor: '#fff',
//                     padding: '10px',
//                     border: '1px solid #ccc',
//                     borderRadius: '5px',
//                     boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
//                 }}>
//                     <p style={{
//                         fontWeight: 'bold',
//                         color: item.color,
//                         borderBottom: '1px solid #eee',
//                         paddingBottom: '5px',
//                         marginBottom: '5px'
//                     }}>
//                         {item.name}
//                     </p>
//                     <p style={{ margin: '5px 0' }}>
//                         {item.value} פעולות ({percentage}%)
//                     </p>

//                     {/* אם נבחרו יוזרים, הצג פילוח לפי יוזר */}
//                     {selectedUsers && selectedUsers.length > 0 && item.userBreakdown && (
//                         <div style={{ marginTop: '5px', borderTop: '1px solid #eee', paddingTop: '5px' }}>
//                             <p style={{ fontWeight: 'bold', fontSize: '12px', marginBottom: '5px' }}>
//                                 פילוח לפי משתמשים:
//                             </p>
//                             {Object.entries(item.userBreakdown).map(([userId, count]) => (
//                                 <p key={userId} style={{ fontSize: '12px', margin: '2px 0' }}>
//                                     {usersMap[userId] || userId}: {count} ({((count / item.value) * 100).toFixed(1)}%)
//                                 </p>
//                             ))}
//                         </div>
//                     )}
//                 </div>
//             );
//         }
//         return null;
//     };

//     // יצירת תוויות מותאמות אישית
//     const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
//         if (percent < 0.05) return null; // לא להציג תוויות לפלחים קטנים מדי

//         const RADIAN = Math.PI / 180;
//         const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
//         const x = cx + radius * Math.cos(-midAngle * RADIAN);
//         const y = cy + radius * Math.sin(-midAngle * RADIAN);

//         return (
//             <text
//                 x={x}
//                 y={y}
//                 fill="white"
//                 textAnchor={x > cx ? 'start' : 'end'}
//                 dominantBaseline="central"
//                 fontSize={12}
//                 fontWeight="bold"
//             >
//                 {`${(percent * 100).toFixed(0)}%`}
//             </text>
//         );
//     };

//     // יצירת מקרא מותאם אישית
//     const CustomLegend = ({ payload, chartType }) => {
//         const total = totals[chartType];

//         return (
//             <div style={{ maxHeight: '200px', overflowY: 'auto', paddingRight: '5px' }}>
//                 <ul style={{ listStyle: 'none', padding: 0, fontSize: '12px' }}>
//                     {payload.map((entry, index) => {
//                         const item = chartType === 'category'
//                             ? categoryData.find(d => d.name === entry.value)
//                             : chartType === 'subcategory'
//                                 ? subcategoryData.find(d => d.name === entry.value)
//                                 : itemData.find(d => d.name === entry.value);

//                         const percentage = item ? ((item.value / total) * 100).toFixed(1) : 0;

//                         return (
//                             <li
//                                 key={`item-${index}`}
//                                 style={{
//                                     display: 'flex',
//                                     alignItems: 'center',
//                                     marginBottom: '5px',
//                                     cursor: chartType === 'category' || chartType === 'subcategory' ? 'pointer' : 'default',
//                                     padding: '3px',
//                                     borderRadius: '3px',
//                                     backgroundColor:
//                                         (chartType === 'category' && entry.value === selectedCategory) ||
//                                             (chartType === 'subcategory' && entry.value === selectedSubcategory)
//                                             ? 'rgba(0,0,0,0.05)' : 'transparent'
//                                 }}
//                                 onClick={() => {
//                                     if (chartType === 'category') {
//                                         setSelectedCategory(entry.value);
//                                         setSelectedSubcategory(null);
//                                     } else if (chartType === 'subcategory') {
//                                         setSelectedSubcategory(entry.value);
//                                     }
//                                 }}
//                             >
//                                 <div
//                                     style={{
//                                         width: '10px',
//                                         height: '10px',
//                                         backgroundColor: entry.color,
//                                         marginRight: '5px',
//                                         borderRadius: '2px'
//                                     }}
//                                 />
//                                 <span style={{
//                                     fontWeight:
//                                         (chartType === 'category' && entry.value === selectedCategory) ||
//                                             (chartType === 'subcategory' && entry.value === selectedSubcategory)
//                                             ? 'bold' : 'normal'
//                                 }}>
//                                     {entry.value.length > 15 ? entry.value.substring(0, 15) + '...' : entry.value} ({percentage}%)
//                                 </span>
//                             </li>
//                         );
//                     })}
//                 </ul>
//             </div>
//         );
//     };

//     // רכיב טעינה
//     const LoadingIndicator = () => (
//         <div style={{
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//             height: '200px'
//         }}>
//             <div style={{
//                 border: '4px solid #f3f3f3',
//                 borderTop: '4px solid #3498db',
//                 borderRadius: '50%',
//                 width: '30px',
//                 height: '30px',
//                 animation: 'spin 2s linear infinite'
//             }} />
//             <style>{`
//                 @keyframes spin {
//                     0% { transform: rotate(0deg); }
//                     100% { transform: rotate(360deg); }
//                 }
//             `}</style>
//         </div>
//     );

//     // רכיב כפתור איפוס
//     const ResetButton = ({ onClick, label }) => (
//         <button
//             onClick={onClick}
//             style={{
//                 background: 'none',
//                 border: '1px solid #ccc',
//                 borderRadius: '4px',
//                 padding: '3px 8px',
//                 fontSize: '12px',
//                 cursor: 'pointer',
//                 marginLeft: '10px'
//             }}
//         >
//             {label || 'איפוס'}
//         </button>
//     );

//     return (
//         <div style={{
//             marginTop: 40,
//             backgroundColor: '#f9f9f9',
//             borderRadius: '8px',
//             padding: '20px',
//             boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
//         }}>
//             <h2 style={{
//                 borderBottom: '1px solid #eee',
//                 paddingBottom: '10px',
//                 marginBottom: '20px',
//                 display: 'flex',
//                 justifyContent: 'space-between',
//                 alignItems: 'center'
//             }}>
//                 <span>התפלגות פעולות לפי רמות</span>
//                 {selectedUsers && selectedUsers.length > 0 && (
//                     <span style={{
//                         fontSize: '14px',
//                         fontWeight: 'normal',
//                         backgroundColor: '#e3f2fd',
//                         padding: '5px 10px',
//                         borderRadius: '4px'
//                     }}>
//                         מסונן לפי {selectedUsers.length} משתמשים
//                     </span>
//                 )}
//             </h2>

//             <div style={{
//                 display: 'flex',
//                 flexDirection: 'row',
//                 flexWrap: 'wrap',
//                 justifyContent: 'space-between',
//                 gap: '20px'
//             }}>
//                 {/* עוגה 1: קטגוריות */}
//                 <div style={{
//                     flex: '1 1 30%',
//                     minWidth: '300px',
//                     backgroundColor: 'white',
//                     borderRadius: '8px',
//                     padding: '15px',
//                     boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
//                 }}>
//                     <div style={{
//                         display: 'flex',
//                         justifyContent: 'space-between',
//                         alignItems: 'center',
//                         marginBottom: '15px'
//                     }}>
//                         <h3 style={{ margin: 0 }}>קטגוריות</h3>
//                     </div>

//                     {loading.category ? (
//                         <LoadingIndicator />
//                     ) : categoryData.length === 0 ? (
//                         <div style={{ textAlign: 'center', padding: '20px', color: 'gray' }}>
//                             אין נתונים להצגה
//                         </div>
//                     ) : (
//                         <div>
//                             <div style={{
//                                 textAlign: 'center',
//                                 marginBottom: '10px',
//                                 display: 'flex',
//                                 justifyContent: 'center',
//                                 alignItems: 'center'
//                             }}>
//                                 <span style={{ fontWeight: 'bold' }}>סה"כ: {totals.category} פעולות</span>
//                             </div>
//                             <ResponsiveContainer width="100%" height={250}>
//                                 <PieChart>
//                                     <Pie
//                                         data={categoryData}
//                                         cx="50%"
//                                         cy="50%"
//                                         labelLine={false}
//                                         label={renderCustomizedLabel}
//                                         outerRadius={80}
//                                         fill="#8884d8"
//                                         dataKey="value"
//                                         animationDuration={800}
//                                         onClick={(data) => setSelectedCategory(data.name)}
//                                     >
//                                         {categoryData.map((entry, index) => (
//                                             <Cell
//                                                 key={`cell-${index}`}
//                                                 fill={COLORS[index % COLORS.length]}
//                                                 stroke={entry.name === selectedCategory ? '#000' : 'none'}
//                                                 strokeWidth={entry.name === selectedCategory ? 2 : 0}
//                                             />
//                                         ))}
//                                     </Pie>
//                                     <Tooltip content={<CustomTooltip chartType="category" />} />
//                                     <Legend
//                                         content={<CustomLegend chartType="category" />}
//                                         layout="vertical"
//                                         verticalAlign="middle"
//                                         align="right"
//                                     />
//                                 </PieChart>
//                             </ResponsiveContainer>
//                         </div>
//                     )}
//                 </div>

//                 {/* עוגה 2: תת-קטגוריות */}
//                 <div style={{
//                     flex: '1 1 30%',
//                     minWidth: '300px',
//                     backgroundColor: 'white',
//                     borderRadius: '8px',
//                     padding: '15px',
//                     boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
//                 }}>
//                     <div style={{
//                         display: 'flex',
//                         justifyContent: 'space-between',
//                         alignItems: 'center',
//                         marginBottom: '15px'
//                     }}>
//                         <h3 style={{ margin: 0 }}>תת-קטגוריות {selectedCategory ? `(${selectedCategory})` : ''}</h3>
//                     </div>

//                     {loading.subcategory ? (
//                         <LoadingIndicator />
//                     ) : !selectedCategory ? (
//                         <div style={{ textAlign: 'center', padding: '20px', color: 'gray' }}>
//                             בחר קטגוריה תחילה
//                         </div>
//                     ) : subcategoryData.length === 0 ? (
//                         <div style={{ textAlign: 'center', padding: '20px', color: 'gray' }}>
//                             אין נתונים להצגה
//                         </div>
//                     ) : (
//                         <div>
//                             <div style={{
//                                 textAlign: 'center',
//                                 marginBottom: '10px',
//                                 display: 'flex',
//                                 justifyContent: 'center',
//                                 alignItems: 'center'
//                             }}>
//                                 <span style={{ fontWeight: 'bold' }}>סה"כ: {totals.subcategory} פעולות</span>
//                             </div>
//                             <ResponsiveContainer width="100%" height={250}>
//                                 <PieChart>
//                                     <Pie
//                                         data={subcategoryData}
//                                         cx="50%"
//                                         cy="50%"
//                                         labelLine={false}
//                                         label={renderCustomizedLabel}
//                                         outerRadius={80}
//                                         fill="#8884d8"
//                                         dataKey="value"
//                                         animationDuration={800}
//                                         onClick={(data) => setSelectedSubcategory(data.name)}
//                                     >
//                                         {subcategoryData.map((entry, index) => (
//                                             <Cell
//                                                 key={`cell-${index}`}
//                                                 fill={COLORS[index % COLORS.length]}
//                                                 stroke={entry.name === selectedSubcategory ? '#000' : 'none'}
//                                                 strokeWidth={entry.name === selectedSubcategory ? 2 : 0}
//                                             />
//                                         ))}
//                                     </Pie>
//                                     <Tooltip content={<CustomTooltip chartType="subcategory" />} />
//                                     <Legend
//                                         content={<CustomLegend chartType="subcategory" />}
//                                         layout="vertical"
//                                         verticalAlign="middle"
//                                         align="right"
//                                     />
//                                 </PieChart>
//                             </ResponsiveContainer>
//                         </div>
//                     )}
//                 </div>

//                 {/* עוגה 3: פריטים */}
//                 <div style={{
//                     flex: '1 1 30%',
//                     minWidth: '300px',
//                     backgroundColor: 'white',
//                     borderRadius: '8px',
//                     padding: '15px',
//                     boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
//                 }}>
//                     <div style={{
//                         display: 'flex',
//                         justifyContent: 'space-between',
//                         alignItems: 'center',
//                         marginBottom: '15px'
//                     }}>
//                         <h3 style={{ margin: 0 }}>פריטים {selectedSubcategory ? `(${selectedSubcategory})` : ''}</h3>
//                     </div>

//                     {loading.item ? (
//                         <LoadingIndicator />
//                     ) : !selectedCategory || !selectedSubcategory ? (
//                         <div style={{ textAlign: 'center', padding: '20px', color: 'gray' }}>
//                             בחר קטגוריה ותת-קטגוריה תחילה
//                         </div>
//                     ) : itemData.length === 0 ? (
//                         <div style={{ textAlign: 'center', padding: '20px', color: 'gray' }}>
//                             אין נתונים להצגה
//                         </div>
//                     ) : (
//                         <div>
//                             <div style={{
//                                 textAlign: 'center',
//                                 marginBottom: '10px',
//                                 display: 'flex',
//                                 justifyContent: 'center',
//                                 alignItems: 'center'
//                             }}>
//                                 <span style={{ fontWeight: 'bold' }}>סה"כ: {totals.item} פעולות</span>
//                             </div>
//                             <ResponsiveContainer width="100%" height={250}>
//                                 <PieChart>
//                                     <Pie
//                                         data={itemData}
//                                         cx="50%"
//                                         cy="50%"
//                                         labelLine={false}
//                                         label={renderCustomizedLabel}
//                                         outerRadius={80}
//                                         fill="#8884d8"
//                                         dataKey="value"
//                                         animationDuration={800}
//                                     >
//                                         {itemData.map((entry, index) => (
//                                             <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                                         ))}
//                                     </Pie>
//                                     <Tooltip content={<CustomTooltip chartType="item" />} />
//                                     <Legend
//                                         content={<CustomLegend chartType="item" />}
//                                         layout="vertical"
//                                         verticalAlign="middle"
//                                         align="right"
//                                     />
//                                 </PieChart>
//                             </ResponsiveContainer>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default MultiPieCharts;


import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#bb6bd9', '#f44336', '#4caf50', '#e91e63',
    '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688'];

function MultiPieCharts({ selectedUsers }) {
    const [categoryData, setCategoryData] = useState([]);
    const [subcategoryData, setSubcategoryData] = useState([]);
    const [itemData, setItemData] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [totals, setTotals] = useState({ category: 0, subcategory: 0, item: 0 });
    const [usersMap, setUsersMap] = useState({});
    const [loading, setLoading] = useState({ category: false, subcategory: false, item: false });

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
    }, [selectedUsers]);

    // שליפת נתוני תת-קטגוריות כאשר נבחרת קטגוריה
    useEffect(() => {
        if (!selectedCategory) return;

        setLoading(prev => ({ ...prev, subcategory: true }));
        setSubcategoryData([]); // איפוס נתונים קודמים

        const params = new URLSearchParams();
        if (selectedUsers && selectedUsers.length > 0) {
            selectedUsers.forEach(id => params.append('userIds', id));
        }
        params.append('category', selectedCategory);

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
                }
                setLoading(prev => ({ ...prev, subcategory: false }));
            })
            .catch(err => {
                console.error(err);
                setLoading(prev => ({ ...prev, subcategory: false }));
            });
    }, [selectedCategory, selectedUsers]);

    // שליפת נתוני פריטים כאשר נבחרת תת-קטגוריה
    useEffect(() => {
        if (!selectedCategory || !selectedSubcategory) {
            setItemData([]);
            setTotals(prev => ({ ...prev, item: 0 }));
            return;
        }

        setLoading(prev => ({ ...prev, item: true }));
        setItemData([]); // איפוס נתונים קודמים

        const params = new URLSearchParams();
        if (selectedUsers && selectedUsers.length > 0) {
            selectedUsers.forEach(id => params.append('userIds', id));
        }
        params.append('category', selectedCategory);
        params.append('subcategory', selectedSubcategory);

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
    }, [selectedCategory, selectedSubcategory, selectedUsers]);

    // יצירת Tooltip מותאם אישית
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
                    borderRadius: '5px',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                }}>
                    <p style={{
                        fontWeight: 'bold',
                        color: item.color,
                        borderBottom: '1px solid #eee',
                        paddingBottom: '5px',
                        marginBottom: '5px'
                    }}>
                        {item.name}
                    </p>
                    <p style={{ margin: '5px 0' }}>
                        {item.value} פעולות ({percentage}%)
                    </p>

                    {/* אם נבחרו יוזרים, הצג פילוח לפי יוזר */}
                    {selectedUsers && selectedUsers.length > 0 && item.userBreakdown && (
                        <div style={{ marginTop: '5px', borderTop: '1px solid #eee', paddingTop: '5px' }}>
                            <p style={{ fontWeight: 'bold', fontSize: '12px', marginBottom: '5px' }}>
                                פילוח לפי משתמשים:
                            </p>
                            {Object.entries(item.userBreakdown).map(([userId, count]) => (
                                <p key={userId} style={{ fontSize: '12px', margin: '2px 0' }}>
                                    {usersMap[userId] || userId}: {count} ({((count / item.value) * 100).toFixed(1)}%)
                                </p>
                            ))}
                        </div>
                    )}
                </div>
            );
        }
        return null;
    };

    // יצירת תוויות מותאמות אישית
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        if (percent < 0.05) return null; // לא להציג תוויות לפלחים קטנים מדי

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

    // יצירת מקרא מותאם אישית
    const CustomLegend = ({ payload, chartType }) => {
        const total = totals[chartType];

        return (
            <div style={{ maxHeight: '200px', overflowY: 'auto', paddingRight: '5px' }}>
                <ul style={{ listStyle: 'none', padding: 0, fontSize: '12px' }}>
                    {payload.map((entry, index) => {
                        const item = chartType === 'category'
                            ? categoryData.find(d => d.name === entry.value)
                            : chartType === 'subcategory'
                                ? subcategoryData.find(d => d.name === entry.value)
                                : itemData.find(d => d.name === entry.value);

                        const percentage = item ? ((item.value / total) * 100).toFixed(1) : 0;

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
                                        (chartType === 'category' && entry.value === selectedCategory) ||
                                            (chartType === 'subcategory' && entry.value === selectedSubcategory)
                                            ? 'rgba(0,0,0,0.05)' : 'transparent'
                                }}
                                onClick={() => {
                                    if (chartType === 'category') {
                                        setSelectedCategory(entry.value);
                                        setSelectedSubcategory(null);
                                    } else if (chartType === 'subcategory') {
                                        setSelectedSubcategory(entry.value);
                                    }
                                }}
                            >
                                <div
                                    style={{
                                        width: '10px',
                                        height: '10px',
                                        backgroundColor: entry.color,
                                        marginRight: '5px',
                                        borderRadius: '2px'
                                    }}
                                />
                                <span style={{
                                    fontWeight:
                                        (chartType === 'category' && entry.value === selectedCategory) ||
                                            (chartType === 'subcategory' && entry.value === selectedSubcategory)
                                            ? 'bold' : 'normal'
                                }}>
                                    {entry.value.length > 15 ? entry.value.substring(0, 15) + '...' : entry.value} ({percentage}%)
                                </span>
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    };

    // רכיב טעינה
    const LoadingIndicator = () => (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '200px'
        }}>
            <div style={{
                border: '4px solid #f3f3f3',
                borderTop: '4px solid #3498db',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                animation: 'spin 2s linear infinite'
            }} />
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );

    // רכיב כפתור איפוס
    const ResetButton = ({ onClick, label }) => (
        <button
            onClick={onClick}
            style={{
                background: 'none',
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '3px 8px',
                fontSize: '12px',
                cursor: 'pointer',
                marginLeft: '10px'
            }}
        >
            {label || 'איפוס'}
        </button>
    );

    return (
        <div style={{
            marginTop: 40,
            backgroundColor: '#f9f9f9',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
        }}>
            <h2 style={{
                borderBottom: '1px solid #eee',
                paddingBottom: '10px',
                marginBottom: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <span>התפלגות פעולות לפי רמות</span>
                {selectedUsers && selectedUsers.length > 0 && (
                    <span style={{
                        fontSize: '14px',
                        fontWeight: 'normal',
                        backgroundColor: '#e3f2fd',
                        padding: '5px 10px',
                        borderRadius: '4px'
                    }}>
                        מסונן לפי {selectedUsers.length} משתמשים
                    </span>
                )}
            </h2>

            {/* Breadcrumbs */}
            <div style={{
                marginBottom: '20px',
                padding: '8px 15px',
                backgroundColor: '#fff',
                borderRadius: '4px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                fontSize: '14px'
            }}>
                <span>ניווט: </span>
                <span
                    style={{
                        cursor: 'pointer',
                        color: selectedCategory ? '#0088FE' : '#333',
                        fontWeight: !selectedCategory && !selectedSubcategory ? 'bold' : 'normal'
                    }}
                    onClick={() => {
                        setSelectedCategory(null);
                        setSelectedSubcategory(null);
                    }}
                >
                    כל הקטגוריות
                </span>

                {selectedCategory && (
                    <>
                        <span style={{ margin: '0 8px' }}>&gt;</span>
                        <span
                            style={{
                                cursor: 'pointer',
                                color: selectedSubcategory ? '#00C49F' : '#333',
                                fontWeight: selectedCategory && !selectedSubcategory ? 'bold' : 'normal'
                            }}
                            onClick={() => {
                                setSelectedSubcategory(null);
                            }}
                        >
                            {selectedCategory}
                        </span>
                    </>
                )}

                {selectedSubcategory && (
                    <>
                        <span style={{ margin: '0 8px' }}>&gt;</span>
                        <span style={{ fontWeight: 'bold' }}>
                            {selectedSubcategory}
                        </span>
                    </>
                )}
            </div>

            <div style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                gap: '20px'
            }}>
                {/* עוגה 1: קטגוריות */}
                <div style={{
                    flex: '1 1 30%',
                    minWidth: '300px',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    padding: '15px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '15px'
                    }}>
                        <h3 style={{ margin: 0 }}>קטגוריות</h3>
                        {selectedCategory && (
                            <ResetButton
                                onClick={() => {
                                    setSelectedCategory(null);
                                    setSelectedSubcategory(null);
                                }}
                                label="נקה בחירה"
                            />
                        )}
                    </div>

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
                                        onClick={(data) => setSelectedCategory(data.name)}
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

                {/* עוגה 2: תת-קטגוריות */}
                <div style={{
                    flex: '1 1 30%',
                    minWidth: '300px',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    padding: '15px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '15px'
                    }}>
                        <h3 style={{ margin: 0 }}>תת-קטגוריות {selectedCategory ? `(${selectedCategory})` : ''}</h3>
                        {selectedSubcategory && (
                            <ResetButton
                                onClick={() => setSelectedSubcategory(null)}
                                label="נקה בחירה"
                            />
                        )}
                    </div>

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
                            <div>בחר קטגוריה תחילה כדי להציג תתי-קטגוריות</div>
                        </div>
                    ) : subcategoryData.length === 0 ? (
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
                                <span style={{ fontWeight: 'bold' }}>סה"כ: {totals.subcategory} פעולות</span>
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
                                        onClick={(data) => setSelectedSubcategory(data.name)}
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

                {/* עוגה 3: פריטים */}
                <div style={{
                    flex: '1 1 30%',
                    minWidth: '300px',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    padding: '15px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '15px'
                    }}>
                        <h3 style={{ margin: 0 }}>פריטים {selectedSubcategory ? `(${selectedSubcategory})` : ''}</h3>
                    </div>

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
                            <div>בחר קטגוריה ותת-קטגוריה תחילה כדי להציג פריטים</div>
                        </div>
                    ) : itemData.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '20px', color: 'gray' }}>
                            אין נתונים להצגה עבור {selectedSubcategory}
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
                                        {itemData.map((entry, index) => (
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

