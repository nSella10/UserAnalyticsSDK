import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import TimeRangeFilter from './TimeRangeFilter';
import TimeRangeUtils from '../utils/TimeRangeUtils';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#bb6bd9', '#f44336', '#4caf50', '#e91e63'];

function CategoryPieChart({ selectedUsers }) {
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [timeRange, setTimeRange] = useState('all'); // 'all', 'day', 'week', 'month'

    useEffect(() => {
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
                }));

                // חישוב סך כל הפעולות
                const totalActions = formatted.reduce((sum, item) => sum + item.value, 0);
                setTotal(totalActions);
                setData(formatted);
            })
            .catch(console.error);
    }, [selectedUsers, timeRange]);

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
        <div style={{ marginTop: 40 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h2>התפלגות פעולות לפי קטגוריה</h2>

                {/* רכיב סינון לפי זמן */}
                <TimeRangeFilter timeRange={timeRange} setTimeRange={setTimeRange} />
            </div>

            {data.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px', color: 'gray' }}>
                    אין נתונים להצגה
                </div>
            ) : (
                <div>
                    <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                        <span style={{ fontWeight: 'bold' }}>סה"כ פעולות: {total}</span>
                        {timeRange !== 'all' && (
                            <span style={{ marginRight: '10px', fontSize: '14px', color: '#666' }}>
                                ({TimeRangeUtils.getTimeRangeDescription(timeRange)})
                            </span>
                        )}
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={renderCustomizedLabel}
                                outerRadius={120}
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
                                layout="vertical"
                                verticalAlign="middle"
                                align="right"
                                formatter={(value, entry) => {
                                    const item = data.find(d => d.name === value);
                                    const percentage = item ? ((item.value / total) * 100).toFixed(1) : 0;
                                    return `${value} (${percentage}%)`;
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}

export default CategoryPieChart;