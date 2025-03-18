import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  const [searchName, setSearchName] = useState('');
  const [searchModule, setSearchModule] = useState('');

  const learners = [
    { moduleCode: 'CS101', name: 'John Doe', email: 'john@example.com', attendance: 85, soc: '2025-01-01', eoc: '2025-06-30', risk: 'On Track', id: 1 },
    { moduleCode: 'CS102', name: 'Jane Smith', email: 'jane@example.com', attendance: 60, soc: '2025-02-01', eoc: '2025-07-31', risk: 'At Risk', id: 2 },
  ];

  const filteredLearners = learners.filter(learner =>
    learner.name.toLowerCase().includes(searchName.toLowerCase()) &&
    learner.moduleCode.toLowerCase().includes(searchModule.toLowerCase())
  );

  const handleRiskClick = (learnerId) => {
    navigate(`/student-details/${learnerId}`);
  };

  return (
    <div className="container">
      <h1>Learner Dashboard 2025</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by Learner Name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search by Module Code"
          value={searchModule}
          onChange={(e) => setSearchModule(e.target.value)}
        />
      </div>
      <table>
        <thead>
          <tr>
            <th>Module Code</th>
            <th>Learner Name</th>
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
              <td>{learner.moduleCode}</td>
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
    </div>
  );
};

export default HomePage;