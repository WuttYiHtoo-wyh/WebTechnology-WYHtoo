import React, { useState } from 'react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [searchName, setSearchName] = useState('');
  const [searchModule, setSearchModule] = useState('');

  // Mock data for learners
  const learners = [
    {
      id: 1,
      moduleCode: 'MATH101',
      name: 'John Doe',
      email: 'john@example.com',
      attendance: '85%',
      soc: '75%',
      eoc: '80%',
      risk: 'On Track'
    },
    {
      id: 2,
      moduleCode: 'PHY101',
      name: 'Jane Smith',
      email: 'jane@example.com',
      attendance: '92%',
      soc: '88%',
      eoc: '90%',
      risk: 'On Track'
    },
    {
      id: 3,
      moduleCode: 'CHEM101',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      attendance: '65%',
      soc: '60%',
      eoc: '55%',
      risk: 'At Risk'
    }
  ];

  const filteredLearners = learners.filter(learner => 
    learner.name.toLowerCase().includes(searchName.toLowerCase()) &&
    learner.moduleCode.toLowerCase().includes(searchModule.toLowerCase())
  );

  const handleRiskClick = (learnerId) => {
    // Handle risk button click
    console.log(`Risk button clicked for learner ${learnerId}`);
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

export default AdminDashboard; 