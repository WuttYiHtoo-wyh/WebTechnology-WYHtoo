import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './MentorDashboard.css';

const MentorDashboard = () => {
  const navigate = useNavigate();
  const [attendanceData, setAttendanceData] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await axios.get('http://localhost:8000/api/student-attendance', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        
        if (response.data.success) {
          setAttendanceData(response.data.data);
          setError(null);
        } else {
          setError(response.data.message || 'Failed to fetch attendance data');
        }
      } catch (error) {
        console.error('Error fetching attendance data:', error);
        setError(error.response?.data?.message || 'Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'mentor') {
      navigate('/login');
    }
  }, [navigate]);

  const handleRiskClick = (studentId) => {
    navigate(`/student-details/${studentId}`);
  };

  const filteredStudents = attendanceData.filter(student =>
    student['Name'].toLowerCase().includes(searchName.toLowerCase())
  );

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading attendance data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Learner Attendance Dashboard</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search learners..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="stat-box">
          <span className="stat-label">Total Learners</span>
          <span className="stat-value">{filteredStudents.length}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">At Risk</span>
          <span className="stat-value warning">
            {filteredStudents.filter(s => s['Status'] === 'At Risk').length}
          </span>
        </div>
        <div className="stat-box">
          <span className="stat-label">On Track</span>
          <span className="stat-value success">
            {filteredStudents.filter(s => s['Status'] === 'OnTrack').length}
          </span>
        </div>
      </div>

      <div className="attendance-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Module</th>
              <th>Duration</th>
              <th>Present</th>
              <th>Absent</th>
              <th>Attendance</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student, index) => (
              <tr key={index}>
                <td>{student['Name']}</td>
                <td>{student['Module']}</td>
                <td>
                  {student['Start Date'] ? new Date(student['Start Date']).toLocaleDateString('en-GB') : 'N/A'} - 
                  {student['End Date'] ? new Date(student['End Date']).toLocaleDateString('en-GB') : 'N/A'}
                </td>
                <td>{student['Present Days'] || 0}</td>
                <td>{student['Absent Days'] || 0}</td>
                <td>{student['Attendance (%)'] || 0}%</td>
                <td>
                  <button 
                    className={`status-button ${student['Status'] === 'At Risk' ? 'status-at-risk' : 'status-ontrack'}`}
                    onClick={() => handleRiskClick(student['Learner ID'])}
                  >
                    {student['Status']}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredStudents.length === 0 && (
        <div className="no-data-message">
          <p>No learners found matching your search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default MentorDashboard;