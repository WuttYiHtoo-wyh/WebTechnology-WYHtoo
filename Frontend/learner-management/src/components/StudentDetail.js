import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ModuleSection from './ModuleSection';
import './StudentDetail.css';

const StudentDetail = () => {
  const { learnerId } = useParams();
  const navigate = useNavigate();
  const [completedModules, setCompletedModules] = useState([]);
  const [ongoingModules, setOngoingModules] = useState([]);
  const [upcomingModules, setUpcomingModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const headers = {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        };

        // Fetch all module types
        const [completedResponse, ongoingResponse, upcomingResponse] = await Promise.all([
          axios.get(`http://localhost:8000/api/student/${learnerId}/completed-modules`, { headers }),
          axios.get(`http://localhost:8000/api/student/${learnerId}/ongoing-modules`, { headers }),
          axios.get(`http://localhost:8000/api/student/${learnerId}/upcoming-modules`, { headers })
        ]);

        if (completedResponse.data.success && ongoingResponse.data.success && upcomingResponse.data.success) {
          setCompletedModules(completedResponse.data.data);
          setOngoingModules(ongoingResponse.data.data);
          setUpcomingModules(upcomingResponse.data.data);
          setError(null);
        } else {
          setError('Failed to fetch module data');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.response?.data?.message || 'Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [learnerId]);

  const handleSendReminder = () => {
    window.location.href = `mailto:?subject=Reminder for Learner ${learnerId}`;
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="student-detail-container">
      <h1>Student Details (ID: {learnerId})</h1>
      <div className="modules-container">
        <ModuleSection title="Completed Modules" modules={completedModules} />
        <ModuleSection title="Ongoing Modules" modules={ongoingModules} />
        <ModuleSection title="Upcoming Modules" modules={upcomingModules} />
      </div>
      <div className="action-buttons">
        <button className="btn-primary" onClick={handleSendReminder}>Send Reminder</button>
        <button className="btn-secondary" onClick={() => navigate(`/counselling/${learnerId}`)}>Counselling</button>
        <button className="btn-accent" onClick={() => navigate(`/solution/${learnerId}`)}>Solution</button>
      </div>
    </div>
  );
};

export default StudentDetail;