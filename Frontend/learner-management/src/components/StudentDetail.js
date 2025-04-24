import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ModuleSection from './ModuleSection';
import './StudentDetail.css';
import styled from 'styled-components';

const StyledButton = styled.button`
  padding: 12px 24px;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 0 8px;
  min-width: 150px;
  text-align: center;
  position: relative;
  overflow: hidden;
  color: white;
`;

const PrimaryButton = styled(StyledButton)`
  background: #4CAF50;
  border-radius: 20px;
  box-shadow: 0 4px 6px rgba(76, 175, 80, 0.2);

  &:hover {
    background: #45a049;
    box-shadow: 0 6px 8px rgba(76, 175, 80, 0.3);
    transform: translateY(-2px);
  }
`;

const SecondaryButton = styled(StyledButton)`
  background: #2196F3;
  clip-path: polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%);
  box-shadow: 0 4px 6px rgba(33, 150, 243, 0.2);

  &:hover {
    background: #1976D2;
    box-shadow: 0 6px 8px rgba(33, 150, 243, 0.3);
    transform: translateY(-2px);
  }
`;

const AccentButton = styled(StyledButton)`
  background: #FF9800;
  border-radius: 0 15px 15px 0;
  box-shadow: 0 4px 6px rgba(255, 152, 0, 0.2);

  &:hover {
    background: #F57C00;
    box-shadow: 0 6px 8px rgba(255, 152, 0, 0.3);
    transform: translateY(-2px);
  }
`;

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
        <PrimaryButton onClick={handleSendReminder}>Send Reminder</PrimaryButton>
        <SecondaryButton onClick={() => navigate(`/counselling/${learnerId}`)}>Counselling</SecondaryButton>
        <AccentButton onClick={() => navigate(`/solution/${learnerId}`)}>Solution</AccentButton>
      </div>
    </div>
  );
};

export default StudentDetail;