import React from 'react';

function ActionButton({ actionName, label, userId, onActionSent }) {
    const handleClick = () => {
        fetch('http://localhost:8080/track', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: userId,
                action: actionName,
                timestamp: new Date().toISOString(),
            }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to send action');
                }
                console.log(`Action "${actionName}" sent successfully`);
                if (onActionSent) {
                    onActionSent(); // Call the callback function if provided
                }
            })
            .catch(error => {
                console.error('Error sending action:', error);
            });
    };

    return (
        <button onClick={handleClick} style={{ margin: '10px', padding: '10px 20px' }}>
            {label}
        </button>
    );
}

export default ActionButton;
