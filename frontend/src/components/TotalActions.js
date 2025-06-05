import React, { useEffect, useState } from 'react';
import config from '../config/config';

function TotalActions({ refreshTrigger }) {
    const [totalActions, setTotalActions] = useState(null);

    useEffect(() => {
        fetch(`${config.API_BASE_URL}${config.ENDPOINTS.TRACK.STATS.COUNT}`)
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
