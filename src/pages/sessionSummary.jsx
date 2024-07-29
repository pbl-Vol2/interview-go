import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function SessionSummary() {
  const { uniqueId } = useParams(); // Retrieve the uniqueId from the URL
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null); // State to hold the user ID

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/get_user_id', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserId(response.data.user_id); // Set the user ID from the response
      } catch (error) {
        console.error('Error fetching user ID:', error);
        setError('Failed to load user ID.');
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId && uniqueId) {
      const fetchSummary = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`http://localhost:5000/get_summary/${userId}/${uniqueId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setSummary(response.data);
        } catch (error) {
          console.error('Error fetching summary:', error.response ? error.response.data : error.message);
          setError('Failed to load summary.');
        }
      };

      fetchSummary();
    }
  }, [uniqueId, userId]);

  return (
    <div className="summary-container">
      {error && <div className="error-message">{error}</div>}
      {summary ? (
        <pre>{JSON.stringify(summary, null, 2)}</pre> // Display summary in JSON format
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}

export default SessionSummary;
