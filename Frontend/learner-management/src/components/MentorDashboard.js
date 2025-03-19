import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MentorDashboard = () => {
  const navigate = useNavigate();
  const [assignedLearners, setAssignedLearners] = useState([]);
  const [searchName, setSearchName] = useState('');

  useEffect(() => {
    // Mock data for assigned learners (replace with backend API call)
    const mockLearners = [
      { id: '1', name: 'John Doe', email: 'john@example.com', attendance: '85 %', mentorId: 'M1', soc: '2025-01-01', eoc: '2025-06-30', risk: 'On Track' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com', attendance: '60 %', mentorId: 'M1', soc: '2025-02-01', eoc: '2025-07-31', risk: 'At Risk' },
    ];
    const currentMentorId = 'M1';
    const learners = mockLearners.filter(learner => learner.mentorId === currentMentorId);
    setAssignedLearners(learners);

    if (learners.some(learner => learner.risk === 'At Risk')) {
      toast.warning('You have at-risk learners to address!', {
        position: 'top-right',
        autoClose: 5000,
      });
    }
  }, []);

  const handleRiskClick = (learnerId) => {
    navigate(`/student-details/${learnerId}`);
  };

  const filteredLearners = assignedLearners.filter(learner =>
    learner.name.toLowerCase().includes(searchName.toLowerCase())
  );

  return (
    <div className="container">
      <h1>Mentor Dashboard 2025</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by Learner Name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
      </div>
      {filteredLearners.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Learner ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Attendance (%)</th>
              <th>SOC</th>
              <th>EOC</th>
              <th>Risk</th>
            </tr>
          </thead>
          <tbody>
            {filteredLearners.map((learner) => (
              <tr key={learner.id}>
                <td>{learner.id}</td>
                <td>{learner.name}</td>
                <td>{learner.email}</td>
                <td>{learner.attendance}</td>
                <td>{learner.soc}</td>
                <td>{learner.eoc}</td>
                <td>
                  <button
                    className={learner.risk === 'On Track' ? 'btn-secondary' : 'btn-accent'}
                    onClick={() => handleRiskClick(learner.id)}
                  >
                    {learner.risk}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ color: '#EDEDED', textAlign: 'center' }}>No assigned learners found.</p>
      )}
    </div>
  );
};

export default MentorDashboard;