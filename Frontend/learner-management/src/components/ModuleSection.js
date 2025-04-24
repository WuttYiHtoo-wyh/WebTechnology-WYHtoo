import React from 'react';
import './ModuleSection.css';

const ModuleSection = ({ title, modules }) => {
  return (
    <div className="module-section">
      <div className="module-header">
        <h2>{title}</h2>
        <span className="expand-icon">▲</span>
      </div>
      <div className="module-content">
        <table>
          <thead>
            <tr>
              <th>MODULE NAME</th>
              <th>ATTENDANCE (%)</th>
              <th>COMPLETION DATE</th>
              <th>RESULT</th>
            </tr>
          </thead>
          <tbody>
            {modules.map((module, index) => (
              <tr key={index}>
                <td>{module['MODULE NAME']}</td>
                <td>{module['ATTENDANCE (%)']}</td>
                <td>{new Date(module['COMPLETION DATE']).toLocaleDateString('en-GB')}</td>
                <td>
                  <span className={`status-badge ${module['RESULT'].toLowerCase()}`}>
                    {module['RESULT']}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ModuleSection;