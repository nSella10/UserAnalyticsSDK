import React, { useState, useEffect } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
    Legend
} from 'recharts';


function ActionByDate({ refreshTrigger }) {
    const [dateCounts, setDateCounts] = useState({});

    useEffect(() => {
        fetch('http://localhost:8080/track/stats/by-date')
            .then(response => response.json())
            .then(data => setDateCounts(data))
            .catch(error => console.error('Error fetching date stats:', error));
    }, [refreshTrigger]);

    const chartData = Object.entries(dateCounts).map(([date, count]) => ({
        date,
        count
    }));

    const charData = Object.entries(dateCounts).map(([date, count]) => ({ date, count }));


    return (
        <div style={{ marginTop: '60px' }}>
            <h2>Actions Over Time</h2>
            <div style={{
                width: '90%',
                height: 350,
                margin: '0 auto',
                background: '#f9f9f9',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
            }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'white',
                                border: '1px solid #ccc',
                                borderRadius: '8px'
                            }}
                            labelStyle={{ fontWeight: 'bold' }}
                        />
                        <Legend verticalAlign="top" height={36} />
                        <Line
                            type="monotone"
                            dataKey="count"
                            stroke="#4f46e5"
                            strokeWidth={3}
                            dot={{ r: 6, strokeWidth: 2, fill: 'white', stroke: '#4f46e5' }}
                            activeDot={{ r: 8 }}
                            name="Clicks Over Time"
                            animationDuration={1000}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}


export default ActionByDate;