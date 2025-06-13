import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import TimeRangeFilter from './TimeRangeFilter';
import TimeRangeUtils from '../utils/TimeRangeUtils';
import { buildApiUrl, API_ENDPOINTS, authenticatedFetch } from '../config/api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#bb6bd9', '#f44336', '#4caf50', '#e91e63'];

function CategoryPieChart({ selectedUsers }) {
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [timeRange, setTimeRange] = useState('all'); // 'all', 'day', 'week', 'month'
    const [screenSize, setScreenSize] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 1200,
        height: typeof window !== 'undefined' ? window.innerHeight : 800
    });

    // Track screen size for responsive design
    useEffect(() => {
        const handleResize = () => {
            setScreenSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const params = new URLSearchParams();
        if (selectedUsers && selectedUsers.length > 0) {
            selectedUsers.forEach(id => params.append('userIds', id));
        }

        // הוספת פרמטרים של טווח זמן
        TimeRangeUtils.addTimeRangeToParams(params, timeRange);

        const url = buildApiUrl(API_ENDPOINTS.TRACK_STATS_BY_CATEGORY);

        authenticatedFetch(`${url}?${params}`)
            .then(res => res.json())
            .then(json => {
                console.log('📊 Category pie chart data:', json);
                const formatted = Object.entries(json).map(([category, count]) => ({
                    name: category,
                    value: count
                }));

                // חישוב סך כל הפעולות
                const totalActions = formatted.reduce((sum, item) => sum + item.value, 0);
                setTotal(totalActions);
                setData(formatted);
            })
            .catch(error => {
                console.error('❌ Error fetching category data:', error);
                setData([]);
                setTotal(0);
            });
    }, [selectedUsers, timeRange]);

    // Responsive chart dimensions
    const getResponsiveSettings = () => {
        const width = screenSize.width;

        if (width < 640) { // Mobile Portrait
            return {
                height: 450,
                outerRadius: 80,
                cx: "50%",
                cy: "35%",
                legendLayout: "horizontal",
                legendAlign: "center",
                legendVerticalAlign: "bottom"
            };
        } else if (width < 768) { // Mobile Landscape / Small Tablet
            return {
                height: 500,
                outerRadius: 90,
                cx: "50%",
                cy: "32%",
                legendLayout: "horizontal",
                legendAlign: "center",
                legendVerticalAlign: "bottom"
            };
        } else if (width < 1024) { // Tablet
            return {
                height: 550,
                outerRadius: 105,
                cx: "50%",
                cy: "30%",
                legendLayout: "horizontal",
                legendAlign: "center",
                legendVerticalAlign: "bottom"
            };
        } else if (width < 1200) { // Small Desktop (like your 1080px screen)
            return {
                height: 600,
                outerRadius: 120,
                cx: "50%",
                cy: "28%",
                legendLayout: "horizontal",
                legendAlign: "center",
                legendVerticalAlign: "bottom"
            };
        } else if (width < 1440) { // Medium Desktop
            return {
                height: 650,
                outerRadius: 140,
                cx: "50%",
                cy: "26%",
                legendLayout: "horizontal",
                legendAlign: "center",
                legendVerticalAlign: "bottom"
            };
        } else if (width < 1920) { // Large Desktop
            return {
                height: 700,
                outerRadius: 160,
                cx: "50%",
                cy: "25%",
                legendLayout: "horizontal",
                legendAlign: "center",
                legendVerticalAlign: "bottom"
            };
        } else { // Extra Large Desktop (4K and above)
            return {
                height: 800,
                outerRadius: 190,
                cx: "50%",
                cy: "23%",
                legendLayout: "horizontal",
                legendAlign: "center",
                legendVerticalAlign: "bottom"
            };
        }
    };

    const responsiveSettings = getResponsiveSettings();

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const item = payload[0];
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

    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
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

    return (
        <div className="mt-10 p-3 md:p-4 lg:p-6 xl:p-8 bg-white/90 backdrop-blur-sm rounded-3xl border border-gray-200 shadow-xl min-h-[450px] md:min-h-[550px] lg:min-h-[650px] xl:min-h-[800px]">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6">
                <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-800">התפלגות פעולות לפי קטגוריה</h2>

                {/* רכיב סינון לפי זמן */}
                <TimeRangeFilter timeRange={timeRange} setTimeRange={setTimeRange} />
            </div>

            {data.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <span className="text-2xl opacity-50">📊</span>
                    </div>
                    <p className="text-sm font-medium text-gray-500">אין נתונים להצגה</p>
                    <p className="text-xs text-gray-400 mt-1">נסה לשנות את הפילטרים</p>
                </div>
            ) : (
                <div>
                    <div className="text-center mb-4">
                        <span className="font-bold text-gray-700">סה"כ פעולות: {total}</span>
                        {timeRange !== 'all' && (
                            <span className="mr-2 text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                ({TimeRangeUtils.getTimeRangeDescription(timeRange)})
                            </span>
                        )}
                    </div>
                    <div className="w-full overflow-hidden">
                        <ResponsiveContainer width="100%" height={responsiveSettings.height}>
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx={responsiveSettings.cx}
                                    cy={responsiveSettings.cy}
                                    labelLine={false}
                                    label={renderCustomizedLabel}
                                    outerRadius={responsiveSettings.outerRadius}
                                    fill="#8884d8"
                                    dataKey="value"
                                    animationDuration={800}
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend
                                    layout={responsiveSettings.legendLayout}
                                    verticalAlign={responsiveSettings.legendVerticalAlign}
                                    align={responsiveSettings.legendAlign}
                                    formatter={(value, entry) => {
                                        const item = data.find(d => d.name === value);
                                        const percentage = item ? ((item.value / total) * 100).toFixed(1) : 0;
                                        return `${value} (${percentage}%)`;
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CategoryPieChart;