import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ModuleSection from './ModuleSection';

const StudentDetail = () => {
  const { learnerId } = useParams();
  const navigate = useNavigate();

  const studentData = {
    id: learnerId,
    completedModules: [{ name: 'CS101', attendance: 90, completionDate: '2025-02-15', result: 'Pass' }],
    ongoingModules: [{ name: 'CS102', attendance: 60, completionDate: '', result: '' }],
    upcomingModules: [{ name: 'CS103', attendance: 0, completionDate: '', result: '' }],
  };

  const handleSendReminder = () => {
    window.location.href = `mailto:?subject=Reminder for Learner ${learnerId}`;
  };

  return (
    <div className="container">
      <h1>Student Details (ID: {learnerId})</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        <ModuleSection title="Completed Modules" modules={studentData.completedModules} />
        <ModuleSection title="Ongoing Modules" modules={studentData.ongoingModules} />
        <ModuleSection title="Upcoming Modules" modules={studentData.upcomingModules} />
      </div>
      <div style={{ marginTop: '30px', display: 'flex', gap: '15px', justifyContent: 'center' }}>
        <button className="btn-primary" onClick={handleSendReminder}>Send Reminder</button>
        <button className="btn-secondary" onClick={() => navigate(`/counselling/${learnerId}`)}>Counselling</button>
        <button className="btn-accent" onClick={() => navigate(`/solution/${learnerId}`)}>Solution</button>
      </div>
    </div>
  );
};

export default StudentDetail;