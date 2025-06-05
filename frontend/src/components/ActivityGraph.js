import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from "recharts";
import config from '../config/config';


function ActivityGraph({ selectUser }) {
    const [timeRange, setTimeRange] = useState('day');
    const [chartData, setChartData] = useState([]);

    // get the data from server
    const fetchData = () => {
        let url = selectUser
            ? `${config.API_BASE_URL}${config.ENDPOINTS.TRACK.STATS.BY_USER_BY_DATE}?userId=${selectUser}`
            : `${config.API_BASE_URL}${config.ENDPOINTS.TRACK.STATS.BY_DATE}`;



        fetch(url)
            .then(res => res.json())
            .then(data => {
                const entries = Object.entries(data);
                const filtered = filterByTimeRange(entries, timeRange);

                const formatted = filtered.map(([date, count]) => ({
                    date,
                    count
                }));
                setChartData(formatted);
            })
            .catch(err => console.error("Error fetching data: ", err));
    };

    // filter the data by time range
    const filterByTimeRange = (entries, range) => {
        const now = new Date();
        return entries.filter(([dateStr]) => {
            const date = new Date(dateStr);
            const diffDays = (now - date) / (1000 * 60 * 60 * 24);
            if (range === 'day') return diffDays <= 1;
            if (range === 'week') return diffDays <= 7;
            if (range === 'month') return diffDays <= 30;
            return true;
        });
    };

    useEffect(() => {
        fetchData();
    }, [selectUser, timeRange]);

    return (
        <div style={{ marginTop: '1000px,', padding: '50px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
            <h2>Activity Over Time</h2>

            <div style={{ marginBottom: '20px', display: 'flex' }}>
                <button onClick={() => setTimeRange('day')} style={{ margin: '5px' }}>Day</button>
                <button onClick={() => setTimeRange('week')} style={{ margin: '5px' }}>Week</button>
                <button onClick={() => setTimeRange('month')} style={{ margin: '5px' }}>Month</button>

            </div>

            <div style={{
                width: '100%', height: 300, backgroundColor: '#fff', borderRadius: '8px', padding: '20px'
            }}>
                <ResponsiveContainer width="100%" height={100}>
                    <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tickFormatter={(tick) => new Date(tick).toLocaleDateString()} />
                        <YAxis />
                        <Tooltip formatter={(value) => [value, "Actions"]} labelFormatter={(label) => new Date(label).toLocaleDateString()} />
                        <Legend verticalAlign="top" height={36} />
                        <Line
                            type="monotone"
                            dataKey="count"
                            stroke="#82ca9d"
                            strokeWidth={3}
                            dot={{ r: 5 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    )


}
export default ActivityGraph;
