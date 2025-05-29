import React from 'react';

/**
 * Advanced Time Range Filter Component
 * Allows selection of predefined time ranges with modern design
 */
const TimeRangeFilter = ({ timeRange, setTimeRange }) => {
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
            onClick={() => setTimeRange(option.value)}
            className={`group relative px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center gap-2 min-w-fit ${timeRange === option.value
                ? `bg-gradient-to-r ${option.color} text-white shadow-lg transform scale-105 ring-2 ring-offset-2 ring-blue-300`
                : 'bg-white/70 text-gray-600 border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md hover:transform hover:scale-[1.02]'
              }`}
            title={option.description}
          >
            {/* Background animation effect */}
            {timeRange !== option.value && (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-400/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 rounded-lg"></div>
            )}

            {/* Icon */}
            <span className="text-base relative z-10">{option.icon}</span>

            {/* Label */}
            <span className="relative z-10 whitespace-nowrap">{option.label}</span>

            {/* Active indicator */}
            {timeRange === option.value && (
              <span className="text-xs bg-white/20 rounded-full w-5 h-5 flex items-center justify-center animate-bounce-subtle">
                ✓
              </span>
            )}

            {/* Glow effect for active button */}
            {timeRange === option.value && (
              <div className={`absolute inset-0 bg-gradient-to-r ${option.color} rounded-lg blur-sm opacity-30 -z-10`}></div>
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
