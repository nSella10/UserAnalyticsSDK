import React, { useEffect, useState } from 'react';

function TotalActions(refreshTrigger) {
    const [totalActions, setTotalActions] = useState(null);

    useEffect(() => {
        fetch('http://localhost:8080/track/stats/count')
            .then(response => response.json())
            .then(data => setTotalActions(data))
            .catch(error => console.error('Error fetching total actions:', error));
    }, [refreshTrigger]);

    return (
        <div>
            <h2>Total Actions: {totalActions !== null ? totalActions : 'Loading...'}</h2>
        </div>
    );
}

export default TotalActions;
