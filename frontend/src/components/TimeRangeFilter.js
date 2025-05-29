import React from 'react';

/**
 * רכיב לסינון לפי טווח זמן
 * מאפשר בחירת טווחי זמן מוגדרים מראש: הכל, יום, שבוע, חודש
 */
const TimeRangeFilter = ({ timeRange, setTimeRange }) => {
  return (
    <div style={{ display: 'flex', gap: '10px' }}>
      <button
        onClick={() => setTimeRange('all')}
        style={{
          padding: '5px 10px',
          backgroundColor: timeRange === 'all' ? '#0088FE' : '#f0f0f0',
          color: timeRange === 'all' ? 'white' : 'black',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        הכל
      </button>
      <button
        onClick={() => setTimeRange('day')}
        style={{
          padding: '5px 10px',
          backgroundColor: timeRange === 'day' ? '#0088FE' : '#f0f0f0',
          color: timeRange === 'day' ? 'white' : 'black',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        יום
      </button>
      <button
        onClick={() => setTimeRange('week')}
        style={{
          padding: '5px 10px',
          backgroundColor: timeRange === 'week' ? '#0088FE' : '#f0f0f0',
          color: timeRange === 'week' ? 'white' : 'black',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        שבוע
      </button>
      <button
        onClick={() => setTimeRange('month')}
        style={{
          padding: '5px 10px',
          backgroundColor: timeRange === 'month' ? '#0088FE' : '#f0f0f0',
          color: timeRange === 'month' ? 'white' : 'black',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        חודש
      </button>
    </div>
  );
};

export default TimeRangeFilter;
