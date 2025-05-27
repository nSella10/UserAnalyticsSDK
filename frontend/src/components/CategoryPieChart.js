// components/CategoryPieChart.js
import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#bb6bd9', '#f44336', '#4caf50', '#e91e63'];

function CategoryPieChart() {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8080/track/stats/by-category')
            .then(res => res.json())
            .then(json => {
                const formatted = Object.entries(json).map(([category, count]) => ({
                    name: category,
                    value: count
                }));
                setData(formatted);
            })
            .catch(console.error);
    }, []);

    return (
        <div style={{ marginTop: 40 }}>
            <h2>Category Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {data.map((_, index) => (
                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}

export default CategoryPieChart;
