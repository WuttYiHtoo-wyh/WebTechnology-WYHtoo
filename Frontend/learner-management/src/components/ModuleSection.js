import React, { useState } from 'react';

const ModuleSection = ({ title, modules }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div style={{ backgroundColor: '#2E3536', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(255, 140, 90, 0.2)' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{ width: '100%', textAlign: 'left', fontSize: '1.75rem', fontWeight: '600', color: '#EDEDED', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer' }}
      >
        {title}
        <span>{isOpen ? '▲' : '▼'}</span>
      </button>
      {isOpen && (
        <table>
          <thead>
            <tr>
              <th>Module Name</th>
              <th>Attendance (%)</th>
              <th>Completion Date</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {modules.map((module, index) => (
              <tr key={index}>
                <td>{module.name}</td>
                <td>{module.attendance}</td>
                <td>{module.completionDate || 'N/A'}</td>
                <td>{module.result || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ModuleSection;