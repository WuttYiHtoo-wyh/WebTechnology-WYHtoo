import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const SolutionPage = () => {
  const { learnerId } = useParams();
  const navigate = useNavigate();
  const [ticketId, setTicketId] = useState('');
  const [mentorName, setMentorName] = useState('');
  const [mentorPosition, setMentorPosition] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
  const [solutionDescription, setSolutionDescription] = useState('');
  const [dateResolved, setDateResolved] = useState('');

  // Fetch existing ticket IDs from localStorage
  useEffect(() => {
    const existingTickets = JSON.parse(localStorage.getItem('counsellingTickets')) || [];
    if (existingTickets.length > 0) {
      setTicketId(existingTickets[0]); // Default to first ticket
      updateMentorDetails(existingTickets[0]); // Pre-populate mentor details
    }
  }, []);

  // Function to update mentor details based on selected ticketId
  const updateMentorDetails = (selectedTicketId) => {
    // Mock data: In a real app, fetch from backend based on ticketId
    const ticketData = {
      'TICKET-1698001234567-ABCDEF': { mentorName: 'Dr. John Smith', mentorPosition: 'Senior Mentor' },
      'TICKET-1698001234568-XYZ123': { mentorName: 'Ms. Emily Johnson', mentorPosition: 'Junior Mentor' },
      'TICKET-1698001234569-PQR456': { mentorName: 'Mr. David Lee', mentorPosition: 'Lead Mentor' },
    };
    const details = ticketData[selectedTicketId] || { mentorName: '', mentorPosition: '' };
    setMentorName(details.mentorName);
    setMentorPosition(details.mentorPosition);
  };

  const handleTicketChange = (e) => {
    const selectedTicketId = e.target.value;
    setTicketId(selectedTicketId);
    updateMentorDetails(selectedTicketId);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Collect form data
    const formData = {
      ticketId,
      learnerId,
      mentorName,
      mentorPosition,
      problemDescription,
      solutionDescription,
      dateResolved,
    };
    console.log('Solution Data:', formData); // Replace with API call in production
    alert('Solution submitted for Learner ' + learnerId);
    navigate(`/student-details/${learnerId}`);
  };

  return (
    <div className="container">
      <h1>Solution for Learner (ID: {learnerId})</h1>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          {/* Ticket ID Selection */}
          <label>
            Ticket ID:
            <select
              value={ticketId}
              onChange={handleTicketChange}
              required
              style={{ width: '100%', padding: '8px', backgroundColor: '#F5C7A9', border: '1px solid #A47864', borderRadius: '6px', color: '#1F2526' }}
            >
              <option value="">Select a Ticket</option>
              {JSON.parse(localStorage.getItem('counsellingTickets') || '[]').map((ticket) => (
                <option key={ticket} value={ticket}>
                  {ticket}
                </option>
              ))}
            </select>
          </label>

          {/* Mentor Details (Pre-filled based on ticketId) */}
          <label style={{ marginTop: '20px' }}>
            Mentor Name:
            <input
              type="text"
              value={mentorName}
              readOnly
              style={{ backgroundColor: '#2E3536', color: '#EDEDED' }}
            />
          </label>
          <label style={{ marginTop: '20px' }}>
            Mentor Position:
            <input
              type="text"
              value={mentorPosition}
              readOnly
              style={{ backgroundColor: '#2E3536', color: '#EDEDED' }}
            />
          </label>

          {/* Problem, Solution, and Date Resolved */}
          <label style={{ marginTop: '20px' }}>
            Problem Description:
            <textarea
              value={problemDescription}
              onChange={(e) => setProblemDescription(e.target.value)}
              required
              placeholder="Describe the problem"
            />
          </label>
          <label style={{ marginTop: '20px' }}>
            Solution Description:
            <textarea
              value={solutionDescription}
              onChange={(e) => setSolutionDescription(e.target.value)}
              required
              placeholder="Describe the solution"
            />
          </label>
          <label style={{ marginTop: '20px' }}>
            Date Resolved:
            <input
              type="date"
              value={dateResolved}
              onChange={(e) => setDateResolved(e.target.value)}
              required
            />
          </label>

          <div style={{ marginTop: '30px' }}>
            <button type="submit" className="btn-primary" style={{ width: '100%' }}>
              Submit Solution
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate(`/student-details/${learnerId}`)}
              style={{ marginTop: '10px', width: '100%' }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SolutionPage;