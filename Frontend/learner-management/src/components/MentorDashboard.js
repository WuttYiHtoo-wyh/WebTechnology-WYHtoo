import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

        const response = await fetch('http://127.0.0.1:8000/api/student-attendance', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
          throw new Error('Session expired. Please login again.');
        }

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch attendance data');
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error('Invalid data format received from server');
        }

        setAttendanceData(data);
        setError(null);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, [navigate]);

  useEffect(() => {
    // Check if user is authenticated and is a mentor
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'mentor') {
      navigate('/login');
    }
  }, [navigate]);

  const handleRiskClick = (studentId) => {
    navigate(`/student-details/${studentId}`);
  };

  const filteredStudents = attendanceData.filter(student =>
    student.name.toLowerCase().includes(searchName.toLowerCase())
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
      <div className="content-container">
        <h1>Mentor Dashboard</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by Learner Name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="search-input"
          />
        </div>
        {filteredStudents.length > 0 ? (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Learner ID</th>
                  <th>Name</th>
                  <th>Module</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Present Days</th>
                  <th>Absent Days</th>
                  <th>Attendance (%)</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.student_id}>
                    <td>{student.student_id}</td>
                    <td>{student.name}</td>
                    <td>{student.module_name}</td>
                    <td>{student.start_date ? new Date(student.start_date).toLocaleDateString() : 'N/A'}</td>
                    <td>{student.end_date ? new Date(student.end_date).toLocaleDateString() : 'N/A'}</td>
                    <td>{student.present_days}</td>
                    <td>{student.absent_days}</td>
                    <td>{student.attendance_percentage}%</td>
                    <td>
                      <button
                        className={`status-button ${student.status === 'On Track Learner' ? 'on-track' : 'at-risk'}`}
                        onClick={() => handleRiskClick(student.student_id)}
                      >
                        {student.status}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-data-message">
            <p>No learners found matching your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorDashboard;