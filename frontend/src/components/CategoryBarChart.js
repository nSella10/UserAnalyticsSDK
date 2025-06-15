import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from 'recharts';
import TimeRangeFilter from './TimeRangeFilter';
import TimeRangeUtils from '../utils/TimeRangeUtils';
import { buildApiUrl, API_ENDPOINTS, authenticatedFetch } from '../config/api';

const CategoryBarChart = ({ selectedUsers, selectedCategory, setSelectedCategory, selectedApp }) => {
  const [data, setData] = useState([]);
  const [viewMode, setViewMode] = useState('category');
  const [categories, setCategories] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [timeRange, setTimeRange] = useState('all'); // 'all', 'day', 'week', 'month'

  useEffect(() => {
    if (!selectedApp || !selectedApp.apiKey) return;

    const url = buildApiUrl(API_ENDPOINTS.TRACK_STATS_ALL_USERS, {
      apiKey: selectedApp.apiKey
    });

    authenticatedFetch(url)
      .then(res => res.json())
      .then(users => {
        const map = {};
        users.forEach(u => {
          map[u.id] = `${u.firstName} ${u.lastName}`;
        });
        setUsersMap(map);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }, [selectedApp]);

  useEffect(() => {
    if (viewMode === 'category' || !selectedApp || !selectedApp.apiKey) return;

    const params = new URLSearchParams();
    TimeRangeUtils.addTimeRangeToParams(params, timeRange);
    params.append('apiKey', selectedApp.apiKey);

    const url = buildApiUrl(API_ENDPOINTS.TRACK_STATS_BY_CATEGORY);

    authenticatedFetch(`${url}?${params}`)
      .then(res => res.json())
      .then(data => {
        const options = Object.keys(data);
        setCategories(options);
        if (options.length > 0 && !options.includes(selectedCategory)) {
          setSelectedCategory(options[0]);
        }
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
      });
  }, [viewMode, timeRange, selectedApp]);

  useEffect(() => {
    if (!selectedApp || !selectedApp.apiKey) return;

    if ((viewMode === 'subcategory' || viewMode === 'item') && !selectedCategory) {
      console.warn('No category selected yet – skipping fetch');
      return;
    }

    const params = new URLSearchParams();
    selectedUsers.forEach(id => params.append('userIds', id));
    if (selectedCategory && viewMode !== 'category') {
      params.append('category', selectedCategory);
    }

    // הוספת פרמטרים של טווח זמן
    TimeRangeUtils.addTimeRangeToParams(params, timeRange);
    params.append('apiKey', selectedApp.apiKey);

    const endpoint = viewMode === 'category'
      ? 'by-category-stacked'
      : viewMode === 'subcategory'
        ? 'by-subcategory'
        : 'by-item';

    const url = buildApiUrl(`/track/stats/${endpoint}`);

    authenticatedFetch(`${url}?${params}`)
      .then(res => res.json())
      .then(rawData => {
        const grouped = {};

        if (Array.isArray(rawData)) {
          rawData.forEach(row => {
            const key =
              viewMode === 'subcategory' ? row.subcategory :
                viewMode === 'item' ? row.item :
                  row.category;

            if (!grouped[key]) grouped[key] = {};
            grouped[key][row.userId] = row.count;
          });
        } else {
          Object.entries(rawData).forEach(([key, count]) => {
            grouped[key] = { total: count };
          });
        }

        const formatted = Object.entries(grouped).map(([name, userCounts]) => {
          const total = Object.values(userCounts).reduce((a, b) => a + b, 0);
          return { name, total, ...userCounts };
        });

        setData(formatted);
      })
      .catch(error => {
        console.error('Error fetching chart data:', error);
        setData([]);
      });
  }, [viewMode, selectedUsers, selectedCategory, timeRange, selectedApp]);

  const userIds = selectedUsers.length > 0
    ? selectedUsers
    : Array.from(new Set(data.flatMap(d => Object.keys(d).filter(k => !['name', 'total'].includes(k)))));

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || payload.length === 0) return null;
    const entry = payload[0]?.payload;
    const total = entry.total || 0;

    return (
      <div style={{ background: 'white', border: '1px solid #ccc', padding: '10px', borderRadius: '6px' }}>
        <strong>📂 {label}</strong><br />
        {selectedUsers.length > 0 ? (
          <>
            {userIds.map(uid => {
              const clicks = entry[uid] || 0;
              const percent = total > 0 ? ((clicks / total) * 100).toFixed(1) : 0;
              return (
                <div key={uid}>
                  👤 {usersMap[uid] || uid}: {clicks} clicks ({percent}%)
                </div>
              );
            })}
            <hr />
            <strong>סה"כ: {total}</strong>
          </>
        ) : (
          <div>סה"כ לחיצות: {total}</div>
        )}
      </div>
    );
  };

  return (
    <div style={{ marginTop: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h2>📊 Click Distribution by {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)}</h2>

        {/* רכיב סינון לפי זמן */}
        <TimeRangeFilter timeRange={timeRange} setTimeRange={setTimeRange} />
      </div>

      <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
        <button onClick={() => setViewMode('category')} style={{ marginRight: 8 }}>By Category</button>
        <button onClick={() => setViewMode('subcategory')} style={{ marginRight: 8 }}>By Subcategory</button>
        <button onClick={() => setViewMode('item')} style={{ marginRight: 15 }}>By Item</button>

        {timeRange !== 'all' && (
          <span style={{ fontSize: '14px', color: '#666' }}>
            מציג נתונים ל{TimeRangeUtils.getTimeRangeDescription(timeRange)}
          </span>
        )}
      </div>

      {(viewMode !== 'category') && (
        <div style={{ marginBottom: '10px' }}>
          <label>
            Category:
            <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} style={{ marginLeft: '10px' }}>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </label>
        </div>
      )}

      {data.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '20px', color: 'gray' }}>
          📭 No data to display for the selected filters.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            {selectedUsers.length > 0 ? (
              userIds.map(uid => (
                <Bar key={uid} dataKey={uid} stackId="a" fill="#8884d8" name={usersMap[uid] || uid} />
              ))
            ) : (
              <Bar dataKey="total" fill="#8884d8" name="Total" />
            )}
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default CategoryBarChart;