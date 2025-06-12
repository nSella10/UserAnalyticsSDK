import React, { useCallback } from 'react';

/**
 * Advanced Time Range Filter Component
 * Allows selection of predefined time ranges with modern design
 */
const TimeRangeFilter = ({ timeRange, setTimeRange }) => {
  const handleTimeRangeChange = useCallback((value) => {
    console.log('🔄 TimeRange changing from', timeRange, 'to', value);
    setTimeRange(value);
  }, [timeRange, setTimeRange]);

  const timeOptions = [
    {
      value: 'all',
      label: 'All Time',
      icon: '🌐',
      description: 'All available data',
      color: 'from-gray-500 to-gray-600'
    },
    {
      value: 'day',
      label: 'Last 24h',
      icon: '📅',
      description: 'Last 24 hours',
      color: 'from-blue-500 to-blue-600'
    },
    {
      value: 'week',
      label: 'Last Week',
      icon: '📊',
      description: 'Last 7 days',
      color: 'from-purple-500 to-purple-600'
    },
    {
      value: 'month',
      label: 'Last Month',
      icon: '📈',
      description: 'Last 30 days',
      color: 'from-green-500 to-green-600'
    }
  ];

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm">
      {/* Filter Label */}
      <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 min-w-fit">
        <span className="text-lg">⏰</span>
        <span className="hidden sm:inline">Time Range:</span>
        <span className="sm:hidden">Filter:</span>
      </div>

      {/* Time Options */}
      <div className="flex flex-wrap gap-2 w-full sm:w-auto">
        {timeOptions.map((option) => (
          <button
            key={option.value}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleTimeRangeChange(option.value);
            }}
            className={`px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 min-w-fit cursor-pointer select-none ${timeRange === option.value
              ? `bg-gradient-to-r ${option.color} text-white shadow-lg`
              : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600'
              }`}
            title={option.description}
            type="button"
          >
            {/* Icon */}
            <span className="text-base">{option.icon}</span>

            {/* Label */}
            <span className="whitespace-nowrap">{option.label}</span>

            {/* Active indicator */}
            {timeRange === option.value && (
              <span className="text-xs bg-white/20 rounded-full w-5 h-5 flex items-center justify-center">
                ✓
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Active filter description */}
      {timeRange !== 'all' && (
        <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full whitespace-nowrap animate-fade-in">
          {timeOptions.find(opt => opt.value === timeRange)?.description}
        </div>
      )}
    </div>
  );
};

export default TimeRangeFilter;
